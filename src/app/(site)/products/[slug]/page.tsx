import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { getSiteSettings } from "@/lib/settings";
import { categoryIcon } from "@/lib/category-icons";
import QuoteRequestModal from "./QuoteRequestModal";
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
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
        <Link href="/" className="hover:text-brand-dark">
          หน้าแรก
        </Link>
        <span className="text-neutral-300">›</span>
        <Link href="/products" className="hover:text-brand-dark">
          สินค้าทั้งหมด
        </Link>
        <span className="text-neutral-300">›</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-dark">
          {product.category.name}
        </Link>
        <span className="text-neutral-300">›</span>
        <span className="font-medium text-neutral-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand/10 to-accent/5">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle, #0f6b2e 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          />
          <span className="relative grid h-40 w-40 place-items-center rounded-[2rem] bg-white text-8xl shadow-lg sm:h-48 sm:w-48">
            {categoryIcon(product.category.slug)}
          </span>
          {product.inStock && (
            <span className="absolute right-5 top-5 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-sm">
              พร้อมส่ง
            </span>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
            {product.category.name}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">{product.name}</h1>

          {product.price != null && (
            <p className="mt-4 text-3xl font-extrabold text-brand-dark">
              ฿{product.price.toLocaleString("th-TH")}
            </p>
          )}

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                product.inStock ? "bg-brand/10 text-brand-dark" : "bg-neutral-100 text-neutral-500"
              }`}
            >
              {product.inStock ? "● มีสินค้าพร้อมส่ง" : "○ สอบถามสต๊อคก่อนสั่งซื้อ"}
            </span>
            {product.brand && (
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                แบรนด์ {product.brand}
              </span>
            )}
            {product.sku && (
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                รหัสสินค้า {product.sku}
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <QuoteRequestModal productId={product.id} productName={product.name} />
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
        <div className="mt-20">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
            สินค้าในหมวดเดียวกัน
          </span>
          <h2 className="mt-1 mb-6 text-xl font-extrabold text-neutral-900 sm:text-2xl">
            สินค้าที่เกี่ยวข้อง
          </h2>
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
