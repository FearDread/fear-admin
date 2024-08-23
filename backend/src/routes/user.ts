import express, { Router, Request, Response, NextFunction } from 'express';
import User from '../controllers/user';
import { isAdmin, isAuth, isRole } from '../auth';
import asyncHandler from '../middleware/async-handler';

const router: Router = express.Router();

router.route("/login").post(asyncHandler(User.login));
router.route("/logout").post(isAuth, asyncHandler(User.logout));
router.route("/register").post(asyncHandler(User.create));

router.route("/profile/:id")
        .get(asyncHandler(User.read))
        .put(isAuth, asyncHandler(User.update));

router.route("/password/:id")
        .post(asyncHandler(User.forgotPassword))
        .put(asyncHandler(User.updatePassword));

router.route("/").get(asyncHandler(User.list));
router.route("/reset").put(asyncHandler(User.resetPassword));
router.route("/all").get(asyncHandler(User.list));

router.route("/:id")
    .get(isAdmin, asyncHandler(User.read))
    .delete(isAdmin, asyncHandler(User.delete))
    .put(isAdmin, asyncHandle