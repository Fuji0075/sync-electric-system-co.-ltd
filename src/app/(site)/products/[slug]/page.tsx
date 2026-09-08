import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { getSiteSettings } from "@/lib/settings";
import { categoryIcon } from "@/lib/category-icons";
import { parseSpecs, parseStringList } from "@/lib/product-specs";
import QuoteRequestModal from "./QuoteRequestModal";
import ProductGallery from "./ProductGallery";
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
    include: { category: { include: { group: true } } },
  });

  if (!product) notFound();

  const [related, settings, brands] = await Promise.all([
    prisma.product.findMany({
      where: { categoryId: product.categoryId, NOT: { id: product.id } },
      include: { category: true },
      take: 4,
    }),
    getSiteSettings(),
    prisma.brand.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
  ]);

  const specs = parseSpecs(product.specs);
  const highlights = parseStringList(product.highlights);
  const gallery = [product.imageUrl, ...parseStringList(product.galleryImages)].filter(
    (url): url is string => Boolean(url)
  );
  const highlightSpecs = specs.slice(0, 2);

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
        <div>
          <ProductGallery
            images={gallery}
            productName={product.name}
            fallbackIcon={categoryIcon(product.category.slug)}
            inStock={product.inStock}
            seriesTag={product.series}
          />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">{product.name}</h1>
          <div className="mt-4">
            <h2 className="mb-2 text-sm font-bold text-neutral-900">รายละเอียดสินค้า</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">{product.description}</p>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
            <span>{product.category.name}</span>
            {product.series && (
              <>
                <span className="text-neutral-300">·</span>
                <span>{product.series}</span>
              </>
            )}
            {product.category.group && (
              <>
                <span className="text-neutral-300">·</span>
                <span>กลุ่ม {product.category.group.name}</span>
              </>
            )}
          </div>

          {(product.brand || highlights.length > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {product.brand && (
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
                  {product.brand}
                </span>
              )}
              {highlights.slice(0, 2).map((h) => (
                <span
                  key={h}
                  className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          {highlightSpecs.length > 0 && (
            <div className={`mt-4 grid gap-3 ${highlightSpecs.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
              {highlightSpecs.map((spec) => (
                <div key={spec.label} className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">{spec.label}</p>
                  <p className="mt-0.5 text-sm font-bold text-neutral-900">{spec.value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-neutral-500">ราคา</p>
            <p className="mb-3 text-lg font-extrabold text-neutral-900">
              {product.price != null ? `฿${product.price.toLocaleString("th-TH")}` : "สอบถาม / ขอใบเสนอราคา"}
            </p>

            <QuoteRequestModal productId={product.id} productName={product.name} />

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-neutral-100 pt-4 text-sm">
              <a
                href={`tel:${settings.mobile.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-1.5 font-semibold text-neutral-600 hover:text-orange-600"
              >
                📞 โทรสอบถาม {settings.mobile}
              </a>
              <a
                href={`mailto:${settings.email}?subject=${encodeURIComponent(`ขอสเปก/เอกสาร: ${product.name}`)}`}
                className="flex items-center gap-1.5 font-semibold text-neutral-600 hover:text-orange-600"
              >
                ✉️ อีเมลขอสเปก/เอกสาร
              </a>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-neutral-200 p-3">
              <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-base">✅</span>
              <p className="mt-1.5 text-xs font-bold text-neutral-800">สินค้าของแท้</p>
              <p className="text-[11px] leading-tight text-neutral-500">รับประกันคุณภาพ</p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-3">
              <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-base">🚚</span>
              <p className="mt-1.5 text-xs font-bold text-neutral-800">
                {product.inStock ? "มีสต๊อก" : "สั่งผลิต"}
              </p>
              <p className="text-[11px] leading-tight text-neutral-500">จัดส่งทั่วไทย</p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-3">
              <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-purple-100 text-base">🎧</span>
              <p className="mt-1.5 text-xs font-bold text-neutral-800">ทีมวิศวกร</p>
              <p className="text-[11px] leading-tight text-neutral-500">ให้คำปรึกษาฟรี</p>
            </div>
          </div>
        </div>
      </div>

      {brands.length > 0 && (
        <section className="mt-10">
          <div className="mb-5 flex items-center gap-2 text-sm font-bold text-neutral-900">
            <span className="text-orange-600">▣</span>
            <h2>รุ่นที่มีจำหน่าย</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center bg-white p-4">
                  {brand.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-supplied brand image
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
                      className="h-full w-full object-contain transition group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-2xl font-extrabold text-neutral-500">{brand.name}</span>
                  )}
                </div>
                <div className="border-t border-neutral-100 px-4 py-3 text-center">
                  <h3 className="text-sm font-extrabold text-neutral-700">{brand.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-500">{brand.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(specs.length > 0 || highlights.length > 0) && (
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {specs.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral-900">
                <span className="text-brand-dark">▤</span> ข้อมูลจำเพาะ (Specifications)
              </h2>
              <div className="overflow-hidden rounded-2xl border border-neutral-200">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-neutral-100">
                    {specs.map((spec) => (
                      <tr key={spec.label} className="odd:bg-neutral-50">
                        <td className="w-2/5 px-4 py-2.5 text-neutral-500">{spec.label}</td>
                        <td className="px-4 py-2.5 font-semibold text-neutral-900">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {highlights.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral-900">
                <span className="text-brand-dark">✦</span> จุดเด่นสินค้า
              </h2>
              <ul className="space-y-2.5">
                {highlights.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-neutral-700">
                    <span className="mt-0.5 text-brand-dark">✔</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

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
