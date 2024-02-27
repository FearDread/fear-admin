const express = require("express");
const router = express.Router();
const User = require("../controllers/user");
const { isAuthenticated, authorizeRoles } = require("../auth");
const { catchErrors } = require("../_helpers/errorHandlers");
const asyncHandler = require("../_helpers/asyncHandler");

router.route("/register").post(catchErrors(User.register));
router.route("/profile").get(isAuthenticated, catchErrors(User.readUser));
router.route("/password/forgot").post(User.forgotPassword);
router.route("/password/update").put(isAuthenticated, User.updatePassword);
router.route("/profile/update").put(isAuthenticated, User.update);
router.route("/password/reset/:token").put(catchErrors(User.resetPassword));

router.route("/admin/users")
    .get(catchErrors(User.list));
router.route("/admin/user/:id")
    .get(isAuthenticated, authorizeRoles("admin"), catchErrors(User.read))
    .delete(isAuthenticated , authorizeRoles("admin") , catchErrors(User.delete))
    .put(isAuthenticated , authorizeRoles("admin") , catchErrors(User.updateRole));

module.exports = router;