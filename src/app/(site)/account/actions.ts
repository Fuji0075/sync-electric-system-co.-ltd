"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  signCustomerSession,
  setCustomerSessionCookie,
  clearCustomerSessionCookie,
  getOrCreateVisitorId,
} from "@/lib/customer-auth";

export type AccountFormState = {
  error?: string;
};

async function linkVisitorConversation(customerId: string, email: string) {
  const visitorId = await getOrCreateVisitorId();
  const conversation = await prisma.conversation.findUnique({ where: { visitorId } });
  if (conversation && !conversation.customerId) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { customerId, visitorEmail: conversation.visitorEmail ?? email },
    });
  }
}

export async function registerCustomer(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 6) {
    return { error: "กรุณากรอกชื่อ, อีเมล และรหัสผ่านอย่างน้อย 6 ตัวอักษร" };
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return { error: "อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = await prisma.customer.create({
    data: { name, email, phone, passwordHash },
  });

  await linkVisitorConversation(customer.id, customer.email);

  const token = signCustomerSession({ sub: customer.id, email: customer.email, name: customer.name });
  await setCustomerSessionCookie(token);
  redirect("/account");
}

export async function loginCustomer(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" };
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  const valid = await bcrypt.compare(password, customer.passwordHash);
  if (!valid) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  await linkVisitorConversation(customer.id, customer.email);

  const token = signCustomerSession({ sub: customer.id, email: customer.email, name: customer.name });
  await setCustomerSessionCookie(token);
  redirect("/account");
}

export async function logoutCustomer() {
  await clearCustomerSessionCookie();
  redirect("/");
}
