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

function readArticleInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    coverImage: String(formData.get("coverImage") ?? "").trim() || null,
    published: formData.get("published") === "on",
  };
}

export async function createArticle(formData: FormData) {
  const data = readArticleInput(formData);
  const slugInput = String(formData.get("slug") ?? "").trim();
  if (!data.title || !data.content) return;

  await prisma.article.create({
    data: { ...data, slug: slugInput || slugify(`${data.title}-${Date.now()}`) },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  const data = readArticleInput(formData);
  if (!data.title || !data.content) return;

  await prisma.article.update({ where: { id }, data });

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/");
}
