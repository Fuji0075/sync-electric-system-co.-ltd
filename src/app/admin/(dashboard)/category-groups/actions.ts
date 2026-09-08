"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ก-๙]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategoryGroup(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  if (!name) return;

  await prisma.categoryGroup.create({
    data: { name, slug: slugInput || slugify(name), order },
  });

  revalidatePath("/admin/category-groups");
  revalidatePath("/admin/categories");
  revalidatePath("/products");
}

export async function updateCategoryGroup(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  if (!name) return;

  await prisma.categoryGroup.update({
    where: { id },
    data: { name, slug: slugInput || slugify(name), order },
  });

  revalidatePath("/admin/category-groups");
  revalidatePath("/admin/categories");
  revalidatePath("/products");
}

export async function deleteCategoryGroup(id: string) {
  await prisma.categoryGroup.delete({ where: { id } });
  revalidatePath("/admin/category-groups");
  revalidatePath("/admin/categories");
  revalidatePath("/products");
}
