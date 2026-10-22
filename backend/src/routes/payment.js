const Payment = require('../controllers/payment');

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const validator = fear.getValidator();
    const { requireUser } = fear.getVchatAuth();

    router.post('/new', requireUser, handler.async(Payment.create));
    router.put('/update', requireUser, handler.async(Payment.update));

    
    return router;
}