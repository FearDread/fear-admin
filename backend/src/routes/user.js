const express = require("express");
const Router = express.Router();
const User = require("../controllers/user.controller");
const { isAuth, authorizeRoles } = require("../auth");

Router.route("/register").post(User.register);
Router.route("/login").post(User.login);
Router.route("/logout").get(User.logout);
Router.route("/password/reset/:token").put(User.resetPassword);
Router.route("/profile").get(isAuth, User.getUserDetails);
Router.route("/password/forgot").post(User.forgotPassword);
Router.route("/password/update").put(isAuth, User.pdatePassword);
Router.route("/profile/update").put(isAuth , User.updateProfile);
Router.route("/admin/users").get(isAuth , authorizeRoles("admin") , User.getAllUser);
Router.route("/admin/user/:id").get(isAuth , authorizeRoles("admin") ,
    User.getSingleUser).put(isAuth , authorizeRoles("admin"),
    User.updateUserRole).delete(isAuth , authorizeRoles("admin") , User.deleteUser)

module.exports = Router;