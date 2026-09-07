import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { requireModuleAccess } from "@/lib/admin-permissions";
import PrintButton from "./PrintButton";

type Params = Promise<{ id: string }>;

function formatCurrency(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Deliberately outside the (dashboard) layout group — this is a
 * print-style document, not an admin console screen, so it must not be
 * wrapped in the sidebar/header chrome (which would otherwise print
 * alongside the quotation and clutter the modal preview on the edit
 * page). It still requires admin auth + the "quotations" permission
 * since it isn't nested under the dashboard layout's guards.
 */
export default async function QuoteDocumentPreviewPage({ params }: { params: Params }) {
  await requireModuleAccess("quotations");

  const { id } = await params;
  const [quote, settings] = await Promise.all([
    prisma.quoteDocument.findUnique({
      where: { id },
      include: { items: { orderBy: { order: "asc" } }, assignedAdmin: true },
    }),
    getSiteSettings(),
  ]);
  if (!quote) notFound();

  const subtotal = quote.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const vatAmount = (subtotal * quote.vatPercent) / 100;
  const grandTotal = subtotal + vatAmount;

  return (
    <div className="bg-neutral-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-4 max-w-3xl px-4 print:hidden">
        <PrintButton />
      </div>

      <div className="mx-auto max-w-3xl bg-white p-8 text-sm text-neutral-800 shadow-sm print:shadow-none">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-neutral-800 pb-3">
          <span className="flex flex-col items-center justify-center rounded-md bg-brand px-4 py-2 leading-none">
            <span className="text-2xl font-extrabold italic text-white">Sync</span>
            <span className="text-[10px] font-semibold text-white/95 -mt-0.5">Electric System</span>
          </span>
          <div className="text-right text-xs leading-relaxed">
            <p className="font-bold">{settings.company_name_en.toUpperCase()}</p>
            <p>{settings.company_name_th}</p>
            <p>{settings.address_th}</p>
            <p>{settings.address_en}</p>
            <p>
              TEL: {settings.phone} FAX: {settings.fax ?? "-"}
            </p>
          </div>
        </div>

        <p className="mt-2 text-xs">E-Mail: {settings.email}</p>
        <h1 className="mt-2 text-center text-xl font-bold">Quotation / ใบเสนอราคา</h1>

        {/* TO / Quote meta */}
        <div className="mt-4 grid grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <p>
              <span className="font-semibold">TO :</span> {quote.companyName ?? "-"}
            </p>
            <p>
              <span className="font-semibold">ATTN :</span> {quote.attn ?? "-"}
            </p>
            <p>
              <span className="font-semibold">TEL :</span> {quote.tel ?? "-"}
            </p>
            <p>
              <span className="font-semibold">FAX :</span> {quote.fax ?? "-"}
            </p>
            <p>
              <span className="font-semibold">E-mail :</span> {quote.email ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <span className="font-semibold">Quotation No :</span> {quote.quoteNumber}
            </p>
            <p>
              <span className="font-semibold">Date :</span>{" "}
              {quote.issueDate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
            <p>
              <span className="font-semibold">Credit Term :</span> {quote.creditTerm}
            </p>
            <p>
              <span className="font-semibold">Delivery :</span> {quote.deliveryDays || "-"}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed">
          We thank you for your inquiry. It is our pleasure to submit the following quotation.
          <br />
          Please do not hesitate to contact us, if you have any query or require further information.
          <br />
          บริษัทฯ ขอขอบคุณท่านที่ให้ความไว้วางใจในการเลือกติดต่อกับบริษัทฯ และมีความยินดีที่จะเสนอราคา และเงื่อนไข ดังต่อไปนี้
        </p>

        {/* Items table */}
        <table className="mt-4 w-full border-collapse text-xs">
          <thead>
            <tr className="border-y-2 border-neutral-800 text-center font-semibold">
              <th className="w-10 border-r border-neutral-300 py-2">
                ITEM
                <br />
                ลำดับ
              </th>
              <th className="border-r border-neutral-300 py-2 text-left pl-2">
                DESCRIPTION
                <br />
                รายละเอียด
              </th>
              <th className="w-16 border-r border-neutral-300 py-2">
                QTY.
                <br />
                จำนวน
              </th>
              <th className="w-24 border-r border-neutral-300 py-2">
                UNIT PRICE
                <br />
                ราคาต่อหน่วย
              </th>
              <th className="w-28 py-2">
                TOTAL AMOUNT
                <br />
                จำนวนเงิน
              </th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, i) => (
              <tr key={item.id} className="border-b border-neutral-200 align-top">
                <td className="border-r border-neutral-200 py-2 text-center">{i + 1}</td>
                <td className="whitespace-pre-line border-r border-neutral-200 py-2 pl-2">
                  {item.description}
                </td>
                <td className="border-r border-neutral-200 py-2 text-center">
                  {item.quantity} {item.unit}
                </td>
                <td className="border-r border-neutral-200 py-2 text-right pr-2">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="py-2 text-right pr-2">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 4 - quote.items.length) }).map((_, i) => (
              <tr key={`blank-${i}`} className="border-b border-neutral-200">
                <td className="border-r border-neutral-200 py-3" />
                <td className="border-r border-neutral-200 py-3" />
                <td className="border-r border-neutral-200 py-3" />
                <td className="border-r border-neutral-200 py-3" />
                <td className="py-3" />
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-2 flex justify-between text-xs">
          <p className="max-w-[60%]">
            กำหนดยืนราคาและเงื่อนไขต่างๆ ภายใน {quote.validityDays} วัน
            <br />
            {quote.notes}
          </p>
          <table className="w-56 border-collapse">
            <tbody>
              <tr className="border-t border-neutral-300">
                <td className="py-1 text-right font-semibold">TOTAL</td>
                <td className="w-24 py-1 text-right">{formatCurrency(subtotal)}</td>
              </tr>
              <tr className="border-t border-neutral-300">
                <td className="py-1 text-right font-semibold">VAT {quote.vatPercent}%</td>
                <td className="py-1 text-right">{formatCurrency(vatAmount)}</td>
              </tr>
              <tr className="border-t-2 border-neutral-800">
                <td className="py-1 text-right font-bold">GRAND TOTAL</td>
                <td className="py-1 text-right font-bold">{formatCurrency(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature */}
        <div className="mt-16 flex justify-between text-xs">
          <div className="text-center">
            <p>Sincerely Yours,</p>
            {quote.assignedAdmin?.signatureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- small inline base64 signature image
              <img
                src={quote.assignedAdmin.signatureUrl}
                alt={`ลายเซ็น ${quote.assignedAdmin.name}`}
                className="mx-auto mt-2 h-14"
              />
            ) : (
              <div className="mt-10" />
            )}
            <div className="border-t border-neutral-400 pt-1">
              {quote.salesName && <p className="font-semibold">{quote.salesName}</p>}
              {quote.salesPhone && <p>{quote.salesPhone}</p>}
            </div>
          </div>
          <div className="text-center">
            <div className="mt-10 w-48 border-t border-neutral-400 pt-1">
              <p>Sales Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
