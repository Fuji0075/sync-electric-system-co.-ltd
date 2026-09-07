import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateVisitorId, getCustomerSession } from "@/lib/customer-auth";
import { generateAiReply } from "@/lib/chat-ai";

async function getOrCreateConversation() {
  const visitorId = await getOrCreateVisitorId();
  const customerSession = await getCustomerSession();

  let conversation = await prisma.conversation.findUnique({
    where: { visitorId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        visitorId,
        customerId: customerSession?.sub ?? null,
        visitorName: customerSession?.name ?? null,
        visitorEmail: customerSession?.email ?? null,
      },
      include: { messages: true },
    });
  } else if (customerSession && !conversation.customerId) {
    conversation = await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        customerId: customerSession.sub,
        visitorName: conversation.visitorName ?? customerSession.name,
        visitorEmail: conversation.visitorEmail ?? customerSession.email,
      },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  }

  return conversation;
}

export async function GET() {
  const conversation = await getOrCreateConversation();

  // Visitor is reading -> clear the "new message for visitor" flag.
  if (conversation.unreadByVisitor) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { unreadByVisitor: false },
    });
  }

  return NextResponse.json({
    conversationId: conversation.id,
    messages: conversation.messages,
    visitorName: conversation.visitorName,
    visitorEmail: conversation.visitorEmail,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const message = String(body?.message ?? "").trim();
  const name = body?.name ? String(body.name).trim() : undefined;
  const email = body?.email ? String(body.email).trim() : undefined;
  const phone = body?.phone ? String(body.phone).trim() : undefined;

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const conversation = await getOrCreateConversation();

  if (name || email || phone) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        visitorName: name ?? conversation.visitorName,
        visitorEmail: email ?? conversation.visitorEmail,
        visitorPhone: phone ?? conversation.visitorPhone,
      },
    });
  }

  await prisma.message.create({
    data: { conversationId: conversation.id, sender: "visitor", body: message },
  });

  const aiReply = await generateAiReply(message);

  if (aiReply) {
    await prisma.message.create({
      data: { conversationId: conversation.id, sender: "ai", body: aiReply },
    });
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { needsAttention: false },
    });
  } else {
    // AI couldn't answer confidently -> flag for a human to step in.
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { needsAttention: true },
    });
  }

  const updated = await prisma.conversation.findUnique({
    where: { id: conversation.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json({
    conversationId: conversation.id,
    messages: updated?.messages ?? [],
  });
}
