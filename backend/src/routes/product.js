const Product = require("../controllers/product");

module.exports = (fear) => {
      const router = fear.createRouter();
      const validator = fear.getValidator();
      const handler = fear.getHandler();

      router.get("/", Product.list)
            .get("/all", Product.all)
            .post("/new", Product.create)
            .get("/edit/:id", Product.read);

      router.route("/search").post(Product.search);
      router.route('/search/all').get(Product.productSearch);
      router.route("/one").get(handler.async(Product.read));
      router.route("/:id")
            .get(handler.async(Product.read))
            .put(handler.async(Product.update))
            .delete(handler.async(Product.delete));

      return router;
};