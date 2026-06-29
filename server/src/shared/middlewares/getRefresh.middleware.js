import Unauthorized from "../errors/unauthorize.error.js";
import { decodeRefreshToken } from "../utils/token.util.js";

function getRefreshToken(
  req,
  res,
  next
) {
  const refreshToken =
    req.cookies.refreshToken;

  if (!refreshToken) {
    throw new Unauthorized(
      "Refresh token not found"
    );
  }

  const decoded =
    decodeRefreshToken(refreshToken);

  if (!decoded) {
    throw new Unauthorized(
      "Invalid refresh token"
    );
  }

  req.refreshToken =
    refreshToken;
  req.sessionId =
    decoded.sessionId;
  req.userId =
    decoded.userId;

  next();
}

export default getRefreshToken;