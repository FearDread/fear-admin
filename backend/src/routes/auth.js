/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
const express = require('express');
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