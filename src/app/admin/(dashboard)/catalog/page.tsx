import { prisma } from "@/lib/prisma";
import { createCatalogFile, deleteCatalogFile } from "./actions";

export default async function AdminCatalogPage() {
  const files = await prisma.catalogFile.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">แค็ตตาล็อก</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          action={createCatalogFile}
          className="h-fit space-y-4 rounded-2xl border border-neutral-200 bg-white p-6"
        >
          <h2 className="font-semibold text-neutral-900">เพิ่มไฟล์แค็ตตาล็อก</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">ชื่อไฟล์ *</label>
            <input
              name="title"
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">ลิงก์ไฟล์ (URL) *</label>
            <input
              name="fileUrl"
              required
              placeholder="/catalogs/motor-catalog.pdf"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">ลิงก์รูปหน้าปก (URL)</label>
            <input
              name="coverImage"
              placeholder="/catalogs/covers/motor-catalog.jpg"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">ลำดับ</label>
            <input
              name="order"
              type="number"
              defaultValue={0}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
          >
            เพิ่มไฟล์
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <ul className="divide-y divide-neutral-100">
            {files.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">
                    {f.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail preview
                      <img src={f.coverImage} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800">{f.title}</div>
                    <a
                      href={f.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-dark hover:underline"
                    >
                      {f.fileUrl}
                    </a>
                  </div>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await deleteCatalogFile(f.id);
                  }}
                >
                  <button type="submit" className="text-sm text-red-500 hover:underline">
                    ลบ
                  </button>
                </form>
              </li>
            ))}
            {files.length === 0 && (
              <li className="p-8 text-center text-sm text-neutral-400">ยังไม่มีไฟล์</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
