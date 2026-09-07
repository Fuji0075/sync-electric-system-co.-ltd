import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { updateQuoteDocument, sendQuoteToCustomer, claimQuote } from "../../actions";
import ItemsEditor from "./ItemsEditor";
import QuotePreviewModal from "./QuotePreviewModal";
import { requireModuleAccess } from "@/lib/admin-permissions";

type Params = Promise<{ id: string }>;

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function EditQuoteDocumentPage({ params }: { params: Params }) {
  await requireModuleAccess("quotations");
  const { id } = await params;
  const [quote, session] = await Promise.all([
    prisma.quoteDocument.findUnique({
      where: { id },
      include: { items: { orderBy: { order: "asc" } }, assignedAdmin: true },
    }),
    getSession(),
  ]);
  if (!quote) notFound();

  const action = updateQuoteDocument.bind(null, id);
  async function sendAction() {
    "use server";
    await sendQuoteToCustomer(id);
  }
  async function claimAction() {
    "use server";
    await claimQuote(id);
  }
  const isMine = quote.assignedAdminId === session?.sub;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/quotations" className="text-sm text-brand-dark hover:underline">
            ← กลับไปรายการใบเสนอราคา
          </Link>
          <h1 className="mt-1 text-xl font-bold text-neutral-900">
            แก้ไขใบเสนอราคา {quote.quoteNumber}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              quote.status === "sent"
                ? "bg-brand/10 text-brand-dark"
                : quote.status === "approved"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {quote.status === "sent" ? "ส่งแล้ว" : quote.status === "approved" ? "อนุมัติแล้ว" : "ฉบับร่าง"}
          </span>
          <QuotePreviewModal quoteId={quote.id} />
        </div>
      </div>

      <form action={action} className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">บริษัทลูกค้า (TO)</label>
            <input
              name="companyName"
              defaultValue={quote.companyName ?? ""}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">ผู้ติดต่อ (ATTN)</label>
            <input
              name="attn"
              defaultValue={quote.attn ?? ""}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">โทรศัพท์</label>
            <input
              name="tel"
              defaultValue={quote.tel ?? ""}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">แฟกซ์</label>
            <input
              name="fax"
              defaultValue={quote.fax ?? ""}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              อีเมลลูกค้า (สำหรับส่งใบเสนอราคา)
            </label>
            <input
              name="email"
              type="email"
              defaultValue={quote.email ?? ""}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">วันที่ออกเอกสาร</label>
            <input
              name="issueDate"
              type="date"
              defaultValue={toDateInputValue(quote.issueDate)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">เงื่อนไขการชำระเงิน (Credit Term)</label>
            <input
              name="creditTerm"
              defaultValue={quote.creditTerm}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">กำหนดส่งมอบ (Delivery)</label>
            <input
              name="deliveryDays"
              placeholder="เช่น 7 วัน"
              defaultValue={quote.deliveryDays}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">ยืนราคาภายใน (วัน)</label>
            <input
              name="validityDays"
              type="number"
              defaultValue={quote.validityDays}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-neutral-900">รายการสินค้า</h2>
          <ItemsEditor initialItems={quote.items} initialVatPercent={quote.vatPercent} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3">
          <div className="flex items-center gap-3">
            {quote.assignedAdmin?.signatureUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- small inline base64 signature preview
              <img
                src={quote.assignedAdmin.signatureUrl}
                alt=""
                className="h-8 rounded border border-neutral-200 bg-white p-0.5"
              />
            )}
            <p className="text-sm text-neutral-600">
              {quote.assignedAdmin ? (
                <>
                  ผู้รับผิดชอบ: <span className="font-semibold text-neutral-800">{quote.assignedAdmin.name}</span>
                  {isMine && <span className="ml-1 text-xs text-brand-dark">(คุณ)</span>}
                </>
              ) : (
                "ยังไม่มีผู้รับผิดชอบใบเสนอราคานี้"
              )}
            </p>
          </div>
          {!isMine && (
            <form action={claimAction}>
              <button
                type="submit"
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:border-brand hover:text-brand-dark"
              >
                รับผิดชอบใบนี้ (ใช้ชื่อ/ลายเซ็นของฉัน)
              </button>
            </form>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">ชื่อพนักงานขาย</label>
            <input
              name="salesName"
              defaultValue={quote.salesName ?? ""}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">เบอร์โทรพนักงานขาย</label>
            <input
              name="salesPhone"
              defaultValue={quote.salesPhone ?? ""}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">หมายเหตุเพิ่มเติม</label>
          <textarea
            name="notes"
            rows={2}
            defaultValue={quote.notes ?? ""}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          บันทึกฉบับร่าง
        </button>
      </form>

      <form action={sendAction} className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="mb-3 text-sm text-amber-800">
          เมื่อตรวจสอบข้อมูลและราคาเรียบร้อยแล้ว กดปุ่มนี้เพื่อส่งอีเมลใบเสนอราคาไปยังลูกค้า
          (ต้องบันทึกฉบับร่างด้านบนก่อน และต้องตั้งค่า SMTP ในระบบแล้ว)
        </p>
        <button
          type="submit"
          className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-700"
        >
          ✅ อนุมัติและส่งอีเมลให้ลูกค้า
        </button>
      </form>
    </div>
  );
}
