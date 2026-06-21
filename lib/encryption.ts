// lib/encryption.ts
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getKey(): Buffer {
  const rawKey = process.env.ALPACA_ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error("ALPACA_ENCRYPTION_KEY is not set");
  }

  const key = Buffer.from(rawKey, "base64");

  if (key.length !== KEY_LENGTH || key.toString("base64") !== rawKey) {
    throw new Error(
      "ALPACA_ENCRYPTION_KEY must be a valid base64-encoded 32-byte key"
    );
  }

  return key;
}

export function encrypt(text: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decrypt(payload: string): string {
  const key = getKey();
  const data = Buffer.from(payload, "base64");

  if (data.length <= IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error("Encrypted payload is invalid");
  }

  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
