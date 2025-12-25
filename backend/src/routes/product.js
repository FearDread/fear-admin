const Product = require("../controllers/product");

module.exports = (fear) => {
      const router = fear.createRouter();
      const validator = fear.getValidator();
      const handler = fear.getHandler();

      router.get("/", Product.list)
            .get("/all", Product.all)
            .post("/new", Product.create)
            .get("/edit/:id", Product.read);

      router.route("/search").post(handler.async(Product.search));
      router.route("/featured").get(handler.async(Product.featured));
      router.route("/one").get(handler.async(Product.read));
      router.route("/:id")
            .get(Product.read)
            .put(Product.update)
            .delete(handler.async(Product.delete));

      return router;
};