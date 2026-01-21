const mongoose = require("mongoose");
const slugify = require("slugify");

const brandSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
      index: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"]
    },
    
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    
    title: {
      type: String,
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"]
    },
    
    logo: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
      secure_url: { type: String, default: "" }
    },
    // Status and Visibility
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "archived"],
      default: "active",
      index: true
    },

    // Relationships
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }],
    
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }],

    // Tags and Classification
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
// Admin and Management
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    
    notes: [{
      content: { type: String },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      createdAt: { type: Date, default: Date.now }
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
brandSchema.index({ name: 1, isActive: 1 });
brandSchema.index({ featured: 1, isActive: 1 });
brandSchema.index({ slug: 1, isActive: 1 });
brandSchema.index({ status: 1, featured: 1 });
brandSchema.index({ tags: 1 });
brandSchema.index({ categories: 1 });
brandSchema.index({ createdAt: -1 });

// Text index for search
brandSchema.index({
  name: "text",
  title: "text",
  tags: "text"
});

// Virtual for full URL
brandSchema.virtual("url").get(function() {
  return `/brands/${this.slug}`;
});

// Virtual for product count (if not using stats)
brandSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "brand",
  count: true
});

// Pre-save middleware to generate slug
brandSchema.pre("save", async function(next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });

    // Ensure unique slug
    const slugRegEx = new RegExp(`^${this.slug}(-[0-9]*)?$`, "i");
    const brandsWithSlug = await this.constructor.find({ slug: slugRegEx });
    
    if (brandsWithSlug.length > 0) {
      this.slug = `${this.slug}-${brandsWithSlug.length}`;
    }
  }
  
  // Sync isActive with active field
  if (this.isModified("isActive")) {
    this.active = this.isActive;
  }

  // Set title to name if not provided
  if (!this.title) {
    this.title = this.name;
  }
  
  next();
});

// Pre-update middleware
brandSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();
  
  if (update.name) {
    update.slug = slugify(update.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  
  if (update.isActive !== undefined) {
    update.active = update.isActive;
  }
  next();
});

// Instance methods
brandSchema.methods = {
  // Increment view count
  incrementViews: function() {
    this.stats.viewCount += 1;
    return this.save();
  },

  // Increment click count
  incrementClicks: function() {
    this.stats.clickCount += 1;
    return this.save();
  },

  // Update product count
  updateProductCount: async function() {
    const Product = mongoose.model("Product");
    const count = await Product.countDocuments({ brand: this._id, isActive: true });
    this.stats.productCount = count;
    return this.save();
  },
  // Soft delete
  softDelete: function(userId) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    this.isActive = false;
    this.active = false;
    return this.save();
  },

  // Restore from soft delete
  restore: function() {
    this.isDeleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    this.isActive = true;
    this.active = true;
    return this.save();
  }
};

// Static methods
brandSchema.statics = {
  // Get featured brands
  getFeatured: function(limit = 10) {
    return this.find({ 
      featured: true, 
      isActive: true,
      isDeleted: false 
    })
      .sort({ priority: -1, displayOrder: 1 })
      .limit(limit)
      .exec();
  },

  // Get popular brands
  getPopular: function(limit = 10) {
    return this.find({ 
      isActive: true,
      isDeleted: false 
    })
      .sort({ "stats.productCount": -1, "stats.totalSales": -1 })
      .limit(limit)
      .exec();
  },

  // Search brands
  searchBrands: function(query, options = {}) {
    const searchQuery = {
      $text: { $search: query },
      isActive: true,
      isDeleted: false
    };
    
    return this.find(searchQuery, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(options.limit || 20)
      .exec();
  }
};

// Query helpers
brandSchema.query = {
  active: function() {
    return this.where({ isActive: true, isDeleted: false });
  },
  
  featured: function() {
    return this.where({ featured: true, isActive: true, isDeleted: false });
  },
  
  byCategory: function(categoryId) {
    return this.where({ categories: categoryId, isActive: true, isDeleted: false });
  }
};

module.exports = mongoose.model("Brand", brandSchema);