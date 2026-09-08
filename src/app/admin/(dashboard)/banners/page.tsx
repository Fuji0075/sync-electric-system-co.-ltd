import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBanner } from "./actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function AdminBannersPage() {
  await requireModuleAccess("banners");
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">แบนเนอร์หน้าแรก</h1>
        <Link
          href="/admin/banners/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + เพิ่มแบนเนอร์
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#15151b] shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary external/local URL */}
            <img src={b.imageUrl} alt={b.title} className="h-32 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold ${
                    b.active ? "text-emerald-400" : "text-zinc-600"
                  }`}
                >
                  {b.active ? "● แสดงผล" : "○ ซ่อนอยู่"}
                </span>
                <span className="text-[11px] text-zinc-600">ลำดับ {b.order}</span>
              </div>
              <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-white">
                {b.title}
              </h3>
              <div className="mt-3 flex gap-3 text-sm">
                <Link href={`/admin/banners/${b.id}/edit`} className="text-emerald-400 hover:underline">
                  แก้ไข
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteBanner(b.id);
                  }}
                >
                  <button type="submit" className="text-red-500 hover:underline">
                    ลบ
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-white/15 p-10 text-center text-sm text-zinc-500">
            ยังไม่มีแบนเนอร์
          </p>
        )}
      </div>
    </div>
  );
}
