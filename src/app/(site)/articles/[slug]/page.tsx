import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  return { title: article?.title ?? "บทความ" };
}

export default async function ArticleDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || !article.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-xs text-neutral-500">
        <Link href="/articles" className="hover:text-brand-dark">บทความ</Link>
        {" / "}
        <span className="text-neutral-700">{article.title}</span>
      </nav>

      <time className="text-xs text-neutral-400">
        {new Date(article.publishedAt).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <h1 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">{article.title}</h1>

      <div className="mt-6 flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-accent text-6xl text-white/80">
        {article.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-supplied cover image, arbitrary local/external URL
          <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
        ) : (
          "📰"
        )}
      </div>

      <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-neutral-700">
        {article.content}
      </p>

      <div className="mt-12 rounded-2xl bg-neutral-50 p-6 text-center">
        <p className="text-sm text-neutral-600">
          มีคำถามเพิ่มเติมเกี่ยวกับสินค้าของเรา?
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-flex rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          ติดต่อทีมงาน
        </Link>
      </div>
    </article>
  );
}
