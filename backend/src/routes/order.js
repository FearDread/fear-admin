const router = require("express").Router();
const Order = require("../controllers/order");
const { isAuthorized, isAdmin } = require("../controllers/auth");

router.get("/all", Order.list);
router.post("/new", Order.create);
router.route('/:id')
        .get(Order.read)
        .put(Order.update);

router.get("/myOrders", Order.getMyOrders);
router.get("/monthly", Order.getMonthWiseOrderIncome);
router.get("/yearly", Order.getYearlyTotalOrder);

module.exports = router;