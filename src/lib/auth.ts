import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SECRET = process.env.ADMIN_JWT_SECRET ?? "dev-secret-change-me";

export type AdminSession = {
  sub: string;
  email: string;
  name: string;
};

export function signSession(payload: AdminSession) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as AdminSession;
  } catch {
    return null;
  }
}
