import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { updateQuoteDocument, sendQuoteToCustomer, sendQuoteInChat, claimQuote } from "../../actions";
import ItemsEditor from "./ItemsEditor";
import QuotePreviewModal from "./QuotePreviewModal";

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function QuoteEditForm({
  id,
  showBackLink = false,
}: {
  id: string;
  showBackLink?: boolean;
}) {
  const [quote, session] = await Promise.all([
    prisma.quoteDocument.findUnique({
      where: { id },
      include: { items: { orderBy: { order: "asc" } }, assignedAdmin: true },
    }),
    getSession(),
  ]);
  if (!quote) notFound();

  const action = updateQuoteDocument.bind(null, id);
  const sendViaChat = Boolean(quote.conversationId);
  async function sendAction() {
    "use server";
    if (sendViaChat) {
      await sendQuoteInChat(id);
    } else {
      await sendQuoteToCustomer(id);
    }
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
          {showBackLink && (
            <Link href="/admin/quotations" className="text-sm text-emerald-400 hover:underline">
              ← กลับไปรายการใบเสนอราคา
            </Link>
          )}
          <h1 className="mt-1 text-xl font-bold text-[var(--admin-text)]">
            แก้ไขใบเสนอราคา {quote.quoteNumber}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              quote.status === "sent"
                ? "bg-brand/10 text-emerald-400"
                : quote.status === "approved"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-[var(--admin-surface-softer)] text-[var(--admin-text-muted)]"
            }`}
          >
            {quote.status === "sent" ? "ส่งแล้ว" : quote.status === "approved" ? "อนุมัติแล้ว" : "ฉบับร่าง"}
          </span>
          <QuotePreviewModal quoteId={quote.id} />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-3">
        <div className="flex items-center gap-3">
          {quote.assignedAdmin?.signatureUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- small inline base64 signature preview
            <img
              src={quote.assignedAdmin.signatureUrl}
              alt=""
              className="h-8 rounded border border-[var(--admin-border)] bg-[var(--admin-surface)] p-0.5"
            />
          )}
          <p className="text-sm text-[var(--admin-text-muted)]">
            {quote.assignedAdmin ? (
              <>
                ผู้รับผิดชอบ: <span className="font-semibold text-[var(--admin-text)]">{quote.assignedAdmin.name}</span>
                {isMine && <span className="ml-1 text-xs text-emerald-400">(คุณ)</span>}
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
              className="rounded-full border border-[var(--admin-border-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--admin-text-muted)] hover:border-brand hover:text-brand"
            >
              รับผิดชอบใบนี้ (ใช้ชื่อ/ลายเซ็นของฉัน)
            </button>
          </form>
        )}
      </div>

      <form action={action} className="space-y-6 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">บริษัทลูกค้า (TO)</label>
            <input
              name="companyName"
              defaultValue={quote.companyName ?? ""}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ผู้ติดต่อ (ATTN)</label>
            <input
              name="attn"
              defaultValue={quote.attn ?? ""}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">โทรศัพท์</label>
            <input
              name="tel"
              defaultValue={quote.tel ?? ""}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">แฟกซ์</label>
            <input
              name="fax"
              defaultValue={quote.fax ?? ""}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">
              อีเมลลูกค้า (สำหรับส่งใบเสนอราคา)
            </label>
            <input
              name="email"
              type="email"
              defaultValue={quote.email ?? ""}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">วันที่ออกเอกสาร</label>
            <input
              name="issueDate"
              type="date"
              defaultValue={toDateInputValue(quote.issueDate)}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">เงื่อนไขการชำระเงิน (Credit Term)</label>
            <input
              name="creditTerm"
              defaultValue={quote.creditTerm}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">กำหนดส่งมอบ (Delivery)</label>
            <input
              name="deliveryDays"
              placeholder="เช่น 7 วัน"
              defaultValue={quote.deliveryDays}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ยืนราคาภายใน (วัน)</label>
            <input
              name="validityDays"
              type="number"
              defaultValue={quote.validityDays}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-[var(--admin-text)]">รายการสินค้า</h2>
          <ItemsEditor initialItems={quote.items} initialVatPercent={quote.vatPercent} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ชื่อพนักงานขาย</label>
            <input
              name="salesName"
              defaultValue={quote.salesName ?? ""}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">เบอร์โทรพนักงานขาย</label>
            <input
              name="salesPhone"
              defaultValue={quote.salesPhone ?? ""}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">หมายเหตุเพิ่มเติม</label>
          <textarea
            name="notes"
            rows={2}
            defaultValue={quote.notes ?? ""}
            className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-[var(--admin-text)] hover:bg-brand-dark"
        >
          บันทึกฉบับร่าง
        </button>
      </form>

      <form action={sendAction} className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="mb-3 text-sm text-amber-800">
          {sendViaChat ? (
            <>
              เมื่อตรวจสอบข้อมูลและราคาเรียบร้อยแล้ว กดปุ่มนี้เพื่อส่งใบเสนอราคาเป็นข้อความในแชทที่คุยกับลูกค้าอยู่
              (ต้องบันทึกฉบับร่างด้านบนก่อน — ถ้าลูกค้าทักมาจาก LINE จะส่งไปที่ LINE ให้อัตโนมัติ)
            </>
          ) : (
            <>
              ใบเสนอราคานี้ไม่ได้มาจากแชท จึงส่งทางอีเมลแทน เมื่อตรวจสอบข้อมูลและราคาเรียบร้อยแล้ว กดปุ่มนี้เพื่อส่งอีเมลใบเสนอราคาไปยังลูกค้า
              (ต้องบันทึกฉบับร่างด้านบนก่อน และต้องตั้งค่า SMTP ในระบบแล้ว)
            </>
          )}
        </p>
        <button
          type="submit"
          className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-bold text-[var(--admin-text)] hover:bg-amber-700"
        >
          {sendViaChat ? "✅ อนุมัติและส่งในแชท" : "✅ อนุมัติและส่งอีเมลให้ลูกค้า"}
        </button>
      </form>
    </div>
  );
}
