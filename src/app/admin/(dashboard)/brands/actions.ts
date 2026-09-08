"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function readBrandInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0),
    active: formData.get("active") === "on",
  };
}

export async function createBrand(formData: FormData) {
  const data = readBrandInput(formData);
  if (!data.name || !data.description) return;

  await prisma.brand.create({ data });
  revalidateBrandPaths();
  redirect("/admin/brands");
}

export async function updateBrand(id: string, formData: FormData) {
  const data = readBrandInput(formData);
  if (!data.name || !data.description) return;

  await prisma.brand.update({ where: { id }, data });
  revalidateBrandPaths();
  redirect("/admin/brands");
}

export async function deleteBrand(id: string) {
  await prisma.brand.delete({ where: { id } });
  revalidateBrandPaths();
}

function revalidateBrandPaths() {
  revalidatePath("/admin/brands");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
}
