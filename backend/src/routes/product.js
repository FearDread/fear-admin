const { tryCatch } = require("../libs/handler/error");
const express = require("express");
const Product = require("../controllers/product");
const { isAdmin, isAuthorized } = require("../controllers/auth");
const router = express.Router();

router.get("/", Product.list)
      .get("/all", Product.productSearch)
      .post("/new", Product.create)
      .post("/review/:id", Product.review)
      .get("/edit/:id", Product.read);

router.route("/search", Product.search) 
router.route("/one").get(tryCatch(Product.read));
router.route("/:id")
        .get(tryCatch(Product.read))
        .put(tryCatch(Product.update))
        .delete(tryCatch(Product.delete));


module.exports = router;