const router = require("express").Router();
const Order = require("../controllers/order");
const methods = Order.crud;
const { isAuthorized, isAdmin } = require("../controllers/auth");

router.get("/", isAuthorized, methods.list);
router.route('/:id')
        .get(methods.read)
        .put(methods.update);

router.get("/myOrders", isAuthorized, isAdmin, Order.getMyOrders);
router.get("/monthly", isAuthorized, Order.getMonthWiseOrderIncome);
router.get("/yearly", isAuthorized, Order.getYearlyTotalOrder);

module.exports = router;