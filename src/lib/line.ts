import "server-only";
import crypto from "node:crypto";

const LINE_API = "https://api.line.me/v2/bot";

function getCredentials() {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!accessToken || !channelSecret) return null;
  return { accessToken, channelSecret };
}

export function isLineConfigured() {
  return getCredentials() !== null;
}

/** Verifies the `x-line-signature` header against the raw request body. */
export function verifyLineSignature(rawBody: string, signature: string | null): boolean {
  const creds = getCredentials();
  if (!creds || !signature) return false;

  const hash = crypto.createHmac("sha256", creds.channelSecret).update(rawBody).digest("base64");
  return hash === signature;
}

export async function getLineProfile(userId: string): Promise<{ displayName: string } | null> {
  const creds = getCredentials();
  if (!creds) return null;

  const res = await fetch(`${LINE_API}/profile/${userId}`, {
    headers: { Authorization: `Bearer ${creds.accessToken}` },
  });
  if (!res.ok) return null;
  return res.json();
}

/** Replies within a webhook event using its one-time replyToken (free, no quota used). */
export async function replyLineMessage(replyToken: string, text: string): Promise<{ sent: boolean }> {
  const creds = getCredentials();
  if (!creds) {
    console.warn("[line] LINE_CHANNEL_ACCESS_TOKEN/LINE_CHANNEL_SECRET not configured — skipping reply.");
    return { sent: false };
  }

  const res = await fetch(`${LINE_API}/message/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creds.accessToken}`,
    },
    body: JSON.stringify({ replyToken, messages: [{ type: "text", text }] }),
  });
  return { sent: res.ok };
}

/** Pushes a message outside of a webhook event (used for admin replies from the dashboard). */
export async function pushLineMessage(lineUserId: string, text: string): Promise<{ sent: boolean }> {
  const creds = getCredentials();
  if (!creds) {
    console.warn("[line] LINE_CHANNEL_ACCESS_TOKEN/LINE_CHANNEL_SECRET not configured — skipping push.");
    return { sent: false };
  }

  const res = await fetch(`${LINE_API}/message/push`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creds.accessToken}`,
    },
    body: JSON.stringify({ to: lineUserId, messages: [{ type: "text", text }] }),
  });
  return { sent: res.ok };
}
