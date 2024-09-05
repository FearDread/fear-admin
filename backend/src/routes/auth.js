const FEAR = require("../FEAR");
const express = require("express");
const router = express.Router();

const sync = FEAR.handler.sync;

router.route("/login").post( sync(FEAR.auth.login) );
router.route("/logout").post( sync(FEAR.auth.logout) );

module.exports = router;