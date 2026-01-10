const Auth = require("../controllers/auth");
const passport = require("../libs/passport");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const validator = fear.getValidator();
    //const passport = fear.getPassport();

    router.post("/login", handler.async(Auth.login))
    router.post("/logout", handler.async(Auth.logout))
    router.post("/register", handler.async(Auth.register))

    router.post('/google', 
        passport.authenticate('google', { scope: ['profile'] }),
        handler.async(Auth.googleAuth)); 
    router.post('/google/link', Auth.isAuthorized, handler.async(Auth.linkGoogleAccount));
    router.delete('/google/unlink', Auth.isAuthorized, handler.async(Auth.unlinkGoogleAccount));

    return router;
}