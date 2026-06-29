import env from "../config/env.config.js";

export const refreshConstants = {
  httpOnly: true,
  secure:
    env.NODE_ENV === "production",
  sameSite:
    env.NODE_ENV === "production"
      ? "none"
      : "lax",
  maxAge:
    7 * 24 * 60 * 60 * 1000,
  path: "/",
};