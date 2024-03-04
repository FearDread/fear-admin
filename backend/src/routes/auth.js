const express = require("express");
const router = express.Router();
const { catchErrors } = require("../_utils/errorHandlers");
const { isAuthenticated, login, logout } = require("../controllers/auth");

router.route("/login").post(catchErrors(login));
router.route("/logout").post(isAuthenticated, catchErrors(logout));

module.exports = router;
