const { tryCatch } = require("../libs/handler/error");
const express = require("express");
const Product = require("../controllers/product");
const Review = require("../controllers/review");
const router = express.Router();

router.post("/new", Review.create)
      .get("/product/:id", Review.read);

module.exports = router;