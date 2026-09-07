"use server";

import { prisma } from "@/lib/prisma";

export type ContactFormState = {
  ok: boolean;
  error?: string;
};

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "กรุณากรอกชื่อ, อีเมล และข้อความให้ครบถ้วน" };
  }

  await prisma.contactMessage.create({
    data: { name, email, phone: phone || null, message },
  });

  return { ok: true };
}
