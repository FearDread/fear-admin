
const User = require("../controllers/user");
const Auth = require('../controllers/auth');

module.exports = (fear) => {
        const router = fear.createRouter();
        const validator = fear.getValidator();
        const handler = fear.getHandler();

        router.get("/all", User.all);
        router.route("/:id", Auth.isAuthorized)
                .get(User.read)
                .post(User.create)
                .put(User.update)
                .delete(User.delete);

        return router;
};