/**
 * Generates a secure random password of a specific length using Web Crypto API.
 * @param length The length of the password.
 * @returns A random string.
 */
export function generatePassword(length: number = 10): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    retVal += charset[values[i] % charset.length];
  }
  return retVal;
}

/**
 * Hashes a string using SHA-256 using Web Crypto API.
 * @param password The password to hash.
 * @returns The hashed string.
 */
export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
