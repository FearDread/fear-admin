const Auth = require("../controllers/auth");
const passport = require("passport");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const validator = fear.getValidator();
    //const passport = fear.getPassport();

    router.post("/login", handler.async(Auth.login));
    router.post("/logout", handler.async(Auth.logout));
    router.post("/register", handler.async(Auth.register));
    router.post("/forgot-password", handler.async(Auth.forgot));

    router.post('/google', handler.async(Auth.googleAuth)); 
    router.post('/google/link',handler.async(Auth.linkGoogleAccount));
    router.delete('/google/unlink',handler.async(Auth.unlinkGoogleAccount));

    return router;
}