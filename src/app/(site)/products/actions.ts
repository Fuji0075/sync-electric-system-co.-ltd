"use server";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { getSiteSettings } from "@/lib/settings";
import { getCustomerSession } from "@/lib/customer-auth";

export type QuoteRequestState = {
  ok: boolean;
  error?: string;
};

export async function submitQuoteRequest(
  _prevState: QuoteRequestState,
  formData: FormData
): Promise<QuoteRequestState> {
  const productId = String(formData.get("productId") ?? "").trim() || null;
  const productName = String(formData.get("productName") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const company = String(formData.get("company") ?? "").trim() || null;
  const quantity = String(formData.get("quantity") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!name || !email) {
    return { ok: false, error: "กรุณากรอกชื่อและอีเมล" };
  }

  const customerSession = await getCustomerSession();
  const settings = await getSiteSettings();

  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      productId,
      productName,
      customerId: customerSession?.sub ?? null,
      name,
      email,
      phone,
      company,
      quantity,
      message,
    },
  });

  const { sent } = await sendMail({
    to: settings.sales_email,
    replyTo: email,
    subject: `ขอใบเสนอราคา: ${productName ?? "สอบถามทั่วไป"} — ${name}`,
    text: [
      `มีคำขอใบเสนอราคาใหม่จากเว็บไซต์`,
      ``,
      `สินค้า: ${productName ?? "-"}`,
      `ชื่อลูกค้า: ${name}`,
      `อีเมล: ${email}`,
      `เบอร์โทร: ${phone ?? "-"}`,
      `บริษัท: ${company ?? "-"}`,
      `จำนวน: ${quantity ?? "-"}`,
      `ข้อความเพิ่มเติม: ${message ?? "-"}`,
      ``,
      `ดูรายละเอียดเพิ่มเติมได้ที่ Admin Console > ใบเสนอราคา`,
    ].join("\n"),
  });

  if (sent) {
    await prisma.quoteRequest.update({
      where: { id: quoteRequest.id },
      data: { emailSent: true },
    });
  }

  return { ok: true };
}
