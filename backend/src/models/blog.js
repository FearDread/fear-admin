const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    section: { type:String, required: true, default: "Marketing" },
    category: { type: mongoose.Schema.Types.String, ref: "Category" },
    numViews: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    isDisliked: { type: Boolean, default: false },
    likes: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    author: { type: String, default: "Admin" },
    images: [],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
