"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

  revalidatePath(`/admin/chat/${conversationId}`);
  revalidatePath("/admin/chat");
}

export async function closeConversation(conversationId: string) {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: "closed", needsAttention: false },
  });
  revalidatePath("/admin/chat");
}
