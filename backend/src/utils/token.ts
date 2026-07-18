import crypto from "crypto";

/**
 * Generate a cryptographically secure random token.
 */
export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Hash a token before storing it in MongoDB.
 */
export function hashToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}
export function hashResetToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}
/**
 * Generate a password reset token.
 * Returns:
 * - rawToken: send this to the user by email
 * - hashedToken: save this in MongoDB
 */
export function generatePasswordResetToken() {
  const rawToken = generateToken(32);

  const hashedToken = hashToken(rawToken);

  const expiresAt = new Date(
    Date.now() + 1000 * 60 * 30 // 30 minutes
  );

  return {
    rawToken,
    hashedToken,
    expiresAt,
  };
}

/**
 * Generate Refresh Token ID
 * (useful for token rotation later)
 */
export function generateRefreshTokenId(): string {
  return crypto.randomUUID();
}