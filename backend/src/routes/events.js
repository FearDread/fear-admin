const Events = require('../controllers/events');

module.exports = (fear) => {
        const router = fear.createRouter();
        const handler = fear.getHandler();
        const validator = fear.getValidator();

        router.get("/all", Events.all);
        router.post("/new", Events.create);
        router.route("/:id")
                .put(Events.update)
                .get(Events.read)
                .delete(Events.delete);
       
        return router;
};