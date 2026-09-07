import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "./actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">สินค้า</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + เพิ่มสินค้า
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">ชื่อสินค้า</th>
              <th className="px-4 py-3">หมวดหมู่</th>
              <th className="px-4 py-3">สต๊อค</th>
              <th className="px-4 py-3">แนะนำ</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-neutral-800">{p.name}</td>
                <td className="px-4 py-3 text-neutral-500">{p.category.name}</td>
                <td className="px-4 py-3">
                  {p.inStock ? (
                    <span className="text-brand-dark">● พร้อมส่ง</span>
                  ) : (
                    <span className="text-neutral-400">○ ไม่พร้อม</span>
                  )}
                </td>
                <td className="px-4 py-3">{p.featured ? "⭐" : ""}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-brand-dark hover:underline"
                    >
                      แก้ไข
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteProduct(p.id);
                      }}
                    >
                      <button type="submit" className="text-red-500 hover:underline">
                        ลบ
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  ยังไม่มีสินค้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
