const Auth = require("../controllers/auth");
const GA = require('../libs/google');
const passport = require("passport");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const validator = fear.getValidator();
    //const passport = fear.getPassport();

    router.post("/login", handler.async(Auth.login));
    router.post("/logout", handler.async(Auth.logout));
    router.post("/register", handler.async(Auth.register));
    router.post("/me", handler.async(Auth.getCurrentUser));

    router.post('/google', handler.async(Auth.googleAuth)); 
    router.post('/google/link',handler.async(Auth.linkGoogleAccount));
    router.delete('/google/unlink',handler.async(Auth.unlinkGoogleAccount));

    router.get('/google/url', handler.async(GA.auth));
    router.get('/google/callback', handler.async(GA.callback));
 
    /*
googleAuthRouter.get("/google/url",      getGoogleAuthUrl);
googleAuthRouter.get("/google/callback", handleGoogleCallback);
googleAuthRouter.post("/google/refresh", refreshGoogleToken);
googleAuthRouter.post("/google/logout",  logoutGoogle);
*/    
return router;
}