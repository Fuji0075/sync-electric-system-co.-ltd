import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteQuoteDocument } from "./actions";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  draft: { label: "ฉบับร่าง", className: "bg-neutral-100 text-neutral-600" },
  approved: { label: "อนุมัติแล้ว รอส่ง", className: "bg-amber-100 text-amber-700" },
  sent: { label: "ส่งแล้ว", className: "bg-brand/10 text-brand-dark" },
};

export default async function AdminQuotationsPage() {
  const quotes = await prisma.quoteDocument.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">ใบเสนอราคา</h1>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">เลขที่</th>
              <th className="px-4 py-3">ลูกค้า</th>
              <th className="px-4 py-3">มูลค่ารวม</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">วันที่สร้าง</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {quotes.map((q) => {
              const subtotal = q.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
              const status = STATUS_LABEL[q.status] ?? STATUS_LABEL.draft;
              return (
                <tr key={q.id}>
                  <td className="px-4 py-3 font-medium text-neutral-800">{q.quoteNumber}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {q.companyName ?? q.attn ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {subtotal.toLocaleString("th-TH", { minimumFractionDigits: 2 })} บาท
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(q.createdAt).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/quotations/${q.id}/edit`} className="text-brand-dark hover:underline">
                        แก้ไข
                      </Link>
                      <Link
                        href={`/admin/quotations/${q.id}/print`}
                        target="_blank"
                        className="text-brand-dark hover:underline"
                      >
                        ดูตัวอย่าง
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteQuoteDocument(q.id);
                        }}
                      >
                        <button type="submit" className="text-red-500 hover:underline">
                          ลบ
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-400">
                  ยังไม่มีใบเสนอราคา — สร้างจากหน้าแชทลูกค้า หรือหน้าคำขอใบเสนอราคาได้
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
