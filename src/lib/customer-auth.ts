import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const CUSTOMER_SESSION_COOKIE = "customer_session";
const VISITOR_ID_COOKIE = "visitor_id";
const SECRET = process.env.CUSTOMER_JWT_SECRET ?? "dev-secret-change-me-customer";

export type CustomerSession = {
  sub: string;
  email: string;
  name: string;
};

export function signCustomerSession(payload: CustomerSession) {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}

export async function setCustomerSessionCookie(token: string) {
  const store = await cookies();
  store.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCustomerSessionCookie() {
  const store = await cookies();
  store.delete(CUSTOMER_SESSION_COOKIE);
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const store = await cookies();
  const token = store.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as CustomerSession;
  } catch {
    return null;
  }
}

/**
 * Every site visitor (logged in or not) gets a stable anonymous id stored in
 * a long-lived cookie, so the chat widget can keep one continuous
 * conversation thread per browser even before the visitor registers.
 */
export async function getOrCreateVisitorId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(VISITOR_ID_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(VISITOR_ID_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}
