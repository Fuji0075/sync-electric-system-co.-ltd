import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { generateQuotePdfBuffer } from "@/lib/quote-pdf";

type Params = Promise<{ id: string }>;

/**
 * Public (no admin auth) so a customer's chat/LINE link or the emailed
 * attachment can open it directly — the id is an unguessable cuid, the same
 * trust level already used for chat/quote-request data in this app.
 */
export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const quote = await prisma.quoteDocument.findUnique({
    where: { id },
    include: { items: { orderBy: { order: "asc" } }, assignedAdmin: true },
  });
  if (!quote) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const settings = await getSiteSettings();
  const pdf = await generateQuotePdfBuffer(quote, settings);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${quote.quoteNumber}.pdf"`,
    },
  });
}
