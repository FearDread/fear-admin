const Password = require("../controllers/auth/password");
const Auth = require("../controllers/auth");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();

    // Public
    router.post('/forgot-password', handler.async(Password.forgotPasswordToken));
    router.post('/reset-password/:token', handler.async(Password.resetPassword));
    router.get('/verify-reset-token/:token', handler.async(Password.verifyResetToken));

    // Needs a signed-in user: the controller reads req.user
    router.put('/update-password', Auth.isAuthorized, handler.async(Password.updatePassword));

    return router;
};