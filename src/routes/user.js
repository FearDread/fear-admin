const express = require("express");

const router = express.Router();
const utils = require("../utils");
const controller = require("../controllers/user.controller");

    
const { register, login, logoutUser, forgotPassword, resetPassword,
        getUserDetails, updatePassword, updateProfile, getAllUser,
        getSingleUser, deleteUser, updateUserRole,  } = controller;

const { isAuthentictedUser, authorizeRoles } = require("../auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logoutUser);
router.route("/password/reset/:token").put(resetPassword);
router.route("/profile").get(isAuthentictedUser, getUserDetails);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/update").put(isAuthentictedUser, updatePassword);
router.route("/profile/update").put(isAuthentictedUser ,updateProfile);
router.route("/admin/users").get(isAuthentictedUser , authorizeRoles("admin") ,getAllUser);
router.route("/admin/user/:id").get(isAuthentictedUser , authorizeRoles("admin") , getSingleUser).put(isAuthentictedUser , authorizeRoles("admin") , updateUserRole).delete(isAuthentictedUser , authorizeRoles("admin") , deleteUser)

module.exports = router;