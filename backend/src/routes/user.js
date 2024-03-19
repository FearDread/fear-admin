const express = require("express");
const router = express.Router();
const User = require("../controllers/user");
const { isAdmin, isAuth, isRole } = require("../auth");
const asyncHandler = require("../middleware/async-handler");

router.route("/login").post(asyncHandler(User.login));
router.route("/logout").post(isAuth, asyncHandler(User.logout));
router.route("/register").post(asyncHandler(User.create));

router.route("/profile/:id")
        .get(asyncHandler(User.read))
        .put(isAuth, asyncHandler(User.update));

router.route("/password/:id")
        .post(asyncHandler(User.forgotPassword))
        .put(asyncHandler(User.updatePassword))

router.route("/reset").put(asyncHandler(User.resetPassword));

router.route("/admin").get(isAdmin, asyncHandler(User.list));

router.route("/admin/:id")
    .get(isAdmin, asyncHandler(User.read))
    .delete(isAdmin, asyncHandler(User.delete))
    .put(isAdmin, asyncHandler(User.update));

router.route("/admin/role").put(isAdmin, asyncHandler(User.updateRole));

module.exports = router;