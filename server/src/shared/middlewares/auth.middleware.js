// Importing modules
import { decodeAccessToken } from "../utils/token.util.js";
import Unauthorized from "../errors/unauthorize.error.js";

// Middleware to authenticate users using JWT access token
function authMiddleware(req, res, next) {
  // Getting the Authorization header
  const authHeader = req.headers.authorization;

  // Checking if the Authorization header exists
  // and follows the format: Bearer <token>
  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    throw new Unauthorized(
      "User unauthenticated"
    );
  }

  // Extracting the token from the header
  const token = authHeader.split(" ")[1];

  // Verifying and decoding the access token
  const decoded = decodeAccessToken(token);

  // If token verification fails, throw an error
  if (!decoded) {
    throw new Unauthorized(
      "Invalid access token"
    );
  }

  // Attaching the decoded user payload to the request object
  // so that downstream controllers can access it
  req.user = decoded;

  // Passing control to the next middleware
  next();
}

// Exporting the middleware
export default authMiddleware;