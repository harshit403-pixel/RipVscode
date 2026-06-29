// Importing modules
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

// Creating the express router
const router = express.Router();

// Creating the auth controller instance
const authController = new AuthController();

// Route to register a new user
router.post(
  "/signup",
  signupValidator,
  validateErrors,
  asyncHandler(
    authController.signupController
  )
);

// Route to login an existing user
router.post(
  "/login",
  loginValidator,
  validateErrors,
  asyncHandler(
    authController.loginController
  )
);

// Route to get the currently authenticated user's details
router.get(
  "/me",
  authMiddleware,
  asyncHandler(
    authController.meController
  )
);

// Route to generate a new access token using the refresh token
router.post(
  "/refresh",
  getRefreshToken,
  asyncHandler(
    authController.refreshController
  )
);

// Route to logout the user and invalidate the current session
router.post(
  "/logout",
  authMiddleware,
  getRefreshToken,
  asyncHandler(
    authController.logoutController
  )
);

// Exporting the auth router
export default router;