const express = require("express");

const router = express.Router();
const utils = require("../utils");
const controller = require("../controllers/user.controller");

    
const { register, login, logout, forgotPassword, resetPassword,
        getUserDetails, updatePassword, updateProfile, getAllUser,
        getSingleUser, deleteUser, updateUserRole,  } = controller;

const { isAuthenticatedUser, authorizeRoles } = require("../auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/password/reset/:token").put(resetPassword);
router.route("/profile").get(isAuthenticatedUser, getUserDetails);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/profile/update").put(isAuthenticatedUser ,updateProfile);
router.route("/admin/users").get(isAuthenticatedUser , authorizeRoles("admin") ,getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser , authorizeRoles("admin") , getSingleUser).put(isAuthentictedUser , authorizeRoles("admin") , updateUserRole).delete(isAuthenticatedUser , authorizeRoles("admin") , deleteUser)

module.exports = router;