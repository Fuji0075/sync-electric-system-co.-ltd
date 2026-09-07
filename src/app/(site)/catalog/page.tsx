import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "แค็ตตาล็อก" };

export default async function CatalogPage() {
  const files = await prisma.catalogFile.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-neutral-900">แค็ตตาล็อกสินค้า</h1>
      <p className="mb-8 text-sm text-neutral-500">
        ดาวน์โหลดแค็ตตาล็อกและข้อมูลทางเทคนิคของสินค้าของเรา
      </p>

      {files.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
          ยังไม่มีไฟล์แค็ตตาล็อกในขณะนี้ กรุณาติดต่อทีมขายเพื่อขอข้อมูลสินค้า
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-xl text-brand-dark">
                  📄
                </span>
                <span className="font-medium text-neutral-800">{f.title}</span>
              </div>
              <a
                href={f.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
              >
                ดาวน์โหลด
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
