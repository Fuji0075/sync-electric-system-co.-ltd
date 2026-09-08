import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "บทความ" };

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div>
      <div className="bg-gradient-to-br from-brand-darker via-brand to-accent py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">Knowledge Hub</span>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">บทความน่ารู้</h1>
          <p className="mt-3 text-sm text-white/85 sm:text-base">
            สาระความรู้และเทคนิคการเลือกใช้มอเตอร์ เกียร์ อินเวอร์เตอร์ และอุปกรณ์อุตสาหกรรม
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {articles.length === 0 ? (
          <p className="text-sm text-neutral-500">ยังไม่มีบทความในขณะนี้</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-brand to-accent text-5xl text-white/90">
                  {a.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-supplied cover image, arbitrary local/external URL
                    <img src={a.coverImage} alt={a.title} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
                          backgroundSize: "20px 20px",
                        }}
                      />
                      <span className="relative">📰</span>
                    </>
                  )}
                </div>
                <div className="p-5">
                  <time className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
                    {new Date(a.publishedAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="mt-1.5 font-bold text-neutral-900 group-hover:text-brand-dark">
                    {a.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{a.excerpt}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-dark">
                    อ่านต่อ
                    <span className="transition group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
