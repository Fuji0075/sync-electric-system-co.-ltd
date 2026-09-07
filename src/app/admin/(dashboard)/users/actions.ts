"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdminAccess, isSuperAdmin, MODULES } from "@/lib/admin-permissions";

export type UserFormState = {
  error?: string;
};

function readPermissions(formData: FormData): string {
  const keys = MODULES.map((m) => m.key);
  return keys.filter((k) => formData.get(`perm_${k}`) === "on").join(",");
}

async function requireSuperAdmin() {
  const admin = await getCurrentAdminAccess();
  if (!admin || !isSuperAdmin(admin)) return null;
  return admin;
}

export async function createAdminUser(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const requester = await requireSuperAdmin();
  if (!requester) return { error: "เฉพาะ Super Admin เท่านั้นที่สร้างผู้ใช้ได้" };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "super_admin" ? "super_admin" : "admin";
  const permissions = readPermissions(formData);

  if (!name || !email || password.length < 6) {
    return { error: "กรุณากรอกชื่อ, อีเมล และรหัสผ่านอย่างน้อย 6 ตัวอักษร" };
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return { error: "อีเมลนี้มีผู้ใช้ในระบบแล้ว" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({
    data: { name, email, passwordHash, role, permissions },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateAdminUser(id: string, formData: FormData) {
  const requester = await requireSuperAdmin();
  if (!requester) return;

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const role = formData.get("role") === "super_admin" ? "super_admin" : "admin";
  const permissions = readPermissions(formData);

  if (!name) return;

  // Guard against locking everyone out: never demote the last remaining
  // super_admin (including yourself) via this form.
  if (role !== "super_admin") {
    const target = await prisma.adminUser.findUnique({ where: { id } });
    if (target?.role === "super_admin") {
      const superAdminCount = await prisma.adminUser.count({ where: { role: "super_admin" } });
      if (superAdminCount <= 1) {
        return;
      }
    }
  }

  await prisma.adminUser.update({
    where: { id },
    data: { name, phone, role, permissions },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}/edit`);
  redirect("/admin/users");
}

export async function toggleAdminActive(id: string) {
  const requester = await requireSuperAdmin();
  if (!requester) return;
  if (requester.id === id) return; // can't deactivate yourself

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return;

  if (target.active && target.role === "super_admin") {
    const activeSuperAdmins = await prisma.adminUser.count({
      where: { role: "super_admin", active: true },
    });
    if (activeSuperAdmins <= 1) return; // never deactivate the last active super_admin
  }

  await prisma.adminUser.update({ where: { id }, data: { active: !target.active } });
  revalidatePath("/admin/users");
}

export async function deleteAdminUser(id: string) {
  const requester = await requireSuperAdmin();
  if (!requester) return;
  if (requester.id === id) return; // can't delete yourself

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return;

  if (target.role === "super_admin") {
    const superAdminCount = await prisma.adminUser.count({ where: { role: "super_admin" } });
    if (superAdminCount <= 1) return; // never delete the last super_admin
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/users");
}
