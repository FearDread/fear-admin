
const User = require("../controllers/user");

module.exports = (fear) => {
        const router = fear.createRouter();
        const validator = fear.getValidator();
        const handler = fear.getHandler();

        router.get("/all", User.all);
        router.route("/:id", validator.isAuthorized)
                .get(User.read)
                .post(User.create)
                .put(User.update)
                .delete(User.delete);

        return router;
};