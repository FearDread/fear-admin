const express = require("express");
const router = express.Router();

const User = require("../controllers/user");
const { isAdmin, isAuth } = require("../controllers/auth");
const { asyncHandler } = require("../libs/handler");

router.route("/register").post(asyncHandler(User.create));
router.route("/profile/:id")
        .get(asyncHandler(User.read))
        .put(asyncHandler(User.update));

router.route("/password/:id")
        .post(asyncHandler(User.forgotPassword))
        .put(asyncHandler(User.updatePassword))

router.route("/").get(asyncHandler(User.list));
router.route("/reset").put(asyncHandler(User.resetPassword));
router.route("/all").get(asyncHandler(User.list));

router.route("/:id")
    .get(asyncHandler(User.read))
    .delete(asyncHandler(User.delete))
    .put(asyncHandler(User.update));

router.route("/admin/role").put(asyncHandler(User.updateRole));

module.exports = router;