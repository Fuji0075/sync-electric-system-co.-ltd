"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity-log";

export async function sendAdminReply(conversationId: string, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await prisma.message.create({
    data: { conversationId, sender: "admin", body },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { needsAttention: false, unreadByVisitor: true },
  });

  await logActivity({
    action: "reply_chat",
    description: `ตอบแชท: "${body.slice(0, 60)}${body.length > 60 ? "…" : ""}"`,
    targetType: "conversation",
    targetId: conversationId,
  });

  revalidatePath(`/admin/chat/${conversationId}`);
  revalidatePath("/admin/chat");
}

export async function closeConversation(conversationId: string) {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: "closed", needsAttention: false },
  });

  await logActivity({
    action: "close_chat",
    description: "ปิดการสนทนา",
    targetType: "conversation",
    targetId: conversationId,
  });

  revalidatePath("/admin/chat");
}
