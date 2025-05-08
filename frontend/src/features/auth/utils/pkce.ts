/**
 * Generates a cryptographically random string for the PKCE code verifier.
 * @param length The length of the string to generate. Defaults to 64.
 * @returns A random string.
 */
export function generateCodeVerifier(length: number = 64): string {
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let verifier = "";
  for (let i = 0; i < length; i++) {
    verifier += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  return verifier;
}

/**
 * Generates the PKCE code challenge from a code verifier.
 * @param verifier The code verifier string.
 * @returns A Promise that resolves to the Base64 URL-encoded SHA256 hash of the verifier.
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  // Base64 URL encode the digest
  // 1. Convert ArrayBuffer to string of bytes
  // 2. Base64 encode
  // 3. Make it URL safe (replace + with -, / with _, and remove trailing =)
  let base64 = "";
  const bytes = new Uint8Array(digest);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    base64 += String.fromCharCode(bytes[i]);
  }
  return btoa(base64)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
