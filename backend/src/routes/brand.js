const Brand = require("../controllers/brand");

module.exports = (fear) => {
        const router = fear.createRouter();
        const handler = fear.getHandler();

        router.get("/all", handler.async(Brand.all));
        router.post("/new", Brand.create);
        router.route("/:id")
                .put(Brand.update)
                .get(Brand.read)
                .delete(Brand.delete);

        return router;
}