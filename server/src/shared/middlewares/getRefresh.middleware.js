// Importing modules
import Unauthorized from "../errors/unauthorize.error.js";
import { decodeRefreshToken } from "../utils/token.util.js";

// Middleware to extract and validate the refresh token
function getRefreshToken(req, res, next) {
  // Getting the refresh token from cookies
  const refreshToken = req.cookies.refreshToken;

  // Checking if the refresh token exists
  if (!refreshToken) {
    throw new Unauthorized(
      "Refresh token not found"
    );
  }

  // Verifying and decoding the refresh token
  const decoded =
    decodeRefreshToken(refreshToken);

  // If the refresh token is invalid or expired
  if (!decoded) {
    throw new Unauthorized(
      "Invalid refresh token"
    );
  }

  // Attaching refresh token data to the request object
  // so that downstream controllers and services can use it
  req.refreshToken = refreshToken;
  req.sessionId = decoded.sessionId;
  req.userId = decoded.userId;

  // Passing control to the next middleware
  next();
}

// Exporting the middleware
export default getRefreshToken;