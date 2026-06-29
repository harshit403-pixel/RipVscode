// Importing modules
import { refreshConstants } from "../../../shared/constants/cookies.constants.js";
import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";
import AuthService from "./auth.service.js";

// Class to handle all the controller logic of the auth module
class AuthController {
  constructor() {
    // Creating the auth service instance
    this.authService = new AuthService();
  }

  // Controller to register a new user
  signupController = async (req, res) => {
    // Accepting the data from the request body
    const { username, email, password } = req.body;

    // Calling the signup service
    const response =
      await this.authService.signupService(
        username,
        email,
        password
      );

    // Setting the refresh token in cookies
    res.cookie(
      "refreshToken",
      response.refreshToken,
      refreshConstants
    );

    // Returning the response
    return ApiResponse(
      res,
      201,
      "User created successfully",
      response.user
    );
  };

  // Controller to login an existing user
  loginController = async (req, res) => {
    // Accepting the data from the request body
    const { email, password } = req.body;

    // Calling the login service
    const response =
      await this.authService.loginService(
        email,
        password
      );

    // Setting the refresh token in cookies
    res.cookie(
      "refreshToken",
      response.refreshToken,
      refreshConstants
    );

    // Returning the response
    return ApiResponse(
      res,
      200,
      "User logged in successfully",
      response.user
    );
  };

  // Controller to logout the current user
  logoutController = async (req, res) => {
    // Getting the required data from the request object
    const userId = req.user.id;
    const refreshToken = req.refreshToken;
    const sessionId = req.sessionId;

    // Calling the logout service
    await this.authService.logoutService(
      userId,
      refreshToken,
      sessionId
    );

    // Clearing the refresh token cookie
    res.clearCookie(
      "refreshToken",
      refreshConstants
    );

    // Returning the response
    return ApiResponse(
      res,
      200,
      "Logged out successfully"
    );
  };

  // Controller to refresh the access token
  refreshController = async (req, res) => {
    // Getting the required data from the request object
    const refreshToken = req.refreshToken;
    const sessionId = req.sessionId;
    const userId = req.userId;

    // Calling the refresh service
    const response =
      await this.authService.refreshService(
        userId,
        refreshToken,
        sessionId
      );

    // Updating the refresh token cookie
    res.cookie(
      "refreshToken",
      response.newRefreshToken,
      refreshConstants
    );

    // Returning the response
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

  // Controller to get the currently authenticated user
  meController = async (req, res) => {
    // Getting the user id from the authenticated user
    const userId = req.user.id;

    // Calling the get me service
    const user =
      await this.authService.getMeService(
        userId
      );

    // Returning the response
    return ApiResponse(
      res,
      200,
      "User fetched successfully",
      user
    );
  };
}

// Exporting the controller
export default AuthController;