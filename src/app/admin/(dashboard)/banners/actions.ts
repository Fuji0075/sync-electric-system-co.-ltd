"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function readBannerInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    linkUrl: String(formData.get("linkUrl") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0),
    active: formData.get("active") === "on",
  };
}

export async function createBanner(formData: FormData) {
  const data = readBannerInput(formData);
  if (!data.title || !data.imageUrl) return;

  await prisma.banner.create({ data });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function updateBanner(id: string, formData: FormData) {
  const data = readBannerInput(formData);
  if (!data.title || !data.imageUrl) return;

  await prisma.banner.update({ where: { id }, data });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
