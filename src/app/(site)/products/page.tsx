import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด",
};

type SearchParams = Promise<{ category?: string; q?: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, q } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where: {
        ...(category ? { category: { slug: category } } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { summary: { contains: q } },
                { description: { contains: q } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          {activeCategory ? activeCategory.name : "สินค้าทั้งหมด"}
        </h1>
        {q && (
          <p className="mt-1 text-sm text-neutral-500">
            ผลการค้นหาสำหรับ &ldquo;{q}&rdquo; ({products.length} รายการ)
          </p>
        )}
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="shrink-0 md:w-56">
          <h2 className="mb-3 text-sm font-bold text-neutral-900">หมวดหมู่สินค้า</h2>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <Link
                href="/products"
                className={`block rounded-md px-3 py-2 ${
                  !category
                    ? "bg-brand text-white font-semibold"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                ทั้งหมด
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className={`block rounded-md px-3 py-2 ${
                    category === c.slug
                      ? "bg-brand text-white font-semibold"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <p className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
              ไม่พบสินค้าที่ตรงกับเงื่อนไข ลองค้นหาด้วยคำอื่น หรือติดต่อทีมขายของเรา
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
