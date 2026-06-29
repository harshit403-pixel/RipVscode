import { decodeAccessToken } from "../utils/token.util.js";
import Unauthorized from "../errors/unauthorize.error.js";

function authMiddleware(
  req,
  res,
  next
) {
  const authHeader =
    req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    throw new Unauthorized(
      "User unauthenticated"
    );
  }

  const token =
    authHeader.split(" ")[1];

  const decoded =
    decodeAccessToken(token);

  if (!decoded) {
    throw new Unauthorized(
      "Invalid access token"
    );
  }

  req.user = decoded;

  next();
}

export default authMiddleware;