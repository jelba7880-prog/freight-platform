import { randomBytes } from "node:crypto";

// Crockford base32: no 0/O, 1/I/L, or U — avoids codes that are ambiguous
// when read aloud or typed in by a customer.
const REFERENCE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const REFERENCE_LENGTH = 12;

/**
 * Public lookup key for a shipment. Random, not derived from the row's
 * serial id — 12 chars over a 32-symbol alphabet is 60 bits of entropy,
 * far past brute-forceable. `randomBytes[i] % 32` is unbiased because 256
 * divides evenly by 32.
 */
export function generateReferenceNumber(): string {
  const bytes = randomBytes(REFERENCE_LENGTH);
  let code = "";
  for (let i = 0; i < REFERENCE_LENGTH; i++) {
    code += REFERENCE_ALPHABET[bytes[i]! % REFERENCE_ALPHABET.length];
  }
  return code;
}
