const Auth = require('../controllers/auth');
const Vchat = require('../controllers/vchat');

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const { requireUser, optionalUser, withoutToken, loginLimiter } = fear.getVchatAuth();

    router.use(Vchat.noStore);

    // Public
    router.post('/login', loginLimiter, withoutToken, handler.async(Auth.login));
    router.post('/logout', handler.async(Auth.logout));
    router.get('/session', optionalUser, handler.async(Vchat.session));

    // Protected — all of these read req.vchatUser, so requireUser must run first.
    router.get('/config', requireUser, handler.async(Vchat.config));
    router.get('/token', requireUser, handler.async(Vchat.token));
    router.post('/rooms', requireUser, handler.async(Vchat.createRoom));
    router.get('/rooms/:room', requireUser, handler.async(Vchat.getRoom));

    // Admin
    router.get('/stats', requireUser, Auth.authorizeRoles('admin'), handler.async(Vchat.stats));

    return router;
};