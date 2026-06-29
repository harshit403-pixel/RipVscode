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

class AuthService {
  constructor() {
    this.userRepository =
      new UserRepository();

    this.sessionRepository =
      new SessionRepository();
  }

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

    const accessToken =
      generateAccessToken(user);

    const sessionId =
      this.sessionRepository.getSessionId();

    const refreshToken =
      generateRefreshToken(
        sessionId,
        user._id
      );

    await this.sessionRepository.createSession(
      {
        _id: sessionId,
        refreshToken,
        userId: user._id,
      }
    );

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

    const accessToken =
      generateAccessToken(user);

    const sessionId =
      this.sessionRepository.getSessionId();

    const refreshToken =
      generateRefreshToken(
        sessionId,
        user._id
      );

    await this.sessionRepository.createSession(
      {
        _id: sessionId,
        refreshToken,
        userId: user._id,
      }
    );

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

async refreshService(
  userId,
  refreshToken,
  sessionId
) {
  const session =
    await this.sessionRepository.findOneSession({
      userId,
      refreshToken,
      _id: sessionId,
    });

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

  session.refreshToken =
    newRefreshToken;

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

    const sanitizedUser =
      sanitizeUser(
        user,
        accessToken
      );

    return sanitizedUser;
  }
}

export default AuthService;