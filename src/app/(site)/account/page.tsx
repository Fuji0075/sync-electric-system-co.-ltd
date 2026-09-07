import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { logoutCustomer } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "บัญชีของฉัน" };

export default async function AccountPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/account/login");

  const quoteRequests = await prisma.quoteRequest.findMany({
    where: { customerId: session.sub },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">บัญชีของฉัน</h1>
          <p className="text-sm text-neutral-500">
            {session.name} — {session.email}
          </p>
        </div>
        <form action={logoutCustomer}>
          <button
            type="submit"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600 hover:border-red-300 hover:text-red-600"
          >
            ออกจากระบบ
          </button>
        </form>
      </div>

      <h2 className="mb-3 font-semibold text-neutral-900">คำขอใบเสนอราคาของฉัน</h2>
      {quoteRequests.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
          ยังไม่มีคำขอใบเสนอราคา — สามารถกดปุ่ม &ldquo;ขอใบเสนอราคา&rdquo; ที่หน้าสินค้าได้เลย
        </p>
      ) : (
        <ul className="space-y-3">
          {quoteRequests.map((q) => (
            <li key={q.id} className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-800">{q.productName ?? "สอบถามทั่วไป"}</span>
                <span
                  className={`text-xs font-semibold ${
                    q.status === "new" ? "text-brand-dark" : "text-neutral-400"
                  }`}
                >
                  {q.status === "new" ? "รอการติดต่อกลับ" : "ดำเนินการแล้ว"}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                {new Date(q.createdAt).toLocaleString("th-TH")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
