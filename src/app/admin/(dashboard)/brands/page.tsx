import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBrand } from "./actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function AdminBrandsPage() {
  await requireModuleAccess("brands");
  const brands = await prisma.brand.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--admin-text)]">แบรนด์สินค้า</h1>
        <Link
          href="/admin/brands/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-[var(--admin-text)] hover:bg-brand-dark"
        >
          + เพิ่มแบรนด์
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <div key={brand.id} className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <div className="flex h-32 items-center justify-center bg-[var(--admin-surface-soft)] p-4">
              {brand.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary local/external URL
                <img src={brand.imageUrl} alt={brand.name} className="h-full w-full object-contain" />
              ) : (
                <span className="text-2xl font-extrabold text-[var(--admin-text-faint)]">{brand.name}</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-[11px]">
                <span className={brand.active ? "font-semibold text-emerald-400" : "text-[var(--admin-text-faint2)]"}>
                  {brand.active ? "● แสดงผล" : "○ ซ่อนอยู่"}
                </span>
                <span className="text-[var(--admin-text-faint2)]">ลำดับ {brand.order}</span>
              </div>
              <h2 className="mt-1 font-bold text-[var(--admin-text)]">{brand.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--admin-text-muted)]">{brand.description}</p>
              <div className="mt-3 flex gap-3 text-sm">
                <Link href={`/admin/brands/${brand.id}/edit`} className="text-emerald-400 hover:underline">แก้ไข</Link>
                <form action={async () => { "use server"; await deleteBrand(brand.id); }}>
                  <button type="submit" className="text-red-500 hover:underline">ลบ</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {brands.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-[var(--admin-border-strong)] p-10 text-center text-sm text-[var(--admin-text-faint)]">
            ยังไม่มีแบรนด์
          </p>
        )}
      </div>
    </div>
  );
}
