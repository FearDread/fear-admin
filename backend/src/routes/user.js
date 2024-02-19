const express = require("express");
const router = express.Router();
const utils = require("../middleware");
const User = require("../controllers/user");
const { isAuthenticatedUser, authorizeRoles } = require("../auth");

router.route("/register")
    .post(User.register);
router.route("/login")
    .post(User.login);
router.route("/logout")

    .get(User.logout);

router.route("/password/reset/:token")
    .put(User.resetPassword);
router.route("/profile")
    .get(isAuthenticatedUser, User.getUserDetails);
router.route("/password/forgot")
    .post(User.forgotPassword);
router.route("/password/update")
    .put(isAuthenticatedUser, User.updatePassword);
router.route("/profile/update")
    .put(isAuthenticatedUser, User.updateProfile);
router.route("/admin/users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), User.getAllUser);

 router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), User.getSingleUser)
    .put(isAuthenticatedUser , authorizeRoles("admin") , User.updateUserRole)
    .delete(isAuthenticatedUser , authorizeRoles("admin") , User.deleteUser)

module.exports = router;