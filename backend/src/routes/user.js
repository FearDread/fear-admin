const express = require("express");
const router = express.Router();
const User = require("../controllers/user");
const { isAuthenticated,
        authorizeRoles,
        isValidToken, } = require("../auth");
const { catchErrors, authError } = require("../_helpers/errorHandlers");


router.route("/register").post(catchErrors(User.register));
router.route("/profile").get(isValidToken, catchErrors(User.read));
router.route("/password/forgot").post(User.forgotPassword);
router.route("/password/update").put(isAuthenticated, User.updatePassword);
router.route("/profile/update").put(isValidToken, User.update);
router.route("/password/reset/:token").put(catchErrors(User.resetPassword));

router.route("/admin/users")
    .get(isValidToken, authorizeRoles("admin"), catchErrors(User.list));
router.route("/admin/user/:id")
    .get(isValidToken, authorizeRoles("admin"), catchErrors(User.read))
    .delete(isValidToken , authorizeRoles("admin") , catchErrors(User.delete))
    .put(isValidToken , authorizeRoles("admin") , catchErrors(User.updateRole));

module.exports = router;