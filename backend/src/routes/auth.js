const express = require("express");
const router = express.Router();
const { sync } = require("../libs/handler");
const { login, logout } = require("../controllers/auth");

router.route("/login").post( sync(login) );
router.route("/logout").post( sync(logout) );

module.exports = router;