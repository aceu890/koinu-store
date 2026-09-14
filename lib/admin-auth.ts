import { cookies } from "next/headers";

export const ADMIN_COOKIE = "koinu_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

function bytesToHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToHex(signature);
}

export function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production") return "";
  return "koinu";
}

export function isDefaultAdminPassword() {
  return !process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== "production";
}

function secret() {
  return `${getAdminPassword()}::koinu-admin-session`;
}

export async function createAdminToken() {
  const expires = Date.now() + ADMIN_MAX_AGE * 1000;
  const payload = `admin.${expires}`;
  const signature = await hmac(payload, secret());
  return `${expires}.${signature}`;
}

export async function verifyAdminToken(token: string | undefined | null) {
  if (!token || !getAdminPassword()) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const expires = Number(token.slice(0, dot));
  const signature = token.slice(dot + 1);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = await hmac(`admin.${expires}`, secret());
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export function passwordsMatch(input: string) {
  const expected = getAdminPassword();
  if (!expected) return false;
  const a = encoder.encode(input.padEnd(128, "\0"));
  const b = encoder.encode(expected.padEnd(128, "\0"));
  let diff = input.length === expected.length ? 0 : 1;
  for (let i = 0; i < 128; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  };
}

export async function isAdminSession() {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}
