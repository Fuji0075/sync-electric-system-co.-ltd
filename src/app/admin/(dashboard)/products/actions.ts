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

function readProductInput(formData: FormData) {
  const priceRaw = String(formData.get("price") ?? "").trim();
  return {
    name: String(formData.get("name") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
    brand: String(formData.get("brand") ?? "").trim() || null,
    sku: String(formData.get("sku") ?? "").trim() || null,
    price: priceRaw ? Number(priceRaw) : null,
    categoryId: String(formData.get("categoryId") ?? ""),
    inStock: formData.get("inStock") === "on",
    featured: formData.get("featured") === "on",
  };
}

export async function createProduct(formData: FormData) {
  const data = readProductInput(formData);
  if (!data.name || !data.categoryId) return;

  await prisma.product.create({
    data: { ...data, slug: slugify(`${data.name}-${Date.now()}`) },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const data = readProductInput(formData);
  if (!data.name || !data.categoryId) return;

  await prisma.product.update({ where: { id }, data });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}
