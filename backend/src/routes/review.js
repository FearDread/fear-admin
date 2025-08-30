const { tryCatch } = require("../libs/handler/error");
const express = require("express");
const Review = require("../controllers/review");
const router = express.Router();

router.post("/new", Review.review)
      .get("/rating", Review.rating)
      .get("/product/:id", Review.getProductReviews);

module.exports = router;