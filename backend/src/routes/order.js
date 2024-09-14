const router = require("express").Router();
const Order = require("../controllers/order");
const methods = Order.crud;
const { isAuthorized, isAdmin } = require("../libs/auth");

router.get("/getmyorders", isAuthorized, methods.list);
router.get("/getallorders", isAuthorized, isAdmin, methods.list);
router.get("/getaOrder/:id", isAuthorized, isAdmin, methods.read);
router.put("/updateOrder/:id", isAuthorized, isAdmin, methods.update);

//router.get("/getMonthWiseOrderIncome", isAuthorized, getMonthWiseOrderIncome);
//router.get("/getyearlyorders", isAuthorized, getYearlyTotalOrder);

module.exports = router;