import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBanner } from "./actions";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">แบนเนอร์หน้าแรก</h1>
        <Link
          href="/admin/banners/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + เพิ่มแบนเนอร์
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary external/local URL */}
            <img src={b.imageUrl} alt={b.title} className="h-32 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold ${
                    b.active ? "text-brand-dark" : "text-neutral-400"
                  }`}
                >
                  {b.active ? "● แสดงผล" : "○ ซ่อนอยู่"}
                </span>
                <span className="text-[11px] text-neutral-400">ลำดับ {b.order}</span>
              </div>
              <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-neutral-800">
                {b.title}
              </h3>
              <div className="mt-3 flex gap-3 text-sm">
                <Link href={`/admin/banners/${b.id}/edit`} className="text-brand-dark hover:underline">
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
          <p className="col-span-full rounded-xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
            ยังไม่มีแบนเนอร์
          </p>
        )}
      </div>
    </div>
  );
}
