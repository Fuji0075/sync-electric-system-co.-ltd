import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateCatalogFile } from "../../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

type Params = Promise<{ id: string }>;

export default async function EditCatalogFilePage({ params }: { params: Params }) {
  await requireModuleAccess("catalog");
  const { id } = await params;
  const file = await prisma.catalogFile.findUnique({ where: { id } });
  if (!file) notFound();

  const action = updateCatalogFile.bind(null, id);

  return (
    <div>
      <Link href="/admin/catalog" className="text-sm text-brand-dark hover:underline">
        ← กลับไปแค็ตตาล็อก
      </Link>
      <h1 className="mt-1 mb-6 text-xl font-bold text-neutral-900">แก้ไขไฟล์แค็ตตาล็อก</h1>

      <form action={action} className="max-w-lg space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">ชื่อไฟล์ *</label>
          <input
            name="title"
            required
            defaultValue={file.title}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">ลิงก์ไฟล์ (URL) *</label>
          <input
            name="fileUrl"
            required
            defaultValue={file.fileUrl}
            placeholder="/catalogs/motor-catalog.pdf"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">ลิงก์รูปหน้าปก (URL)</label>
          <input
            name="coverImage"
            defaultValue={file.coverImage ?? ""}
            placeholder="/catalogs/covers/motor-catalog.jpg"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">ลำดับ</label>
          <input
            name="order"
            type="number"
            defaultValue={file.order}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          บันทึกการแก้ไข
        </button>
      </form>
    </div>
  );
}
