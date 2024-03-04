const express = require("express");
const router = express.Router();
const User = require("../controllers/user");
const { isAuthenticated, authorizedRoles } = require("../controllers/auth");
const { catchErrors } = require("../_utils/errorHandlers");
const asyncHandler = require("../_utils/asyncHandler");

router.route("/register").post(catchErrors(User.create));
router.route("/profile").get(isAuthenticated, catchErrors(User.readUser));
router.route("/password/forgot").post(User.forgotPassword);
router.route("/password/update").put(isAuthenticated, User.updatePassword);
router.route("/profile/update").put(isAuthenticated, User.update);
router.route("/password/reset/:token").put(catchErrors(User.resetPassword));

router.route("/admin/users")
    .get(catchErrors(User.list));
router.route("/admin/user/:id")
    .get(isAuthenticated, authorizedRoles("admin"), catchErrors(User.read))
    .delete(isAuthenticated , authorizedRoles("admin") , catchErrors(User.delete))
    .put(isAuthenticated , authorizedRoles("admin") , catchErrors(User.updateRole));

module.exports = router;