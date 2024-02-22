const express = require("express");
const router = express.Router();
const { catchErrors } = require("../_helpers/errorHandlers");
const { isValidToken, login, logout } = require("../auth");

router.route("/login").post(catchErrors(login));
router.route("/logout").post(isValidToken, catchErrors(logout));

module.exports = router;