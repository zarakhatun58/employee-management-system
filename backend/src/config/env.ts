import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/employee_management",

  jwtSecret:
    process.env.JWT_SECRET ||
    "ems_super_secret_key",

  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    "ems_refresh_secret",

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN ||
    "1d",

  jwtRefreshExpiresIn:
    process.env.JWT_REFRESH_EXPIRES_IN ||
    "7d",

clientUrl:
  (
    process.env.CLIENT_URL ||
    "http://localhost:5173"
  ).split(","),

  uploadDir:
    process.env.UPLOAD_DIR ||
    "uploads",

  // cloudinary: {
  //   cloudName:
  //     process.env.CLOUDINARY_CLOUD_NAME || "",

  //   apiKey:
  //     process.env.CLOUDINARY_API_KEY || "",

  //   apiSecret:
  //     process.env.CLOUDINARY_API_SECRET || "",
  // },

  bcryptSaltRounds:
    Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  cookie: {
    secure: process.env.COOKIE_SECURE === "true",
    sameSite:
      (process.env.COOKIE_SAME_SITE as
        | "lax"
        | "strict"
        | "none") || "lax",
  },
};