// Importing modules
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../shared/utils/token.util.js";

import UserRepository from "../../../shared/dao/user.dao.js";
import SessionRepository from "../../../shared/dao/session.dao.js";

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

  /**
   * Creates session, generates tokens,
   * sanitizes user and returns auth response.
   */
  async createAuthResponse(user) {
    // Generate access token
    const accessToken =
      generateAccessToken(user);

    // Generate session id
    const sessionId =
      this.sessionRepository.getSessionId();

    // Generate refresh token
    const refreshToken =
      generateRefreshToken(
        sessionId,
        user._id
      );

    // Create session in database
    await this.sessionRepository.createSession(
      {
        _id: sessionId,
        refreshToken,
        userId: user._id,
      }
    );

    // Sanitize user
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

  /**
   * Register a new user
   */
  async signupService(
    username,
    email,
    password
  ) {
    const existingUser =
      await this.userRepository.findUserByEmail(
        email
      );

    if (existingUser) {
      throw new Conflict(
        "Email already exists"
      );
    }

    const user =
      await this.userRepository.createUser({
        username,
        email,
        password,
      });

    return await this.createAuthResponse(
      user
    );
  }

  /**
   * Login an existing user
   */
  async loginService(
    email,
    password
  ) {
    const user =
      await this.userRepository.findUserByEmail(
        email
      );

    if (!user) {
      throw new NotFound(
        "User not found"
      );
    }

    const isPasswordValid =
      await user.comparePassword(
        password
      );

    if (!isPasswordValid) {
      throw new Unauthorized(
        "Invalid credentials"
      );
    }

    return await this.createAuthResponse(
      user
    );
  }

  /**
   * Logout current session
   */
  async logoutService(
    userId,
    refreshToken,
    sessionId
  ) {
    await this.sessionRepository.deleteSessions(
      {
        userId,
        refreshToken,
        _id: sessionId,
      }
    );
  }

  /**
   * Refresh access and refresh tokens
   */
  async refreshService(
    userId,
    refreshToken,
    sessionId
  ) {
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

    const newRefreshToken =
      generateRefreshToken(
        sessionId,
        userId
      );

    // Rotate refresh token
    session.refreshToken =
      newRefreshToken;

    // Extend session expiry
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

    const user =
      await this.userRepository.getUserById(
        userId
      );

    if (!user) {
      throw new NotFound(
        "User not found"
      );
    }

    const newAccessToken =
      generateAccessToken(user);

    return {
      newAccessToken,
      newRefreshToken,
    };
  }

  /**
   * Get currently authenticated user
   */
  async getMeService(userId) {
    const user =
      await this.userRepository.getUserById(
        userId
      );

    if (!user) {
      throw new NotFound(
        "User not found"
      );
    }

    const accessToken =
      generateAccessToken(user);

    return sanitizeUser(
      user,
      accessToken
    );
  }
}

export default AuthService;