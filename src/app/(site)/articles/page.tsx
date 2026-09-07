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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-neutral-900">บทความน่ารู้</h1>

      {articles.length === 0 ? (
        <p className="text-sm text-neutral-500">ยังไม่มีบทความในขณะนี้</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.slug}`}
              className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand to-accent text-5xl text-white/80">
                📰
              </div>
              <div className="p-5">
                <time className="text-xs text-neutral-400">
                  {new Date(a.publishedAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="mt-1 font-semibold text-neutral-900 group-hover:text-brand-dark">
                  {a.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
