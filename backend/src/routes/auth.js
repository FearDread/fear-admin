const Auth = require("../controllers/auth");
const GA = require('../libs/google');
const passport = require("passport");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const validator = fear.getValidator();
    //const passport = fear.getPassport();

    // Public
    router.post("/login", handler.async(Auth.login));
    router.post("/logout", handler.async(Auth.logout));
    router.post("/register", handler.async(Auth.register));
    router.post('/google', handler.async(Auth.googleAuth));

    // Protected — all of these read req.user, so isAuthorized must run first.
    router.get("/me", Auth.isAuthorized, handler.async(Auth.getCurrentUser));
    router.put("/refresh-token", Auth.isAuthorized, handler.async(Auth.refreshToken));
    router.put("/update-profile", Auth.isAuthorized, handler.async(Auth.updateProfile));
    router.put("/update-preferences", Auth.isAuthorized, handler.async(Auth.updatePreferences));
    router.post('/google/link', Auth.isAuthorized, handler.async(Auth.linkGoogleAccount));
    router.delete('/google/unlink', Auth.isAuthorized, handler.async(Auth.unlinkGoogleAccount));

    router.get('/google/url', handler.async(GA.auth));
    router.get('/google/callback', handler.async(GA.callback));

    return router;
}