import express from "express";
import AuthController from "./auth.controller.js";

import validateErrors from "../../../shared/middlewares/validate.middleware.js";
import authMiddleware from "../../../shared/middlewares/auth.middleware.js";
import getRefreshToken from "../../../shared/middlewares/getRefresh.middleware.js";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";

import {
  signupValidator,
  loginValidator,
} from "./auth.validators.js";

const router =
  express.Router();

const authController =
  new AuthController();

router.post(
  "/signup",
  signupValidator,
  validateErrors,
  asyncHandler(
    authController.signupController
  )
);

router.post(
  "/login",
  loginValidator,
  validateErrors,
  asyncHandler(
    authController.loginController
  )
);

router.get(
  "/me",
  authMiddleware,
  asyncHandler(
    authController.meController
  )
);

router.post(
  "/refresh",
  getRefreshToken,
  asyncHandler(
    authController.refreshController
  )
);

router.post(
  "/logout",
  authMiddleware,
  getRefreshToken,
  asyncHandler(
    authController.logoutController
  )
);

export default router;