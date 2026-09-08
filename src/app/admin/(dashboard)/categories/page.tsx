import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "./actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function AdminCategoriesPage() {
  await requireModuleAccess("categories");
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">หมวดหมู่สินค้า</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + เพิ่มหมวดหมู่
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15151b]">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">ลำดับ</th>
              <th className="px-4 py-3">ชื่อหมวดหมู่</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">จำนวนสินค้า</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 text-zinc-500">{c.order}</td>
                <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                <td className="px-4 py-3 text-zinc-500">{c.slug}</td>
                <td className="px-4 py-3 text-zinc-500">{c._count.products}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/categories/${c.id}/edit`}
                      className="text-emerald-400 hover:underline"
                    >
                      แก้ไข
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteCategory(c.id);
                      }}
                    >
                      <button
                        type="submit"
                        disabled={c._count.products > 0}
                        className="text-red-500 hover:underline disabled:cursor-not-allowed disabled:text-zinc-600"
                        title={c._count.products > 0 ? "ต้องลบสินค้าในหมวดนี้ก่อน" : ""}
                      >
                        ลบ
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-600">
                  ยังไม่มีหมวดหมู่สินค้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
