"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateQuoteStatus(id: string, status: string) {
  await prisma.quoteRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/quotes");
}

export async function deleteQuoteRequest(id: string) {
  await prisma.quoteRequest.delete({ where: { id } });
  revalidatePath("/admin/quotes");
}
