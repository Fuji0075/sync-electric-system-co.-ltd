"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCatalogFile(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const fileUrl = String(formData.get("fileUrl") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  if (!title || !fileUrl) return;

  await prisma.catalogFile.create({ data: { title, fileUrl, order } });

  revalidatePath("/admin/catalog");
  revalidatePath("/catalog");
}

export async function deleteCatalogFile(id: string) {
  await prisma.catalogFile.delete({ where: { id } });
  revalidatePath("/admin/catalog");
  revalidatePath("/catalog");
}
