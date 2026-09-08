import { prisma } from "@/lib/prisma";
import { updateQuoteStatus, deleteQuoteRequest } from "./actions";
import { createQuoteFromQuoteRequest } from "../quotations/actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

const STATUS_LABEL: Record<string, string> = {
  new: "รอติดต่อกลับ",
  contacted: "ติดต่อแล้ว",
  closed: "ปิดงานแล้ว",
};

export default async function AdminQuotesPage() {
  await requireModuleAccess("quotes");
  const quotes = await prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">คำขอใบเสนอราคา</h1>

      <div className="space-y-4">
        {quotes.map((q) => (
          <div key={q.id} className="rounded-2xl border border-white/10 bg-[#15151b] p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-white">{q.productName ?? "สอบถามทั่วไป"}</p>
                <p className="text-sm text-zinc-400">
                  {q.name} · {q.email} {q.phone && `· ${q.phone}`}
                </p>
                {q.company && <p className="text-sm text-zinc-500">บริษัท: {q.company}</p>}
                {q.quantity && <p className="text-sm text-zinc-500">จำนวน: {q.quantity}</p>}
                {q.message && (
                  <p className="mt-2 whitespace-pre-line text-sm text-zinc-300">{q.message}</p>
                )}
              </div>
              <div className="text-right">
                <time className="block text-xs text-zinc-600">
                  {new Date(q.createdAt).toLocaleString("th-TH")}
                </time>
                <span
                  className={`mt-1 inline-block text-xs font-semibold ${
                    q.emailSent ? "text-emerald-400" : "text-amber-600"
                  }`}
                >
                  {q.emailSent ? "ส่งอีเมลแจ้งเซลส์แล้ว" : "ยังไม่ได้ส่งอีเมล (ตั้งค่า SMTP)"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <form
                action={async () => {
                  "use server";
                  await createQuoteFromQuoteRequest(q.id);
                }}
              >
                <button
                  type="submit"
                  className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
                >
                  🧾 สร้างใบเสนอราคา
                </button>
              </form>
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <form
                  key={value}
                  action={async () => {
                    "use server";
                    await updateQuoteStatus(q.id, value);
                  }}
                >
                  <button
                    type="submit"
                    disabled={q.status === value}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      q.status === value
                        ? "bg-brand text-white"
                        : "border border-white/15 text-zinc-400 hover:border-brand hover:text-emerald-400"
                    }`}
                  >
                    {label}
                  </button>
                </form>
              ))}
              <form
                action={async () => {
                  "use server";
                  await deleteQuoteRequest(q.id);
                }}
                className="ml-auto"
              >
                <button type="submit" className="text-xs text-red-500 hover:underline">
                  ลบ
                </button>
              </form>
            </div>
          </div>
        ))}
        {quotes.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/15 p-10 text-center text-sm text-zinc-500">
            ยังไม่มีคำขอใบเสนอราคา
          </p>
        )}
      </div>
    </div>
  );
}
