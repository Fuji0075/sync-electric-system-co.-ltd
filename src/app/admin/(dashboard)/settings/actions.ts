"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const KEYS = [
  "company_name_th",
  "company_name_en",
  "address_th",
  "address_en",
  "phone",
  "mobile",
  "email",
  "line_id",
  "facebook",
  "sales_email",
];

export async function updateSettings(formData: FormData) {
  for (const key of KEYS) {
    const value = String(formData.get(key) ?? "").trim();
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
