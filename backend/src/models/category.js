const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, index: true,
      required: [true, "Category title is required"],
      maxlength: [100, "Category title cannot exceed 100 characters"],
    },
    slug: { type: String,  unique: true, lowercase: true, index: true },
    description: { type: String, trim: true,
       maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    icon: { type: String, default: "fa-tag",  trim: true },
    color: { type: String, default: "#7934f3", trim: true,
       match: [/^#[0-9A-F]{6}$/i, "Color must be a valid hex color"]
    },
    image: { public_id: { type: String, default: "" }, 
      url: { type: String, default: "" }, 
      secure_url: { type: String, default: "" },
    },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null, index: true },
    ancestors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    level: { type: Number, default: 0, min: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    status: { type: String, default: "active", index: true,
      enum: ["active", "inactive", "archived", "draft"],
    },
    type: {
      type: String, default: "general", index: true,
      enum: ["product", "blog", "post", "page", "general", "custom"],
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
categorySchema.index({ name: 1, type: 1 });
categorySchema.index({ slug: 1, type: 1 });
categorySchema.index({ parent: 1, isActive: 1 });
categorySchema.index({ featured: 1, isActive: 1 });
categorySchema.index({ type: 1, isActive: 1 });
categorySchema.index({ level: 1, displayOrder: 1 });
categorySchema.index({ "stats.itemCount": -1 });
categorySchema.index({ "stats.productCount": -1 });
categorySchema.index({ createdAt: -1 });
categorySchema.index({ path: 1 });

// Compound indexes
categorySchema.index({ type: 1, parent: 1, isActive: 1 });
categorySchema.index({ featured: 1, type: 1, displayOrder: 1 });

// Text index for search
categorySchema.index({
  name: "text",
  title: "text",
  description: "text",
  tags: "text"
});

// Virtuals
categorySchema.virtual("url").get(function() {
  return `/category/${this.slug}`;
});

categorySchema.virtual("fullPath").get(function() {
  return this.path || this.slug;
});

categorySchema.virtual("isParent").get(function() {
  return this.children && this.children.length > 0;
});

categorySchema.virtual("hasParent").get(function() {
  return this.parent !== null && this.parent !== undefined;
});

categorySchema.virtual("childCount").get(function() {
  return this.children ? this.children.length : 0;
});

// Virtual populate for counting items
categorySchema.virtual("itemCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  count: true
});

categorySchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  count: true
});

categorySchema.virtual("postCount", {
  ref: "Blog",
  localField: "_id",
  foreignField: "category",
  count: true
});

// Pre-save middleware
categorySchema.pre("save", async function(next) {
  // Generate slug
  if (this.isModified("name") || this.isModified("title")) {
    const nameToSlugify = this.title || this.name;
    this.slug = slugify(nameToSlugify, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });

    // Ensure unique slug
    const slugRegEx = new RegExp(`^${this.slug}(-[0-9]*)?$`, "i");
    const categoriesWithSlug = await this.constructor.find({ 
      slug: slugRegEx,
      _id: { $ne: this._id }
    });
    
    if (categoriesWithSlug.length > 0) {
      this.slug = `${this.slug}-${categoriesWithSlug.length}`;
    }
  }

  // Sync name and title if one is missing
  if (!this.name && this.title) {
    this.name = this.title;
  }
  if (!this.title && this.name) {
    this.title = this.name;
  }

  // Sync isActive with active
  if (this.isModified("isActive")) {
    this.active = this.isActive;
  }
  if (this.isModified("active")) {
    this.isActive = this.active;
  }

  // Calculate level and build ancestors
  if (this.isModified("parent")) {
    if (this.parent) {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = parent.level + 1;
        this.ancestors = [...parent.ancestors, parent._id];
        
        // Build path
        const parentPath = parent.path || parent.slug;
        this.path = `${parentPath}/${this.slug}`;

        // Add to parent's children
        if (!parent.children.includes(this._id)) {
          parent.children.push(this._id);
          await parent.save();
        }
      }
    } else {
      this.level = 0;
      this.ancestors = [];
      this.path = this.slug;
    }
  }
  next();
});

// Pre-update middleware
categorySchema.pre("findOneAndUpdate", async function(next) {
  const update = this.getUpdate();
  
  if (update.name || update.title) {
    const nameToSlugify = update.title || update.name;
    update.slug = slugify(nameToSlugify, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  
  if (update.isActive !== undefined) {
    update.active = update.isActive;
  }
  
  if (update.active !== undefined) {
    update.isActive = update.active;
  }
  
  next();
});

// Post-remove middleware to clean up references
categorySchema.post("remove", async function(doc) {
  // Remove from parent's children
  if (doc.parent) {
    await this.constructor.updateOne(
      { _id: doc.parent },
      { $pull: { children: doc._id } }
    );
  }

  // Update children to remove parent reference
  if (doc.children && doc.children.length > 0) {
    await this.constructor.updateMany(
      { _id: { $in: doc.children } },
      { $set: { parent: null, level: 0 } }
    );
  }
});

// Instance methods
categorySchema.methods = {
  // Get full category path
  getFullPath: async function() {
    if (this.ancestors.length === 0) {
      return [this];
    }

    const ancestors = await this.constructor
      .find({ _id: { $in: this.ancestors } })
      .sort({ level: 1 });

    return [...ancestors, this];
  },

  // Get all descendants
  getDescendants: async function() {
    return await this.constructor.find({
      ancestors: this._id,
      isDeleted: false
    }).sort({ level: 1, displayOrder: 1 });
  },

  // Get immediate children
  getChildren: async function() {
    return await this.constructor
      .find({ 
        parent: this._id,
        isDeleted: false 
      })
      .sort({ displayOrder: 1 });
  },

  // Get siblings
  getSiblings: async function() {
    return await this.constructor
      .find({
        parent: this.parent,
        _id: { $ne: this._id },
        isDeleted: false
      })
      .sort({ displayOrder: 1 });
  },

  // Update item count
  updateItemCount: async function() {
    const Product = mongoose.model("Product");
    const Blog = mongoose.model("Blog");
    
    const productCount = await Product.countDocuments({ 
      category: this._id,
      isActive: true 
    });
    
    const postCount = await Blog.countDocuments({ 
      category: this._id,
      published: true 
    });

    this.stats.productCount = productCount;
    this.stats.postCount = postCount;
    this.stats.itemCount = productCount + postCount;
    
    return this.save();
  },

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

  // Move to different parent
  moveTo: async function(newParentId) {
    // Remove from old parent's children
    if (this.parent) {
      await this.constructor.updateOne(
        { _id: this.parent },
        { $pull: { children: this._id } }
      );
    }

    // Update new parent
    if (newParentId) {
      const newParent = await this.constructor.findById(newParentId);
      if (newParent) {
        this.parent = newParentId;
        this.level = newParent.level + 1;
        this.ancestors = [...newParent.ancestors, newParent._id];
        
        // Add to new parent's children
        if (!newParent.children.includes(this._id)) {
          newParent.children.push(this._id);
          await newParent.save();
        }
      }
    } else {
      this.parent = null;
      this.level = 0;
      this.ancestors = [];
    }

    return this.save();
  },
};

// Static methods
categorySchema.statics = {
  // Get root categories (top level)
  getRootCategories: function(type = null) {
    const query = {
      parent: null,
      isActive: true,
      isDeleted: false
    };
    
    if (type) {
      query.type = type;
    }

    return this.find(query)
      .sort({ displayOrder: 1, name: 1 })
      .exec();
  },

  // Get category tree
  getCategoryTree: async function(type = null) {
    const query = {
      isActive: true,
      isDeleted: false
    };
    
    if (type) {
      query.type = type;
    }

    const categories = await this.find(query)
      .sort({ level: 1, displayOrder: 1 })
      .exec();

    // Build tree structure
    const categoryMap = new Map();
    const tree = [];

    categories.forEach(cat => {
      categoryMap.set(cat._id.toString(), { ...cat.toObject(), children: [] });
    });

    categories.forEach(cat => {
      const node = categoryMap.get(cat._id.toString());
      if (cat.parent) {
        const parent = categoryMap.get(cat.parent.toString());
        if (parent) {
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  },

  // Get featured categories
  getFeatured: function(type = null, limit = 10) {
    const query = {
      featured: true,
      isActive: true,
      isDeleted: false
    };
    
    if (type) {
      query.type = type;
    }

    return this.find(query)
      .sort({ priority: -1, displayOrder: 1 })
      .limit(limit)
      .exec();
  },

  // Get popular categories
  getPopular: function(type = null, limit = 10) {
    const query = {
      isActive: true,
      isDeleted: false
    };
    
    if (type) {
      query.type = type;
    }

    return this.find(query)
      .sort({ "stats.itemCount": -1, "stats.viewCount": -1 })
      .limit(limit)
      .exec();
  },

  // Search categories
  searchCategories: function(query, options = {}) {
    const searchQuery = {
      $text: { $search: query },
      isActive: true,
      isDeleted: false
    };
    
    if (options.type) {
      searchQuery.type = options.type;
    }

    return this.find(searchQuery, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(options.limit || 20)
      .exec();
  },

  // Get by type
  getByType: function(type, options = {}) {
    return this.find({
      type,
      isActive: true,
      isDeleted: false
    })
      .sort(options.sort || { displayOrder: 1 })
      .limit(options.limit || 0)
      .exec();
  }
};

// Query helpers
categorySchema.query = {
  active: function() {
    return this.where({ isActive: true, isDeleted: false });
  },

  featured: function() {
    return this.where({ featured: true, isActive: true, isDeleted: false });
  },

  byType: function(type) {
    return this.where({ type, isActive: true, isDeleted: false });
  },

  topLevel: function() {
    return this.where({ parent: null, isActive: true, isDeleted: false });
  },

  hasChildren: function() {
    return this.where({ "children.0": { $exists: true } });
  }
};

module.exports = mongoose.model("Category", categorySchema);