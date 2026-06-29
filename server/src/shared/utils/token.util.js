import jwt from "jsonwebtoken";
import env from "../config/env.config.js";
import EXPIRY_CONSTANTS from "../constants/expiry.constants.js";

function generateAccessToken({
  _id,
  username,
  email,
}) {
  return jwt.sign(
    {
      id: _id,
      username,
      email,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn:
        EXPIRY_CONSTANTS.accessToken,
    }
  );
}

function generateRefreshToken(
  sessionId,
  userId
) {
  return jwt.sign(
    {
      sessionId,
      userId,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        EXPIRY_CONSTANTS.refreshToken,
    }
  );
}

function decodeAccessToken(token) {
  try {
    return jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    );
  } catch {
    return null;
  }
}

function decodeRefreshToken(token) {
  try {
    return jwt.verify(
      token,
      env.JWT_REFRESH_SECRET
    );
  } catch {
    return null;
  }
}

export {
  generateAccessToken,
  generateRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
};