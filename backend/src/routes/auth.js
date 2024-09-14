const express = require("express");
const User = require("../controllers/user");
const { loginAdmin, isAdmin, login, logout, register } = require("../libs/auth");
const { checkout, paymentVerification } = require("../controllers/payment");

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.post("/admin-login", isAdmin, loginAdmin);

//router.post("/forgot-password-token", User.passwordToken);
//router.put("/reset-password/:token", User.passwordReset);

module.exports = router;
/*
router.put("/password", isAuthorized, updatePassword);
router.post("/cart", isAuthorized, userCart);
router.post("/order/checkout", isAuthorized, checkout);
router.post("/order/paymentVerification", isAuthorized, paymentVerification);


router.get("/all-users", getallUser);
router.get("/getmyorders", isAuthorized, getMyOrders);
router.get("/getallorders", isAuthorized, isAdmin, getAllOrders);
router.get("/getaOrder/:id", isAuthorized, isAdmin, getsingleOrder);
router.put("/updateOrder/:id", isAuthorized, isAdmin, updateOrder);

router.get("/getMonthWiseOrderIncome", isAuthorized, getMonthWiseOrderIncome);
router.get("/getyearlyorders", isAuthorized, getYearlyTotalOrder);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);


router.delete(
  "/delete-product-cart/:cartItemId",
  isAuthorized,
  removeProductFromCart
);
router.delete(
  "/update-product-cart/:cartItemId/:newQuantity",
  isAuthorized,
  updateProductQuantityFromCart
);

router.delete("/empty-cart", isAuthorized, emptyCart);

router.delete("/:id", deleteaUser);

router.put("/edit-user", isAuthorized, updatedUser);
router.put("/save-address", isAuthorized, saveAddress);
router.put("/block-user/:id", isAuthorized, isAdmin, blockUser);
router.put("/unblock-user/:id", isAuthorized, isAdmin, unblockUser);
*/

