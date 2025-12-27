const Payment = require('../controllers/payment');

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const validator = fear.getValidator();

    router.get("/all", Payment.list);
    router.post("/new", Payment.create);
    router.post("/:params", Payment.create);
    
    router.route('/:id')
        .get(Payment.read)
        .put(Payment.update);


    return router;
}