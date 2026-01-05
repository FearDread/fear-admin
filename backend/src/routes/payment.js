const Payment = require('../controllers/payment');

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const validator = fear.getValidator();

    /*
    router.get("/all", handler.async(Payment.list));
    router.post("/new", handler.async(Payment.create));
    router.post("/create", handler.async(Payment.create));
    
    router.route('/:id')
        .get(Payment.read)
        .put(Payment.update);

*/
    return router;
}