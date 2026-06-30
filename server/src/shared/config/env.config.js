// Importing modules
import { config } from "dotenv";
import z from "zod/v4";
import envsConstants from "../constants/env.constants.js";

// Load .env file
config();

// Environment schema
const envSchema = z
  .object({
    PORT: z.coerce.number().default(envsConstants.PORT),
   
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default(envsConstants.NODE_ENV),

    LOG_LEVEL: z
      .enum(["error", "warn", "info", "debug"])
      .default(envsConstants.LOG_LEVEL),

    API_LIMIT: z.coerce
      .number()
      .default(envsConstants.API_LIMIT),

    FRONTEND_URL: z
      .string()
      .default(envsConstants.FRONTEND_URL),

    MONGO_URI: z
      .string()
      .default(envsConstants.MONGO_URI),

    AUTOSAVE_INTERVAL_MS: z.coerce
      .number()
      .default(envsConstants.AUTOSAVE_INTERVAL_MS),

    JWT_ACCESS_SECRET: z.string(),

    JWT_REFRESH_SECRET: z.string(),

    ACCESS_TOKEN_EXPIRY: z
      .string()
      .default("15m"),

    REFRESH_TOKEN_EXPIRY: z
      .string()
      .default("7d"),
  })
  .strip();

// Validate env variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables:"
  );
  console.error(
    parsedEnv.error.flatten().fieldErrors
  );

  process.exit(1);
}

// Export validated env
const env = parsedEnv.data;

export default env;