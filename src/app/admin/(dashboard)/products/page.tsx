import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "./actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function AdminProductsPage() {
  await requireModuleAccess("products");
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">สินค้า</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + เพิ่มสินค้า
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#15151b]">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">ชื่อสินค้า</th>
              <th className="px-4 py-3">หมวดหมู่</th>
              <th className="px-4 py-3">ราคา</th>
              <th className="px-4 py-3">สต๊อค</th>
              <th className="px-4 py-3">แนะนำ</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                <td className="px-4 py-3 text-zinc-500">{p.category.name}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {p.price != null ? `${p.price.toLocaleString("th-TH")} บาท` : "-"}
                </td>
                <td className="px-4 py-3">
                  {p.inStock ? (
                    <span className="text-emerald-400">● พร้อมส่ง</span>
                  ) : (
                    <span className="text-zinc-600">○ ไม่พร้อม</span>
                  )}
                </td>
                <td className="px-4 py-3">{p.featured ? "⭐" : ""}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-emerald-400 hover:underline"
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
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-600">
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
