const Auth = require("../controllers/auth");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const validator = fear.getValidator();

    router.post("/login", handler.async(Auth.login))
    router.post("/logout", handler.async(Auth.logout))
    router.post("/register", handler.async(Auth.register))

    return router;
}