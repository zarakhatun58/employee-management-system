import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { config } from "../config/env";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "super_admin" | "hr" | "employee";
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(
    payload,
    config.jwtSecret as Secret,
    {
      expiresIn: config.jwtExpiresIn,
    } as SignOptions
  );
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(
    payload,
    config.jwtRefreshSecret as Secret,
    {
      expiresIn: config.jwtRefreshExpiresIn,
    } as SignOptions
  );
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(
    token,
    config.jwtSecret as Secret
  ) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(
    token,
    config.jwtRefreshSecret as Secret
  ) as JwtPayload;
}