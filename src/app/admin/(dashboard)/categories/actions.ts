"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ก-๙]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  if (!name) return;

  await prisma.category.create({
    data: { name, slug: slugInput || slugify(name), order },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  if (!name) return;

  await prisma.category.update({
    where: { id },
    data: { name, slug: slugInput || slugify(name), order },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) return;

  await prisma.category.deleteMany({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
}
