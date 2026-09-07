import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAiReply } from "@/lib/chat-ai";
import { parseChatMessage } from "@/lib/chat-message";
import { verifyLineSignature, replyLineMessage, getLineProfile } from "@/lib/line";

type LineEvent = {
  type: string;
  replyToken?: string;
  source?: { userId?: string };
  message?: { type: string; text?: string };
};

async function getOrCreateLineConversation(lineUserId: string) {
  const conversation = await prisma.conversation.findUnique({ where: { lineUserId } });
  if (conversation) return conversation;

  const profile = await getLineProfile(lineUserId);
  return prisma.conversation.create({
    data: {
      visitorId: `line:${lineUserId}`,
      channel: "line",
      lineUserId,
      visitorName: profile?.displayName ?? null,
    },
  });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature");

  if (!verifyLineSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as { events?: LineEvent[] };
  const events = payload.events ?? [];

  for (const event of events) {
    if (event.type !== "message" || event.message?.type !== "text") continue;
    const lineUserId = event.source?.userId;
    const text = event.message.text;
    if (!lineUserId || !text) continue;

    const conversation = await getOrCreateLineConversation(lineUserId);

    await prisma.message.create({
      data: { conversationId: conversation.id, sender: "visitor", body: text },
    });

    const aiReply = await generateAiReply(text);

    if (aiReply) {
      await prisma.message.create({
        data: { conversationId: conversation.id, sender: "ai", body: aiReply },
      });
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { needsAttention: false },
      });
      if (event.replyToken) {
        await replyLineMessage(event.replyToken, parseChatMessage(aiReply).text);
      }
    } else {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { needsAttention: true },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
