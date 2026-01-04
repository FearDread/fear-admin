const Order = require("../controllers/order");

module.exports = ( fear ) => {
        const router = fear.createRouter();
        const handler = fear.getHandler();
        const validator = fear.getValidator();

        router.get("/all", handler.async(Order.list));
        router.post("/new", handler.async(Order.create));
        router.post("/create", handler.async(Order.create));

        router.route('/:id')
                .get(Order.read)
                .put(Order.update);

        router.get("/myOrders", Order.getMyOrders);
        router.get("/monthly", Order.getMonthWiseOrderIncome);
        router.get("/yearly", Order.getYearlyTotalOrder);

        return router;
};