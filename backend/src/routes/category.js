const Category = require("../controllers/category");

module.exports = (fear) => {
      const router = fear.createRouter();
      const validator = fear.getValidator();
      const handler = fear.getHandler();

      router.get("/all", Category.all);
      router.post("/new", Category.create);
      router.route("/:id")
            .get(Category.read)
            .put(Category.update)
            .delete(Category.delete);

      return router;
};
