const Password = require("../controllers/auth/password");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();

    router.post('/forgot-password', Password.resetPassword);
    router.post('/reset/:token', Password.forgotPasswordToken);
    router.put('/update', Password.updatePassword);

    return router;
};