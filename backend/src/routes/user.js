const express = require("express");
const router = express.Router();

const User = require("../controllers/user");
const { isAdmin, isAuth } = require("../controllers/auth");
const { sync } = require("../libs/handler");

router.route("/register").post(sync(User.create));
router.route("/profile/:id")
        .get(sync(User.read))
        .put(isAuth, sync(User.update));

router.route("/password/:id")
        .post(sync(User.forgotPassword))
        .put(sync(User.updatePassword))

router.route("/").get(sync(User.list));
router.route("/reset").put(sync(User.resetPassword));
router.route("/all").get(sync(User.list));

router.route("/:id")
    .get(isAdmin, sync(User.read))
    .delete(isAdmin, sync(User.delete))
    .put(isAdmin, sync(User.update));

router.route("/admin/role").put(isAdmin, sync(User.updateRole));

module.exports = router;