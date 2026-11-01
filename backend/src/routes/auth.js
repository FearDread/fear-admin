const Auth = require("../controllers/auth");

const GA = require('../libs/google');
const passport = require("passport");
const Password = require('../controllers/auth/password');
module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const validator = fear.getValidator();
    const mailer = fear.getMailer();
    const { requireUser, optionalUser, withoutToken, loginLimiter } = fear.getVchatAuth();
    //const passport = fear.getPassport();
    Password.mailService = mailer;
    // Public
    router.post('/login', loginLimiter, withoutToken, handler.async(Auth.login));
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

    // ── Account recovery (public, rate-limited) ─────────────────────────
    // Used by the storefront's /forgot-password and /reset-password/[token] pages.
    // loginLimiter is reused so these can't be hammered for email bombing or
    // token guessing; the storefront shows a friendly message on 429. If it is
    // too tight for login traffic, swap in a dedicated limiter here.
    router.post('/forgot-password', loginLimiter, handler.async(Password.forgotPasswordToken));
    router.get('/verify-reset-token/:token', loginLimiter, handler.async(Password.verifyResetToken));
    router.post('/reset-password/:token', loginLimiter, handler.async(Password.resetPassword));

    // Authenticated: this handler reads req.user, so it MUST sit behind
    // isAuthorized (previously unguarded → TypeError / unauthenticated access).
    router.put('/update-password', Auth.isAuthorized, handler.async(Password.updatePassword));

    return router;
}