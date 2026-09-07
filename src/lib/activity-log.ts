import "server-only";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const ACTIVITY_LABELS: Record<string, string> = {
  login: "เข้าสู่ระบบ",
  reply_chat: "ตอบแชทลูกค้า",
  close_chat: "ปิดการสนทนา",
  create_quote: "สร้างใบเสนอราคา",
  claim_quote: "รับผิดชอบใบเสนอราคา",
  edit_quote: "แก้ไขใบเสนอราคา",
  send_quote: "ส่งใบเสนอราคาให้ลูกค้า",
  approve_quote: "อนุมัติใบเสนอราคา",
};

export async function logActivity(params: {
  action: string;
  description: string;
  targetType?: string;
  targetId?: string;
}) {
  const session = await getSession();
  if (!session) return;

  await prisma.activityLog.create({
    data: {
      adminId: session.sub,
      adminName: session.name,
      action: params.action,
      description: params.description,
      targetType: params.targetType,
      targetId: params.targetId,
    },
  });
}

/** For use where there's no session cookie yet (e.g. right after login). */
export async function logActivityFor(admin: { id: string; name: string }, params: {
  action: string;
  description: string;
  targetType?: string;
  targetId?: string;
}) {
  await prisma.activityLog.create({
    data: {
      adminId: admin.id,
      adminName: admin.name,
      action: params.action,
      description: params.description,
      targetType: params.targetType,
      targetId: params.targetId,
    },
  });
}
