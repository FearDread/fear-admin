const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../libs/handler");
const { login, logout } = require("../controllers/auth");

router.route("/login").post( asyncHandler(login) );
router.route("/logout").post( asyncHandler(logout) );

module.exports = router;