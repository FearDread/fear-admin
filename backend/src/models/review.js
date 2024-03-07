const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: false,
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "products",
        require: true,
    },
    name: {
        type: String,
        required: true,
    },
    ratings: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    recommend: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    avatar: {
        type: String,
        required: true,
    }
})

const Review = mongoose.model('reviews', reviewSchema)
module.exports = Review