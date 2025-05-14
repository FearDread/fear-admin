const { tryCatch } = require("../libs/handler/error");
const router = require('express').Router();
const User = require("../controllers/user");
const { login, logout, register, passportLogin } = require("../controllers/auth");

//router.post("/login", tryCatch(login));
router.post('/login', tryCatch(passportLogin));
router.post("/logout", tryCatch(logout));
router.post("/register", tryCatch(register));

//router.post("/forgot-password-token", User.passwordToken);
//router.put("/reset-password/:token", User.passwordReset);

module.exports = router;