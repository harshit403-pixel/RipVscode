// Importing modules
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../shared/utils/token.util.js";

import UserRepository from "../../../shared/repositories/user.repository.js";
import SessionRepository from "../../../shared/repositories/session.repository.js";

import { sanitizeUser } from "../../../shared/utils/sanitizer.util.js";

import Conflict from "../../../shared/errors/conflict.error.js";
import NotFound from "../../../shared/errors/notfound.error.js";
import Unauthorized from "../../../shared/errors/unauthorize.error.js";


// Class to handle all business logic related to authentication
class AuthService {
  constructor() {
    // Creating repository instances
    this.userRepository =
      new UserRepository();

    this.sessionRepository =
      new SessionRepository();
  }

  // Service to register a new user
  async signupService(
    username,
    email,
    password
  ) {
    // Checking if the user already exists
    const existingUser =
      await this.userRepository.findUserByEmail(
        email
      );

    if (existingUser) {
      throw new Conflict(
        "Email already exists"
      );
    }

    // Creating a new user
    const user =
      await this.userRepository.createUser({
        username,
        email,
        password,
      });

    // Generating access token
    const accessToken =
      generateAccessToken(user);

    // Generating a session id
    const sessionId =
      this.sessionRepository.getSessionId();

    // Generating refresh token
    const refreshToken =
      generateRefreshToken(
        sessionId,
        user._id
      );

    // Creating a session in the database
    await this.sessionRepository.createSession(
      {
        _id: sessionId,
        refreshToken,
        userId: user._id,
      }
    );

    // Sanitizing user data before sending to the client
    const sanitizedUser =
      sanitizeUser(
        user,
        accessToken
      );

    return {
      user: sanitizedUser,
      refreshToken,
    };
  }

  // Service to login an existing user
  async loginService(
    email,
    password
  ) {
    // Finding the user by email
    const user =
      await this.userRepository.findUserByEmail(
        email
      );

    if (!user) {
      throw new NotFound(
        "User not found"
      );
    }

    // Comparing the passwords
    const isPasswordValid =
      await user.comparePassword(
        password
      );

    if (!isPasswordValid) {
      throw new Unauthorized(
        "Invalid credentials"
      );
    }

    // Generating access token
    const accessToken =
      generateAccessToken(user);

    // Generating session id
    const sessionId =
      this.sessionRepository.getSessionId();

    // Generating refresh token
    const refreshToken =
      generateRefreshToken(
        sessionId,
        user._id
      );

    // Creating a session in the database
    await this.sessionRepository.createSession(
      {
        _id: sessionId,
        refreshToken,
        userId: user._id,
      }
    );

    // Sanitizing user data
    const sanitizedUser =
      sanitizeUser(
        user,
        accessToken
      );

    return {
      user: sanitizedUser,
      refreshToken,
    };
  }

  // Service to logout the current session
  async logoutService(
    userId,
    refreshToken,
    sessionId
  ) {
    // Deleting the current session
    await this.sessionRepository.deleteSessions(
      {
        userId,
        refreshToken,
        _id: sessionId,
      }
    );
  }

  // Service to refresh access and refresh tokens
  async refreshService(
    userId,
    refreshToken,
    sessionId
  ) {
    // Finding the session
    const session =
      await this.sessionRepository.findOneSession(
        {
          userId,
          refreshToken,
          _id: sessionId,
        }
      );

    if (!session) {
      throw new Unauthorized(
        "Invalid refresh token"
      );
    }

    // Generating a new refresh token
    const newRefreshToken =
      generateRefreshToken(
        sessionId,
        userId
      );

    // Updating session data
    session.refreshToken =
      newRefreshToken;

    // Extending session expiry by another 7 days
    session.expiresAt =
      new Date(
        Date.now() +
          7 *
            24 *
            60 *
            60 *
            1000
      );

    await session.save();

    // Fetching user details
    const user =
      await this.userRepository.getUserById(
        userId
      );

    if (!user) {
      throw new NotFound(
        "User not found"
      );
    }

    // Generating new access token
    const newAccessToken =
      generateAccessToken(user);

    return {
      newAccessToken,
      newRefreshToken,
    };
  }

  // Service to get the currently logged-in user
  async getMeService(userId) {
    // Finding the user
    const user =
      await this.userRepository.getUserById(
        userId
      );

    if (!user) {
      throw new NotFound(
        "User not found"
      );
    }

    // Generating access token
    const accessToken =
      generateAccessToken(user);

    // Sanitizing user data
    const sanitizedUser =
      sanitizeUser(
        user,
        accessToken
      );

    return sanitizedUser;
  }
}

// Exporting the service
export default AuthService;