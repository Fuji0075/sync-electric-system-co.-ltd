"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signSession, setSessionCookie } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" };
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  const token = signSession({ sub: user.id, email: user.email, name: user.name });
  await setSessionCookie(token);
  redirect("/admin");
}
