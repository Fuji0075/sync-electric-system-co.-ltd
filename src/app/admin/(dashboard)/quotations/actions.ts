"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateQuoteNumber } from "@/lib/quote-number";
import { findMatchedProductsForQuote } from "@/lib/chat-ai";
import { sendMail } from "@/lib/mail";
import { getSiteSettings } from "@/lib/settings";

export async function createQuoteFromConversation(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { messages: true, customer: true },
  });
  if (!conversation) return;

  const visitorMessages = conversation.messages
    .filter((m) => m.sender === "visitor")
    .map((m) => m.body);

  const matchedProducts = await findMatchedProductsForQuote(visitorMessages);
  const quoteNumber = await generateQuoteNumber();

  const quote = await prisma.quoteDocument.create({
    data: {
      quoteNumber,
      conversationId: conversation.id,
      companyName: conversation.customer?.name ?? conversation.visitorName ?? null,
      email: conversation.customer?.email ?? conversation.visitorEmail ?? null,
      tel: conversation.customer?.phone ?? conversation.visitorPhone ?? null,
      items: {
        create: matchedProducts.map((p, i) => ({
          order: i,
          description: `${p.name}\n${p.summary}`,
          quantity: 1,
          unit: "UNIT",
          unitPrice: p.price ?? 0,
        })),
      },
    },
  });

  revalidatePath("/admin/quotations");
  redirect(`/admin/quotations/${quote.id}/edit`);
}

export async function createQuoteFromQuoteRequest(quoteRequestId: string) {
  const request = await prisma.quoteRequest.findUnique({ where: { id: quoteRequestId } });
  if (!request) return;

  let matchedPrice: number | null = null;
  if (request.productId) {
    const product = await prisma.product.findUnique({ where: { id: request.productId } });
    matchedPrice = product?.price ?? null;
  }

  const quoteNumber = await generateQuoteNumber();

  const quote = await prisma.quoteDocument.create({
    data: {
      quoteNumber,
      quoteRequestId: request.id,
      companyName: request.company ?? request.name,
      attn: request.name,
      tel: request.phone,
      email: request.email,
      items: {
        create: [
          {
            order: 0,
            description: request.productName ?? request.message ?? "สอบถามทั่วไป",
            quantity: Number(request.quantity) || 1,
            unit: "UNIT",
            unitPrice: matchedPrice ?? 0,
          },
        ],
      },
    },
  });

  await prisma.quoteRequest.update({ where: { id: request.id }, data: { status: "contacted" } });

  revalidatePath("/admin/quotations");
  revalidatePath("/admin/quotes");
  redirect(`/admin/quotations/${quote.id}/edit`);
}

export type QuoteItemInput = {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

export async function updateQuoteDocument(id: string, formData: FormData) {
  const descriptions = formData.getAll("item_description") as string[];
  const quantities = formData.getAll("item_quantity") as string[];
  const units = formData.getAll("item_unit") as string[];
  const unitPrices = formData.getAll("item_unitPrice") as string[];

  const items: QuoteItemInput[] = descriptions
    .map((description, i) => ({
      description: description.trim(),
      quantity: Number(quantities[i]) || 0,
      unit: (units[i] ?? "UNIT").trim() || "UNIT",
      unitPrice: Number(unitPrices[i]) || 0,
    }))
    .filter((item) => item.description);

  await prisma.$transaction([
    prisma.quoteItem.deleteMany({ where: { quoteDocumentId: id } }),
    prisma.quoteDocument.update({
      where: { id },
      data: {
        companyName: String(formData.get("companyName") ?? "").trim() || null,
        attn: String(formData.get("attn") ?? "").trim() || null,
        tel: String(formData.get("tel") ?? "").trim() || null,
        fax: String(formData.get("fax") ?? "").trim() || null,
        email: String(formData.get("email") ?? "").trim() || null,
        creditTerm: String(formData.get("creditTerm") ?? "0").trim(),
        deliveryDays: String(formData.get("deliveryDays") ?? "").trim(),
        validityDays: Number(formData.get("validityDays")) || 20,
        vatPercent: Number(formData.get("vatPercent")) || 0,
        salesName: String(formData.get("salesName") ?? "").trim() || null,
        salesPhone: String(formData.get("salesPhone") ?? "").trim() || null,
        notes: String(formData.get("notes") ?? "").trim() || null,
        issueDate: formData.get("issueDate")
          ? new Date(String(formData.get("issueDate")))
          : undefined,
        items: { create: items.map((item, i) => ({ ...item, order: i })) },
      },
    }),
  ]);

  revalidatePath(`/admin/quotations/${id}/edit`);
  revalidatePath(`/admin/quotations/${id}`);
  revalidatePath("/admin/quotations");
}

export async function deleteQuoteDocument(id: string) {
  await prisma.quoteDocument.delete({ where: { id } });
  revalidatePath("/admin/quotations");
}

function formatCurrency(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function sendQuoteToCustomer(id: string) {
  const quote = await prisma.quoteDocument.findUnique({
    where: { id },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!quote || !quote.email) return { ok: false, error: "ไม่มีอีเมลลูกค้าสำหรับส่ง" };

  const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = (subtotal * quote.vatPercent) / 100;
  const grandTotal = subtotal + vatAmount;
  const settings = await getSiteSettings();

  const lines = quote.items.map(
    (item, i) =>
      `${i + 1}. ${item.description} — ${item.quantity} ${item.unit} x ${formatCurrency(
        item.unitPrice
      )} = ${formatCurrency(item.quantity * item.unitPrice)} บาท`
  );

  const text = [
    `Quotation No: ${quote.quoteNumber}`,
    `Date: ${quote.issueDate.toLocaleDateString("th-TH")}`,
    ``,
    `เรียน ${quote.attn ?? quote.companyName ?? ""}`,
    ``,
    ...lines,
    ``,
    `TOTAL: ${formatCurrency(subtotal)} บาท`,
    `VAT ${quote.vatPercent}%: ${formatCurrency(vatAmount)} บาท`,
    `GRAND TOTAL: ${formatCurrency(grandTotal)} บาท`,
    ``,
    `เงื่อนไขการชำระเงิน: ${quote.creditTerm}`,
    `กำหนดส่งมอบ: ${quote.deliveryDays || "-"}`,
    `ยืนราคาภายใน ${quote.validityDays} วัน`,
    ``,
    quote.notes ?? "",
    ``,
    settings.company_name_th,
    `โทร: ${settings.phone}`,
  ].join("\n");

  const { sent } = await sendMail({
    to: quote.email,
    subject: `ใบเสนอราคา ${quote.quoteNumber} — ${settings.company_name_th}`,
    text,
  });

  await prisma.quoteDocument.update({
    where: { id },
    data: { status: "sent", sentAt: new Date() },
  });

  revalidatePath(`/admin/quotations/${id}`);
  revalidatePath(`/admin/quotations/${id}/edit`);
  revalidatePath("/admin/quotations");

  return { ok: true, emailSent: sent };
}

export async function approveQuote(id: string) {
  await prisma.quoteDocument.update({ where: { id }, data: { status: "approved" } });
  revalidatePath(`/admin/quotations/${id}/edit`);
  revalidatePath("/admin/quotations");
}
