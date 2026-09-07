import { prisma } from "@/lib/prisma";

/**
 * Generates a quote number in the same "YY.MM.NNNN" shape as the
 * company's existing quotation template (e.g. "69.09.2215") — Buddhist
 * era 2-digit year, 2-digit month, then a running sequence number.
 */
export async function generateQuoteNumber(): Promise<string> {
  const now = new Date();
  const beYear = String(now.getFullYear() + 543).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const count = await prisma.quoteDocument.count();
  const seq = String(count + 1).padStart(4, "0");
  return `${beYear}.${month}.${seq}`;
}
