// Importing modules
import { refreshConstants } from "../../../shared/constants/cookies.constants.js";
import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";
import AuthService from "./auth.service.js";

// class to handle all the controller logic of the auth module
class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  signupController = async (req, res) => {
    const { username, email, password } = req.body;

    const response = await this.authService.signupService(
      username,
      email,
      password
    );

    res.cookie(
      "refreshToken",
      response.refreshToken,
      refreshConstants
    );

    return ApiResponse(
      res,
      201,
      "User created successfully",
      response.user
    );
  };

  loginController = async (req, res) => {
    const { email, password } = req.body;

    const response =
      await this.authService.loginService(
        email,
        password
      );

    res.cookie(
      "refreshToken",
      response.refreshToken,
      refreshConstants
    );

    return ApiResponse(
      res,
      200,
      "User logged in successfully",
      response.user
    );
  };

  logoutController = async (req, res) => {
    const userId = req.user.id;
    const refreshToken = req.refreshToken;
    const sessionId = req.sessionId;

    await this.authService.logoutService(
      userId,
      refreshToken,
      sessionId
    );

    res.clearCookie(
      "refreshToken",
      refreshConstants
    );

    return ApiResponse(
      res,
      200,
      "Logged out successfully"
    );
  };

  refreshController = async (req, res) => {
    const refreshToken = req.refreshToken;
    const sessionId = req.sessionId;
    const userId = req.userId;

    const response =
      await this.authService.refreshService(
        userId,
        refreshToken,
        sessionId
      );

    res.cookie(
      "refreshToken",
      response.newRefreshToken,
      refreshConstants
    );

    return ApiResponse(
      res,
      200,
      "Token refreshed successfully",
      {
        accessToken:
          response.newAccessToken,
      }
    );
  };

  meController = async (req, res) => {
    const userId = req.user.id;

    const user =
      await this.authService.getMeService(
        userId
      );

    return ApiResponse(
      res,
      200,
      "User fetched successfully",
      user
    );
  };
}

export default AuthController;