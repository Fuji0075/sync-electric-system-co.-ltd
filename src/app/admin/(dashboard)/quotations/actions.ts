"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateQuoteNumber } from "@/lib/quote-number";
import { sendMail } from "@/lib/mail";
import { getSiteSettings } from "@/lib/settings";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { pushLineMessage } from "@/lib/line";
import type { QuoteDocument, QuoteItem } from "@/generated/prisma/client";

async function getCurrentAdmin() {
  const session = await getSession();
  if (!session) return null;
  return prisma.adminUser.findUnique({ where: { id: session.sub } });
}

export async function createQuoteFromConversation(conversationId: string): Promise<{ quoteId: string }> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { customer: true },
  });
  if (!conversation) throw new Error("ไม่พบการสนทนานี้");

  const quoteNumber = await generateQuoteNumber();
  // Remembers which admin picked up this chat, so their name/phone/signature
  // are attached to the quote automatically.
  const admin = await getCurrentAdmin();

  // Starts with an empty item list — the sales rep reads the chat and adds
  // the products discussed themselves, rather than the AI guessing and
  // pre-filling items that may not match what was actually agreed on.
  const quote = await prisma.quoteDocument.create({
    data: {
      quoteNumber,
      conversationId: conversation.id,
      assignedAdminId: admin?.id ?? null,
      salesName: admin?.name ?? null,
      salesPhone: admin?.phone ?? null,
      companyName: conversation.customer?.name ?? conversation.visitorName ?? null,
      email: conversation.customer?.email ?? conversation.visitorEmail ?? null,
      tel: conversation.customer?.phone ?? conversation.visitorPhone ?? null,
    },
  });

  await logActivity({
    action: "create_quote",
    description: `สร้างใบเสนอราคา ${quoteNumber} จากแชท`,
    targetType: "quote",
    targetId: quote.id,
  });

  revalidatePath("/admin/quotations");
  return { quoteId: quote.id };
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
  const admin = await getCurrentAdmin();

  const quote = await prisma.quoteDocument.create({
    data: {
      quoteNumber,
      quoteRequestId: request.id,
      assignedAdminId: admin?.id ?? null,
      salesName: admin?.name ?? null,
      salesPhone: admin?.phone ?? null,
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

  await logActivity({
    action: "create_quote",
    description: `สร้างใบเสนอราคา ${quoteNumber} จากคำขอใบเสนอราคา`,
    targetType: "quote",
    targetId: quote.id,
  });

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

  const [, updated] = await prisma.$transaction([
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

  await logActivity({
    action: "edit_quote",
    description: `แก้ไขใบเสนอราคา ${updated.quoteNumber}`,
    targetType: "quote",
    targetId: id,
  });

  revalidatePath(`/admin/quotations/${id}/edit`);
  revalidatePath(`/admin/quotations/${id}/print`);
  revalidatePath("/admin/quotations");
}

export async function deleteQuoteDocument(id: string) {
  await prisma.quoteDocument.delete({ where: { id } });
  revalidatePath("/admin/quotations");
}

function formatCurrency(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function buildQuoteText(
  quote: QuoteDocument & { items: QuoteItem[] },
  settings: Awaited<ReturnType<typeof getSiteSettings>>
) {
  const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = (subtotal * quote.vatPercent) / 100;
  const grandTotal = subtotal + vatAmount;

  const lines = quote.items.map(
    (item, i) =>
      `${i + 1}. ${item.description} — ${item.quantity} ${item.unit} x ${formatCurrency(
        item.unitPrice
      )} = ${formatCurrency(item.quantity * item.unitPrice)} บาท`
  );

  return [
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
}

export async function sendQuoteToCustomer(id: string) {
  const quote = await prisma.quoteDocument.findUnique({
    where: { id },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!quote || !quote.email) return { ok: false, error: "ไม่มีอีเมลลูกค้าสำหรับส่ง" };

  const settings = await getSiteSettings();
  const text = buildQuoteText(quote, settings);

  const { sent } = await sendMail({
    to: quote.email,
    subject: `ใบเสนอราคา ${quote.quoteNumber} — ${settings.company_name_th}`,
    text,
  });

  await prisma.quoteDocument.update({
    where: { id },
    data: { status: "sent", sentAt: new Date() },
  });

  await logActivity({
    action: "send_quote",
    description: `ส่งใบเสนอราคา ${quote.quoteNumber} ให้ลูกค้า (${quote.email})`,
    targetType: "quote",
    targetId: id,
  });

  revalidatePath(`/admin/quotations/${id}/print`);
  revalidatePath(`/admin/quotations/${id}/edit`);
  revalidatePath("/admin/quotations");

  return { ok: true, emailSent: sent };
}

/**
 * Sends the quotation as a chat message instead of an email — for quotes
 * created from a conversation (web chat or LINE), this delivers straight
 * into the same thread the sales rep already has with the customer.
 */
export async function sendQuoteInChat(id: string) {
  const quote = await prisma.quoteDocument.findUnique({
    where: { id },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!quote) return { ok: false, error: "ไม่พบใบเสนอราคานี้" };
  if (!quote.conversationId) {
    return { ok: false, error: "ใบเสนอราคานี้ไม่ได้มาจากแชท กรุณาส่งทางอีเมลแทน" };
  }

  const conversation = await prisma.conversation.findUnique({ where: { id: quote.conversationId } });
  if (!conversation) return { ok: false, error: "ไม่พบการสนทนาที่ผูกกับใบเสนอราคานี้" };

  const settings = await getSiteSettings();
  const text = buildQuoteText(quote, settings);

  await prisma.message.create({
    data: { conversationId: conversation.id, sender: "admin", body: text },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { needsAttention: false, unreadByVisitor: true },
  });

  let lineSent = true;
  if (conversation.channel === "line" && conversation.lineUserId) {
    const result = await pushLineMessage(conversation.lineUserId, text);
    lineSent = result.sent;
  }

  await prisma.quoteDocument.update({
    where: { id },
    data: { status: "sent", sentAt: new Date() },
  });

  await logActivity({
    action: "send_quote",
    description: `ส่งใบเสนอราคา ${quote.quoteNumber} ทางแชท`,
    targetType: "quote",
    targetId: id,
  });

  revalidatePath(`/admin/quotations/${id}/print`);
  revalidatePath(`/admin/quotations/${id}/edit`);
  revalidatePath("/admin/quotations");
  revalidatePath(`/admin/chat/${conversation.id}`);
  revalidatePath("/admin/chat");

  return { ok: true, lineSent };
}

export async function approveQuote(id: string) {
  const quote = await prisma.quoteDocument.update({ where: { id }, data: { status: "approved" } });

  await logActivity({
    action: "approve_quote",
    description: `อนุมัติใบเสนอราคา ${quote.quoteNumber}`,
    targetType: "quote",
    targetId: id,
  });

  revalidatePath(`/admin/quotations/${id}/edit`);
  revalidatePath("/admin/quotations");
}

/**
 * Lets the currently logged-in admin take ownership of a quote they didn't
 * originally create — their name/phone/signature (from their profile) then
 * appear on the printed document instead of whoever created it.
 */
export async function claimQuote(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return;

  const quote = await prisma.quoteDocument.update({
    where: { id },
    data: { assignedAdminId: admin.id, salesName: admin.name, salesPhone: admin.phone },
  });

  await logActivity({
    action: "claim_quote",
    description: `รับผิดชอบใบเสนอราคา ${quote.quoteNumber}`,
    targetType: "quote",
    targetId: id,
  });

  revalidatePath(`/admin/quotations/${id}/edit`);
  revalidatePath(`/admin/quotations/${id}/print`);
}
