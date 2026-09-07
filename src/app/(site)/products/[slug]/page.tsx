import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name ?? "สินค้า" };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  const [related, settings] = await Promise.all([
    prisma.product.findMany({
      where: { categoryId: product.categoryId, NOT: { id: product.id } },
      include: { category: true },
      take: 4,
    }),
    getSiteSettings(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-xs text-neutral-500">
        <Link href="/" className="hover:text-brand-dark">หน้าแรก</Link>
        {" / "}
        <Link href="/products" className="hover:text-brand-dark">สินค้าทั้งหมด</Link>
        {" / "}
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-dark">
          {product.category.name}
        </Link>
        {" / "}
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-100 text-8xl">
          ⚙️
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
            {product.category.name}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {product.description}
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold">
            <span className={product.inStock ? "text-brand-dark" : "text-neutral-400"}>
              {product.inStock ? "● มีสินค้าพร้อมส่ง" : "○ สอบถามสต๊อคก่อนสั่งซื้อ"}
            </span>
            {product.sku && (
              <span className="text-neutral-400">| รหัสสินค้า: {product.sku}</span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
            >
              ขอใบเสนอราคา
            </Link>
            <a
              href={`tel:${settings.mobile.replace(/[^0-9+]/g, "")}`}
              className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-700 transition hover:border-brand hover:text-brand-dark"
            >
              โทร {settings.mobile}
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-4 text-lg font-bold text-neutral-900">สินค้าที่เกี่ยวข้อง</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
