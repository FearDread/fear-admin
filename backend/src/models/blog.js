const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      index: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },

    subtitle: {
      type: String,
      trim: true,
      maxlength: [250, "Subtitle cannot exceed 250 characters"]
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"]
    },

    content: {
      type: String,
      required: [true, "Blog content is required"]
    },

    contentHtml: {
      type: String
    },

    images: [{
      public_id: { type: String },
      url: { type: String },
      secure_url: { type: String },
      alt: { type: String },
      caption: { type: String },
      order: { type: Number, default: 0 }
    }],

    video: {
      url: { type: String },
      embedCode: { type: String },
      thumbnail: { type: String },
      duration: { type: Number }
    },

    // Author Information
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true
    },

    authorName: {
      type: String,
      default: "Admin"
    },

    coAuthors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    // Classification
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true
    },

    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }],

    section: {
      type: String,
      default: "Marketing",
      trim: true,
      index: true
    },

    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      index: true
    }],

    topics: [{
      type: String,
      trim: true
    }],

    // Publishing Status
    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "archived", "private"],
      default: "draft",
      index: true
    },

    published: {
      type: Boolean,
      default: false,
      index: true
    },

    publishedAt: {
      type: Date,
      index: true
    },

    scheduledAt: {
      type: Date,
      index: true
    },

    archivedAt: {
      type: Date
    },

    // Visibility and Access
    visibility: {
      type: String,
      enum: ["public", "private", "password", "members-only"],
      default: "public",
      index: true
    },

    password: {
      type: String,
      select: false
    },

    accessLevel: {
      type: String,
      enum: ["free", "premium", "subscriber-only"],
      default: "free"
    },

    // Featured and Priority
    featured: {
      type: Boolean,
      default: false,
      index: true
    },

    sticky: {
      type: Boolean,
      default: false,
      index: true
    },

    trending: {
      type: Boolean,
      default: false,
      index: true
    },

    priority: {
      type: Number,
      default: 0,
      index: true
    },

    displayOrder: {
      type: Number,
      default: 0
    },

    // Engagement Metrics
    views: {
      type: Number,
      default: 0,
      index: true
    },

    numViews: {
      type: Number,
      default: 0
    },

    uniqueViews: {
      type: Number,
      default: 0
    },

    shares: {
      type: Number,
      default: 0
    },

    bookmarks: {
      type: Number,
      default: 0
    },

    // Likes and Dislikes
    isLiked: {
      type: Boolean,
      default: false
    },

    isDisliked: {
      type: Boolean,
      default: false
    },

    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    likeCount: {
      type: Number,
      default: 0
    },

    dislikeCount: {
      type: Number,
      default: 0
    },

    // Comments
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }],

    commentCount: {
      type: Number,
      default: 0
    },

    allowComments: {
      type: Boolean,
      default: true
    },

    // Ratings
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
      distribution: {
        five: { type: Number, default: 0 },
        four: { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two: { type: Number, default: 0 },
        one: { type: Number, default: 0 }
      }
    },

    // Reading Time
    readingTime: {
      type: Number, // in minutes
      default: 0
    },

    wordCount: {
      type: Number,
      default: 0
    },

    // SEO
    seo: {
      metaTitle: {
        type: String,
        maxlength: [70, "Meta title cannot exceed 70 characters"]
      },
      metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"]
      },
      metaKeywords: [{ type: String }],
      focusKeyword: { type: String },
      ogTitle: { type: String },
      ogDescription: { type: String },
      ogImage: {
        public_id: { type: String },
        url: { type: String }
      },
      twitterTitle: { type: String },
      twitterDescription: { type: String },
      twitterImage: {
        public_id: { type: String },
        url: { type: String }
      },
      canonicalUrl: { type: String },
      noIndex: { type: Boolean, default: false },
      noFollow: { type: Boolean, default: false }
    },

    // Related Content
    relatedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
    }],

    series: {
      name: { type: String },
      part: { type: Number },
      totalParts: { type: Number }
    },

    // Content Structure
    tableOfContents: [{
      id: { type: String },
      title: { type: String },
      level: { type: Number },
      children: [mongoose.Schema.Types.Mixed]
    }],

    // Format and Type
    format: {
      type: String,
      enum: ["standard", "video", "audio", "gallery", "quote", "link"],
      default: "standard"
    },

    postType: {
      type: String,
      enum: ["article", "tutorial", "news", "review", "interview", "case-study", "guide"],
      default: "article"
    },

    // Language
    language: {
      type: String,
      default: "en",
      index: true
    },

    translations: [{
      language: { type: String },
      postId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
      }
    }],

    // Newsletter
    includeInNewsletter: {
      type: Boolean,
      default: false
    },

    sentInNewsletter: {
      type: Boolean,
      default: false
    },

    newsletterSentAt: {
      type: Date
    },

    // Analytics
    analytics: {
      averageTimeOnPage: { type: Number, default: 0 },
      bounceRate: { type: Number, default: 0 },
      clickThroughRate: { type: Number, default: 0 },
      conversionRate: { type: Number, default: 0 },
      socialShares: {
        facebook: { type: Number, default: 0 },
        twitter: { type: Number, default: 0 },
        linkedin: { type: Number, default: 0 },
        pinterest: { type: Number, default: 0 },
        reddit: { type: Number, default: 0 }
      }
    },

    // Custom Fields
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },

    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },

    // Workflow
    workflow: {
      status: {
        type: String,
        enum: ["draft", "in-review", "approved", "rejected", "published"],
        default: "draft"
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      reviewedAt: { type: Date },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      approvedAt: { type: Date },
      rejectionReason: { type: String }
    },

    // Version Control
    version: {
      type: Number,
      default: 1
    },

    revisions: [{
      version: { type: Number },
      content: { type: String },
      title: { type: String },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      updatedAt: { type: Date, default: Date.now },
      changeLog: { type: String }
    }],

    // Moderation
    flagged: {
      type: Boolean,
      default: false
    },

    flagCount: {
      type: Number,
      default: 0
    },

    flagReasons: [{
      reason: { type: String },
      reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      reportedAt: { type: Date, default: Date.now }
    }],

    // Admin Fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    lastEditedAt: {
      type: Date
    },

    notes: [{
      content: { type: String },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      createdAt: { type: Date, default: Date.now }
    }],

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },

    deletedAt: {
      type: Date
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
blogSchema.index({ title: 1, status: 1 });
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ category: 1, published: 1 });
blogSchema.index({ featured: 1, published: 1 });
blogSchema.index({ tags: 1, published: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ views: -1 });
blogSchema.index({ likeCount: -1 });
blogSchema.index({ "ratings.average": -1 });
blogSchema.index({ slug: 1, status: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ section: 1, published: 1 });

// Compound indexes
blogSchema.index({ published: 1, featured: 1, publishedAt: -1 });
blogSchema.index({ author: 1, published: 1, publishedAt: -1 });
blogSchema.index({ category: 1, published: 1, views: -1 });

// Text index for search
blogSchema.index({
  title: "text",
  subtitle: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
  authorName: "text"
});

// Virtuals
blogSchema.virtual("url").get(function() {
  return `/blog/${this.slug}`;
});

blogSchema.virtual("isPublished").get(function() {
  return this.published && this.status === "published";
});

blogSchema.virtual("likeRatio").get(function() {
  const total = this.likeCount + this.dislikeCount;
  return total > 0 ? ((this.likeCount / total) * 100).toFixed(2) : 0;
});

blogSchema.virtual("engagementScore").get(function() {
  return (
    this.views * 1 +
    this.likeCount * 5 +
    this.commentCount * 10 +
    this.shares * 15 +
    this.bookmarks * 20
  );
});

// Pre-save middleware
blogSchema.pre("save", async function(next) {
  // Generate slug
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });

    // Ensure unique slug
    const slugRegEx = new RegExp(`^${this.slug}(-[0-9]*)?$`, "i");
    const postsWithSlug = await this.constructor.find({ slug: slugRegEx });
    
    if (postsWithSlug.length > 0) {
      this.slug = `${this.slug}-${postsWithSlug.length}`;
    }
  }

  // Calculate word count and reading time
  if (this.isModified("content")) {
    const words = this.content.trim().split(/\s+/).length;
    this.wordCount = words;
    this.readingTime = Math.ceil(words / 200); // Average reading speed: 200 words/min
  }

  // Sync like/dislike counts
  if (this.isModified("likes")) {
    this.likeCount = this.likes.length;
  }
  
  if (this.isModified("dislikes")) {
    this.dislikeCount = this.dislikes.length;
  }

  // Sync comment count
  if (this.isModified("comments")) {
    this.commentCount = this.comments.length;
  }

  // Sync numViews with views
  if (this.isModified("views")) {
    this.numViews = this.views;
  }

  // Auto-publish if scheduled time has passed
  if (this.status === "scheduled" && this.scheduledAt && this.scheduledAt <= new Date()) {
    this.status = "published";
    this.published = true;
    this.publishedAt = new Date();
  }

  // Set published date on first publish
  if (this.isModified("published") && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Set SEO defaults
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = this.title.substring(0, 70);
  }
  
  if (!this.seo.metaDescription && this.excerpt) {
    this.seo.metaDescription = this.excerpt.substring(0, 160);
  }

  next();
});

// Pre-update middleware
blogSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();
  
  if (update.title) {
    update.slug = slugify(update.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  if (update.content) {
    const words = update.content.trim().split(/\s+/).length;
    update.wordCount = words;
    update.readingTime = Math.ceil(words / 200);
  }

  update.lastEditedAt = new Date();
  
  next();
});

// Instance methods
blogSchema.methods = {
  // Increment view count
  incrementViews: async function() {
    this.views += 1;
    this.numViews += 1;
    return this.save();
  },

  // Increment unique view count
  incrementUniqueViews: async function() {
    this.uniqueViews += 1;
    return this.save();
  },

  // Toggle like
  toggleLike: function(userId) {
    const likeIndex = this.likes.indexOf(userId);
    const dislikeIndex = this.dislikes.indexOf(userId);

    // Remove from dislikes if exists
    if (dislikeIndex > -1) {
      this.dislikes.splice(dislikeIndex, 1);
      this.dislikeCount -= 1;
      this.isDisliked = false;
    }

    // Toggle like
    if (likeIndex > -1) {
      this.likes.splice(likeIndex, 1);
      this.likeCount -= 1;
      this.isLiked = false;
    } else {
      this.likes.push(userId);
      this.likeCount += 1;
      this.isLiked = true;
    }

    return this.save();
  },

  // Toggle dislike
  toggleDislike: function(userId) {
    const likeIndex = this.likes.indexOf(userId);
    const dislikeIndex = this.dislikes.indexOf(userId);

    // Remove from likes if exists
    if (likeIndex > -1) {
      this.likes.splice(likeIndex, 1);
      this.likeCount -= 1;
      this.isLiked = false;
    }

    // Toggle dislike
    if (dislikeIndex > -1) {
      this.dislikes.splice(dislikeIndex, 1);
      this.dislikeCount -= 1;
      this.isDisliked = false;
    } else {
      this.dislikes.push(userId);
      this.dislikeCount += 1;
      this.isDisliked = true;
    }

    return this.save();
  },

  // Publish post
  publish: function() {
    this.published = true;
    this.status = "published";
    this.publishedAt = new Date();
    return this.save();
  },

  // Unpublish post
  unpublish: function() {
    this.published = false;
    this.status = "draft";
    return this.save();
  },

  // Schedule post
  schedule: function(date) {
    this.status = "scheduled";
    this.scheduledAt = date;
    return this.save();
  },

  // Archive post
  archive: function() {
    this.status = "archived";
    this.archivedAt = new Date();
    return this.save();
  },

  // Add to featured
  addToFeatured: function() {
    this.featured = true;
    return this.save();
  },

  // Remove from featured
  removeFromFeatured: function() {
    this.featured = false;
    return this.save();
  },

  // Create revision
  createRevision: function(userId, changeLog) {
    this.revisions.push({
      version: this.version,
      content: this.content,
      title: this.title,
      updatedBy: userId,
      changeLog: changeLog || "Content updated"
    });
    this.version += 1;
    return this.save();
  },

  // Soft delete
  softDelete: function(userId) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    this.published = false;
    this.status = "archived";
    return this.save();
  },

  // Restore
  restore: function() {
    this.isDeleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    this.status = "draft";
    return this.save();
  }
};

// Static methods
blogSchema.statics = {
  // Get published posts
  getPublished: function(limit = 10) {
    return this.find({
      published: true,
      status: "published",
      isDeleted: false
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate("author", "name avatar email")
      .populate("category", "title slug")
      .exec();
  },

  // Get featured posts
  getFeatured: function(limit = 5) {
    return this.find({
      featured: true,
      published: true,
      isDeleted: false
    })
      .sort({ priority: -1, publishedAt: -1 })
      .limit(limit)
      .populate("author", "name avatar")
      .populate("category", "title slug")
      .exec();
  },

  // Get trending posts
  getTrending: function(limit = 10, days = 7) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    return this.find({
      published: true,
      isDeleted: false,
      publishedAt: { $gte: dateLimit }
    })
      .sort({ views: -1, likeCount: -1 })
      .limit(limit)
      .populate("author", "name avatar")
      .populate("category", "title slug")
      .exec();
  },

  // Get popular posts
  getPopular: function(limit = 10) {
    return this.find({
      published: true,
      isDeleted: false
    })
      .sort({ views: -1, likeCount: -1, commentCount: -1 })
      .limit(limit)
      .populate("author", "name avatar")
      .populate("category", "title slug")
      .exec();
  },

  // Get by author
  getByAuthor: function(authorId, limit = 10) {
    return this.find({
      author: authorId,
      published: true,
      isDeleted: false
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate("category", "title slug")
      .exec();
  },

  // Get by category
  getByCategory: function(categoryId, limit = 10) {
    return this.find({
      category: categoryId,
      published: true,
      isDeleted: false
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate("author", "name avatar")
      .exec();
  },

  // Get by tags
  getByTag: function(tag, limit = 10) {
    return this.find({
      tags: tag,
      published: true,
      isDeleted: false
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate("author", "name avatar")
      .populate("category", "title slug")
      .exec();
  },

  // Search posts
  searchPosts: function(query, options = {}) {
    const searchQuery = {
      $text: { $search: query },
      published: true,
      isDeleted: false
    };

    return this.find(searchQuery, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(options.limit || 20)
      .populate("author", "name avatar")
      .populate("category", "title slug")
      .exec();
  },

  // Get related posts
  getRelated: function(postId, tags, categoryId, limit = 5) {
    return this.find({
      _id: { $ne: postId },
      $or: [
        { tags: { $in: tags } },
        { category: categoryId }
      ],
      published: true,
      isDeleted: false
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate("author", "name avatar")
      .exec();
  }
};

// Query helpers
blogSchema.query = {
  published: function() {
    return this.where({ published: true, status: "published", isDeleted: false });
  },

  featured: function() {
    return this.where({ featured: true, published: true, isDeleted: false });
  },

  byAuthor: function(authorId) {
    return this.where({ author: authorId, published: true, isDeleted: false });
  },

  byCategory: function(categoryId) {
    return this.where({ category: categoryId, published: true, isDeleted: false });
  },

  byTag: function(tag) {
    return this.where({ tags: tag, published: true, isDeleted: false });
  },

  recent: function(days = 30) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    return this.where({ publishedAt: { $gte: dateLimit }, published: true, isDeleted: false });
  }
};

module.exports = mongoose.model("Blog", blogSchema);