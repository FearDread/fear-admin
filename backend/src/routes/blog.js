const Blog = require("../controllers/blog");

module.exports = (fear) => {
      const router = fear.createRouter();
      const handler = fear.getHandler();

      router.get("/all", handler.async(Blog.all));
      router.post("/new", handler.async(Blog.create));
      router.put("/likes", handler.async(Blog.likes));
      router.put("/dislikes", handler.async(Blog.dislikes));
      router.get("/sections", handler.async(Blog.sections));

      router.route("/:id")
            .get(Blog.read)
            .put(Blog.update)
            .delete(Blog.delete);

      return router;
}
