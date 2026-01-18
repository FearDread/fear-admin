const Password = require("../controllers/auth/password");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();

    router.post('/forgot', Password.forgot);
    router.post('/reset/:token', Password.reset);
    router.put('/update', handler.authenticate, Password.update);

    return router;
};