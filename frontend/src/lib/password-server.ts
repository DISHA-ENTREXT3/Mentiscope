import crypto from "crypto";

/**
 * Generates a random password of a specific length.
 * @param length The length of the password.
 * @returns A random string.
 */
export function generatePassword(length: number = 10): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    retVal += charset[randomIndex];
  }
  return retVal;
}
