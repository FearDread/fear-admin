const Auth = require("../controllers/auth");
const Password = require('../controllers/auth/password');
const GA = require('../libs/google');


module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const validator = fear.getValidator();
    const { requireUser, optionalUser, withoutToken, loginLimiter } = fear.getVchatAuth();

    router.post('/login', loginLimiter, withoutToken, handler.async(Auth.login));
    router.post("/logout", handler.async(Auth.logout));
    router.post("/register", handler.async(Auth.register));
    router.post('/google', handler.async(Auth.googleAuth));
    router.get('/session', handler.async(Auth.session));

    // Protected — all of these read req.user, so isAuthorized must run first.
    router.get("/me", Auth.isAuthorized, handler.async(Auth.getCurrentUser));
    router.put("/refresh-token", Auth.isAuthorized, handler.async(Auth.refreshToken));
    router.put("/update-profile", Auth.isAuthorized, handler.async(Auth.updateProfile));
    router.put("/update-preferences", Auth.isAuthorized, handler.async(Auth.updatePreferences));

    router.post('/google/link', Auth.isAuthorized, handler.async(Auth.linkGoogleAccount));
    router.delete('/googl e/unlink', Auth.isAuthorized, handler.async(Auth.unlinkGoogleAccount));
    router.get('/google/url', handler.async(GA.auth));
    router.get('/google/callback', handler.async(GA.callback));

    /* Auth password recovery routes */
    router.post('/forgot-password', loginLimiter, handler.async(Password.forgotPasswordToken));
    router.get('/verify-reset-token/:token', loginLimiter, handler.async(Password.verifyResetToken));
    router.post('/reset-password/:token', loginLimiter, handler.async(Password.resetPassword));
    router.put('/update-password', Auth.isAuthorized, handler.async(Password.updatePassword));

    return router;
}