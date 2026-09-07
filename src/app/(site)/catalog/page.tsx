import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "แค็ตตาล็อก" };

export default async function CatalogPage() {
  const files = await prisma.catalogFile.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-neutral-900">แค็ตตาล็อกสินค้า</h1>
      <p className="mb-8 text-sm text-neutral-500">
        ดาวน์โหลดแค็ตตาล็อกและข้อมูลทางเทคนิคของสินค้าของเรา
      </p>

      {files.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
          ยังไม่มีไฟล์แค็ตตาล็อกในขณะนี้ กรุณาติดต่อทีมขายเพื่อขอข้อมูลสินค้า
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((f) => (
            <a
              key={f.id}
              href={f.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-md"
            >
              <div className="aspect-[210/297] w-full overflow-hidden bg-neutral-100">
                {f.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element -- static local cover thumbnail, no next/image config needed
                  <img
                    src={f.coverImage}
                    alt={f.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl text-neutral-300">
                    📄
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-semibold text-neutral-800 group-hover:text-brand-dark">
                  {f.title}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-dark">
                  ดาวน์โหลด PDF
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-3.5 w-3.5">
                    <path d="M12 4v12m0 0-4-4m4 4 4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
