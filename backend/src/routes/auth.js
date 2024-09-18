const router = require('express').Router();
const User = require("../controllers/user");
const { loginAdmin, isAdmin, login, logout, register } = require("../controllers/auth");

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

//router.post("/forgot-password-token", User.passwordToken);
//router.put("/reset-password/:token", User.passwordReset);

module.exports = router;