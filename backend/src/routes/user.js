const express = require("express");
const router = express.Router();
const utils = require("../handlers/mailHandler");
const User = require("../controllers/user");
const { login, logout,
        isAuthenticated,
        authorizeRoles,
        isValidToken, } = require("../auth");
const { catchErrors, authError } = require("../handlers/errorHandlers");

/*move to auth module */

router.route("/login").post(catchErrors(login));
router.route("/logout").get(catchErrors(logout));
/* ------------------- */
router.route("/register").post(catchErrors(User.register));

router.route("/profile").get(isAuthenticated, catchErrors(User.read));
router.route("/password/forgot").post(User.forgotPassword);
router.route("/password/update").put(isAuthenticated, User.updatePassword);
router.route("/profile/update").put(isAuthenticated, User.update);
router.route("/password/reset/:token").put(catchErrors(User.resetPassword));
//router.route("/admin/users").get(isValidToken, authorizeRoles("admin"), catchErrors(User.getAllUser));
router.route("/admin/users").get(catchErrors(User.list));
router.route("/admin/user/:id")
    .get(isAuthenticated, authorizeRoles("admin"), User.read)
    .delete(isAuthenticated , authorizeRoles("admin") , User.delete)
    .put(isAuthenticated , authorizeRoles("admin") , User.updateRole)

module.exports = router;