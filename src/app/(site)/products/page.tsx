import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด",
};

type SearchParams = Promise<{ category?: string; q?: string; brand?: string }>;

function toggleBrand(selected: string[], brand: string): string[] {
  return selected.includes(brand) ? selected.filter((b) => b !== brand) : [...selected, brand];
}

function buildHref(params: { category?: string; q?: string; brands: string[] }) {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.q) sp.set("q", params.q);
  if (params.brands.length > 0) sp.set("brand", params.brands.join(","));
  const qs = sp.toString();
  return qs ? `/products?${qs}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, q, brand } = await searchParams;
  const selectedBrands = brand ? brand.split(",").filter(Boolean) : [];

  const [categories, groups, allProducts, settings] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.categoryGroup.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({ include: { category: true } }),
    getSiteSettings(),
  ]);

  const categoryCounts = new Map<string, number>();
  const brandCounts = new Map<string, number>();
  for (const p of allProducts) {
    categoryCounts.set(p.categoryId, (categoryCounts.get(p.categoryId) ?? 0) + 1);
    if (p.brand) brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1);
  }
  const brandList = [...brandCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  const groupedCategories = groups
    .map((g) => ({
      group: g,
      categories: categories.filter((c) => c.groupId === g.id),
    }))
    .filter((g) => g.categories.length > 0);
  const ungroupedCategories = categories.filter((c) => !c.groupId);
  const groupTotal = (cats: typeof categories) =>
    cats.reduce((sum, c) => sum + (categoryCounts.get(c.id) ?? 0), 0);

  const products = allProducts.filter((p) => {
    if (category && p.category.slug !== category) return false;
    if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand))) return false;
    if (q) {
      const needle = q.toLowerCase();
      const haystack = `${p.name} ${p.summary} ${p.description}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

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

      <div className="mb-8 grid grid-cols-3 divide-x divide-neutral-200 rounded-2xl border border-neutral-200 bg-white py-4 text-center sm:max-w-md">
        <div>
          <p className="text-xl font-extrabold text-brand-dark">{allProducts.length}</p>
          <p className="text-[11px] text-neutral-500">รายการสินค้า</p>
        </div>
        <div>
          <p className="text-xl font-extrabold text-brand-dark">{categories.length}</p>
          <p className="text-[11px] text-neutral-500">กลุ่มผลิตภัณฑ์</p>
        </div>
        <div>
          <p className="text-xl font-extrabold text-brand-dark">24 ชม.</p>
          <p className="text-[11px] text-neutral-500">ตอบกลับใบเสนอราคา</p>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="shrink-0 md:w-64">
          <h2 className="mb-3 text-sm font-bold text-neutral-900">หมวดหมู่สินค้า</h2>

          <Link
            href={buildHref({ q, brands: selectedBrands })}
            className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
              !category ? "bg-brand/10 font-bold text-brand-dark" : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            <span>สินค้าทั้งหมด</span>
            <span className={!category ? "text-brand-dark" : "text-neutral-400"}>{allProducts.length}</span>
          </Link>

          <div className="mt-1 flex flex-col gap-0.5">
            {groupedCategories.map(({ group, categories: cats }) => (
              <details key={group.id} className="group" open={cats.some((c) => c.slug === category)}>
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                  <span className="flex items-center gap-1.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-3 w-3 shrink-0 text-neutral-400 transition-transform group-open:rotate-180"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {group.name}
                  </span>
                  <span className="text-neutral-400">{groupTotal(cats)}</span>
                </summary>
                <ul className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-neutral-200 pl-3">
                  {cats.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={buildHref({ category: c.slug, q, brands: selectedBrands })}
                        className={`flex items-center justify-between rounded-md px-3 py-1.5 text-sm ${
                          category === c.slug
                            ? "bg-brand text-white font-semibold"
                            : "text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className={category === c.slug ? "text-white/80" : "text-neutral-400"}>
                          {categoryCounts.get(c.id) ?? 0}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}

            {ungroupedCategories.map((c) => (
              <Link
                key={c.id}
                href={buildHref({ category: c.slug, q, brands: selectedBrands })}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                  category === c.slug
                    ? "bg-brand text-white font-semibold"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <span>{c.name}</span>
                <span className={category === c.slug ? "text-white/80" : "text-neutral-400"}>
                  {categoryCounts.get(c.id) ?? 0}
                </span>
              </Link>
            ))}
          </div>

          {brandList.length > 0 && (
            <>
              <h2 className="mb-3 mt-6 text-sm font-bold text-neutral-900">แบรนด์</h2>
              <ul className="flex flex-col gap-1 text-sm">
                {brandList.map(([b, count]) => {
                  const checked = selectedBrands.includes(b);
                  return (
                    <li key={b}>
                      <Link
                        href={buildHref({ category, q, brands: toggleBrand(selectedBrands, b) })}
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                      >
                        <span
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                            checked ? "border-brand bg-brand text-white" : "border-neutral-300"
                          }`}
                        >
                          {checked && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-2.5 w-2.5">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="flex-1">{b}</span>
                        <span className="text-xs text-neutral-400">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-bold text-neutral-900">ต้องการคำแนะนำ?</p>
            <p className="mt-1 text-xs text-neutral-500">
              ทีมวิศวกรช่วยเลือกมอเตอร์/เกียร์ให้เหมาะกับงานของคุณ โทรปรึกษาได้เลย
            </p>
            <a
              href={`tel:${settings.mobile.replace(/[^0-9+]/g, "")}`}
              className="mt-3 block text-sm font-bold text-brand-dark"
            >
              📞 {settings.mobile}
            </a>
          </div>
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
