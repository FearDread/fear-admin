const router = require("express").Router();
const Order = require("../controllers/Order");
const { isAuthorized, isAdmin } = require("../lbis/auth");

router.get("/getmyorders", isAuthorized, Order.list);
router.get("/getallorders", isAuthorized, isAdmin, Order.list);
router.get("/getaOrder/:id", isAuthorized, isAdmin, Order.read);
router.put("/updateOrder/:id", isAuthorized, isAdmin, Order.update);

//router.get("/getMonthWiseOrderIncome", isAuthorized, getMonthWiseOrderIncome);
//router.get("/getyearlyorders", isAuthorized, getYearlyTotalOrder);

module.exports = router;