const { tryCatch } = require("../libs/handler/error");
const express = require("express");
const Product = require("../controllers/product");
const { isAdmin, isAuthorized } = require("../controllers/auth");
const router = express.Router();

router.get("/", Product.list)
      .get("/all", Product.all)
      .post("/new", Product.create)
      .get("/search", Product.search)
      .post("/review", Product.review)
      .get("/edit/:id", Product.read);

router.route("/rating").put(tryCatch(Product.rating));
router.route("/trendy").get(tryCatch(Product.trending));   

router.route("/:id")
        .get(tryCatch(Product.read))
        .put(tryCatch(Product.update))
        .delete(tryCatch(Product.delete));


module.exports = router;