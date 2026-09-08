import "server-only";
import PDFDocument from "pdfkit";
import path from "node:path";
import type { QuoteDocument, QuoteItem, AdminUser } from "@/generated/prisma/client";
import type { getSiteSettings } from "@/lib/settings";

const FONTS_DIR = path.join(process.cwd(), "src/lib/fonts");
const THAI_RANGE = /[฀-๿]/;

// The embedded Thai font's ascender (1061/1000em) is taller than
// Helvetica's (718/1000em). pdfkit positions text by its top-left corner,
// so at the same y, the Thai glyph's baseline sits further down than the
// Latin one on the same line — this pulls it back up to align baselines.
const THAI_BASELINE_OFFSET_RATIO = (1061 - 718) / 1000;

type Settings = Awaited<ReturnType<typeof getSiteSettings>>;
type Quote = QuoteDocument & { items: QuoteItem[]; assignedAdmin: AdminUser | null };

function isThai(ch: string) {
  return THAI_RANGE.test(ch);
}

function fontFor(thai: boolean, bold: boolean) {
  if (thai) return bold ? "ThaiBold" : "Thai";
  return bold ? "Helvetica-Bold" : "Helvetica";
}

type Run = { text: string; thai: boolean };

/** Registers the embedded Thai font (Latin/digits/punctuation use pdfkit's built-in Helvetica). */
function setupFonts(doc: PDFKit.PDFDocument) {
  doc.registerFont("Thai", path.join(FONTS_DIR, "NotoSansThai-Regular.ttf"));
  doc.registerFont("ThaiBold", path.join(FONTS_DIR, "NotoSansThai-Bold.ttf"));
}

function splitRuns(text: string): Run[] {
  const runs: Run[] = [];
  for (const ch of text) {
    const thai = isThai(ch);
    const last = runs[runs.length - 1];
    if (last && last.thai === thai) last.text += ch;
    else runs.push({ text: ch, thai });
  }
  return runs;
}

/** Draws mixed Thai/Latin text on a single line, switching embedded fonts per run. */
function drawLine(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  opts: { size?: number; bold?: boolean; align?: "left" | "right" | "center"; width?: number } = {}
) {
  const size = opts.size ?? 9;
  const bold = opts.bold ?? false;
  const runs = splitRuns(text);

  let totalWidth = 0;
  for (const run of runs) {
    doc.font(fontFor(run.thai, bold)).fontSize(size);
    totalWidth += doc.widthOfString(run.text);
  }

  let cursorX = x;
  if (opts.align === "right" && opts.width) cursorX = x + opts.width - totalWidth;
  else if (opts.align === "center" && opts.width) cursorX = x + (opts.width - totalWidth) / 2;

  for (const run of runs) {
    doc.font(fontFor(run.thai, bold)).fontSize(size);
    const yAdj = run.thai ? y - THAI_BASELINE_OFFSET_RATIO * size : y;
    doc.text(run.text, cursorX, yAdj, { lineBreak: false });
    cursorX += doc.widthOfString(run.text);
  }
  return totalWidth;
}

/** Character-level word-wrap (Thai has no spaces between words, so wrapping by
 * character width works for both scripts instead of relying on whitespace). */
function wrapLines(doc: PDFKit.PDFDocument, text: string, maxWidth: number, size: number, bold: boolean): Run[][] {
  const lines: Run[][] = [];
  let current: { ch: string; thai: boolean }[] = [];
  let width = 0;

  function flush() {
    const merged: Run[] = [];
    for (const c of current) {
      const last = merged[merged.length - 1];
      if (last && last.thai === c.thai) last.text += c.ch;
      else merged.push({ text: c.ch, thai: c.thai });
    }
    lines.push(merged);
    current = [];
    width = 0;
  }

  for (const paragraph of text.split("\n")) {
    for (const ch of paragraph) {
      const thai = isThai(ch);
      doc.font(fontFor(thai, bold)).fontSize(size);
      const w = doc.widthOfString(ch);
      if (width + w > maxWidth && current.length > 0) flush();
      current.push({ ch, thai });
      width += w;
    }
    flush();
  }
  return lines;
}

function drawWrapped(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  size = 9,
  bold = false,
  lineHeight = size * 1.5
) {
  const lines = wrapLines(doc, text, maxWidth, size, bold);
  let cursorY = y;
  for (const line of lines) {
    let cursorX = x;
    for (const run of line) {
      doc.font(fontFor(run.thai, bold)).fontSize(size);
      const yAdj = run.thai ? cursorY - THAI_BASELINE_OFFSET_RATIO * size : cursorY;
      doc.text(run.text, cursorX, yAdj, { lineBreak: false });
      cursorX += doc.widthOfString(run.text);
    }
    cursorY += lineHeight;
  }
  return cursorY;
}

function formatCurrency(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function generateQuotePdfBuffer(quote: Quote, settings: Settings): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  setupFonts(doc);

  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const left = doc.page.margins.left;
  let y = doc.page.margins.top;

  // Header
  doc.roundedRect(left, y, 90, 34, 4).fill("#1a9b45");
  doc.fillColor("#ffffff");
  drawLine(doc, "Sync", left + 10, y + 6, { size: 16, bold: true });
  drawLine(doc, "Electric System", left + 10, y + 22, { size: 7 });
  doc.fillColor("#000000");

  const headerRight = left + pageWidth - 220;
  drawLine(doc, settings.company_name_en.toUpperCase(), headerRight, y, { size: 8, bold: true, width: 220, align: "right" });
  drawLine(doc, settings.company_name_th, headerRight, y + 11, { size: 8, width: 220, align: "right" });
  drawLine(doc, settings.address_th, headerRight, y + 22, { size: 7, width: 220, align: "right" });
  drawLine(doc, `TEL: ${settings.phone} FAX: ${settings.fax ?? "-"}`, headerRight, y + 33, { size: 7, width: 220, align: "right" });

  y += 42;
  doc.moveTo(left, y).lineTo(left + pageWidth, y).lineWidth(1.5).strokeColor("#1a1a1a").stroke();
  y += 8;

  drawLine(doc, `E-Mail: ${settings.email}`, left, y, { size: 8 });
  y += 16;
  drawLine(doc, "Quotation / ใบเสนอราคา", left, y, { size: 14, bold: true, width: pageWidth, align: "center" });
  y += 24;

  // TO / meta
  const col2 = left + pageWidth / 2 + 10;
  const rowH = 13;
  drawLine(doc, `TO : ${quote.companyName ?? "-"}`, left, y, { size: 8 });
  drawLine(doc, `Quotation No : ${quote.quoteNumber}`, col2, y, { size: 8 });
  y += rowH;
  drawLine(doc, `ATTN : ${quote.attn ?? "-"}`, left, y, { size: 8 });
  drawLine(
    doc,
    `Date : ${quote.issueDate.toLocaleDateString("th-TH", { year: "numeric", month: "2-digit", day: "2-digit" })}`,
    col2,
    y,
    { size: 8 }
  );
  y += rowH;
  drawLine(doc, `TEL : ${quote.tel ?? "-"}`, left, y, { size: 8 });
  drawLine(doc, `Credit Term : ${quote.creditTerm}`, col2, y, { size: 8 });
  y += rowH;
  drawLine(doc, `FAX : ${quote.fax ?? "-"}`, left, y, { size: 8 });
  drawLine(doc, `Delivery : ${quote.deliveryDays || "-"}`, col2, y, { size: 8 });
  y += rowH;
  drawLine(doc, `E-mail : ${quote.email ?? "-"}`, left, y, { size: 8 });
  y += rowH + 10;

  // Items table
  const colWidths = [30, pageWidth - 30 - 60 - 80 - 90, 60, 80, 90];
  const headers = ["ITEM", "DESCRIPTION", "QTY.", "UNIT PRICE", "TOTAL"];
  doc.moveTo(left, y).lineTo(left + pageWidth, y).lineWidth(1.2).stroke();
  y += 4;
  let hx = left;
  headers.forEach((h, i) => {
    drawLine(doc, h, hx, y, { size: 8, bold: true, width: colWidths[i], align: i === 1 ? "left" : "center" });
    hx += colWidths[i];
  });
  y += 12;
  doc.moveTo(left, y).lineTo(left + pageWidth, y).lineWidth(1.2).stroke();
  y += 6;

  for (const [i, item] of quote.items.entries()) {
    const rowStartY = y;
    let cx = left;
    drawLine(doc, String(i + 1), cx, y, { size: 8, width: colWidths[0], align: "center" });
    cx += colWidths[0];

    const descEndY = drawWrapped(doc, item.description, cx, y, colWidths[1] - 6, 8);
    cx += colWidths[1];

    drawLine(doc, `${item.quantity} ${item.unit}`, cx, y, { size: 8, width: colWidths[2], align: "center" });
    cx += colWidths[2];

    drawLine(doc, formatCurrency(item.unitPrice), cx, y, { size: 8, width: colWidths[3] - 6, align: "right" });
    cx += colWidths[3];

    drawLine(doc, formatCurrency(item.quantity * item.unitPrice), cx, y, {
      size: 8,
      width: colWidths[4] - 6,
      align: "right",
    });

    y = Math.max(descEndY, rowStartY + 14) + 4;
    doc.moveTo(left, y - 4).lineTo(left + pageWidth, y - 4).lineWidth(0.5).strokeColor("#cccccc").stroke();
    doc.strokeColor("#1a1a1a");

    if (y > doc.page.height - 200) {
      doc.addPage();
      y = doc.page.margins.top;
    }
  }

  y += 10;

  // Totals
  const subtotal = quote.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const vatAmount = (subtotal * quote.vatPercent) / 100;
  const grandTotal = subtotal + vatAmount;

  const totalsX = left + pageWidth - 200;
  drawWrapped(doc, `กำหนดยืนราคาและเงื่อนไขต่างๆ ภายใน ${quote.validityDays} วัน\n${quote.notes ?? ""}`, left, y, pageWidth - 220, 8);

  drawLine(doc, "TOTAL", totalsX, y, { size: 8, bold: true, width: 110, align: "right" });
  drawLine(doc, formatCurrency(subtotal), totalsX + 110, y, { size: 8, width: 90, align: "right" });
  y += 14;
  drawLine(doc, `VAT ${quote.vatPercent}%`, totalsX, y, { size: 8, bold: true, width: 110, align: "right" });
  drawLine(doc, formatCurrency(vatAmount), totalsX + 110, y, { size: 8, width: 90, align: "right" });
  y += 14;
  doc.moveTo(totalsX, y - 2).lineTo(left + pageWidth, y - 2).lineWidth(1.2).stroke();
  drawLine(doc, "GRAND TOTAL", totalsX, y + 2, { size: 9, bold: true, width: 110, align: "right" });
  drawLine(doc, formatCurrency(grandTotal), totalsX + 110, y + 2, { size: 9, bold: true, width: 90, align: "right" });

  y += 50;

  // Signature
  if (y > doc.page.height - 150) {
    doc.addPage();
    y = doc.page.margins.top;
  }
  drawLine(doc, "Sincerely Yours,", left, y, { size: 8, width: 200, align: "center" });

  if (quote.assignedAdmin?.signatureUrl?.startsWith("data:image")) {
    try {
      const base64 = quote.assignedAdmin.signatureUrl.split(",")[1];
      doc.image(Buffer.from(base64, "base64"), left + 60, y + 12, { height: 40 });
    } catch {
      // ignore malformed signature images — quote still generates without it
    }
  }

  const sigLineY = y + 60;
  doc.moveTo(left + 20, sigLineY).lineTo(left + 180, sigLineY).lineWidth(0.5).stroke();
  if (quote.salesName) drawLine(doc, quote.salesName, left, sigLineY + 4, { size: 8, bold: true, width: 200, align: "center" });
  if (quote.salesPhone) drawLine(doc, quote.salesPhone, left, sigLineY + 16, { size: 8, width: 200, align: "center" });

  doc.end();
  return done;
}
