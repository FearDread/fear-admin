const router = require("express").Router();
const { login, register } = require("../controllers/customer");

router.route("/customer/register").post(register);
router.route("/customer/login").post(login);

module.exports = router;