const Hipcomic = require("../controllers/hipcomic");

module.exports = (fear) => {
    const router = fear.createRouter();
    const validator = fear.getValidator();
    const handler = fear.getHandler();


    router.get("/", handler.async(Hipcomic.list))
          .get("/all", handler.async(Hipcomic.all))
          .post("/new", Hipcomic.create)
          .get("/edit/:id", Hipcomic.read);

    router.route("/:id")
        .get(Hipcomic.read)
        .put(Hipcomic.update)
        .delete(handler.async(Hipcomic.delete));

    return router;

}