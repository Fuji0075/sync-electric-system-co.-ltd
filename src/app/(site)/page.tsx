import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";

const CATEGORY_ICONS: Record<string, string> = {
  "induction-motor": "⚙️",
  "gear-motor": "🔩",
  inverter: "🎛️",
  brake: "🛑",
  "water-pump": "💧",
  resistor: "🔌",
};

export default async function HomePage() {
  const [banners, categories, featuredProducts, articles] = await Promise.all([
    prisma.banner.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div>
      <HeroSlider
        slides={banners.map((b) => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          imageUrl: b.imageUrl,
          linkUrl: b.linkUrl,
        }))}
      />

      {/* Trust strip */}
      <div className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 text-center sm:px-6 md:grid-cols-4">
          {[
            { label: "ประสบการณ์", value: "20+ ปี" },
            { label: "สินค้าพร้อมส่ง", value: "มีสต๊อค" },
            { label: "บริการหลังการขาย", value: "ตลอดอายุใช้งาน" },
            { label: "ทีมงานผู้เชี่ยวชาญ", value: "สินค้าอุตสาหกรรม" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-lg font-extrabold text-brand-dark sm:text-xl">
                {item.value}
              </div>
              <div className="text-xs text-neutral-500 sm:text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
              กลุ่มสินค้าของเรา
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              เลือกดูสินค้าตามหมวดหมู่ที่คุณต้องการ
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-semibold text-brand-dark hover:underline sm:inline"
          >
            ดูสินค้าทั้งหมด →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-md"
            >
              <span className="text-3xl transition group-hover:scale-110">
                {CATEGORY_ICONS[c.slug] ?? "⚡"}
              </span>
              <span className="text-xs font-semibold leading-snug text-neutral-700 group-hover:text-brand-dark">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                สินค้าแนะนำ
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                คัดสรรสินค้าคุณภาพ มีสต๊อคพร้อมส่ง
              </p>
            </div>
            <Link
              href="/products"
              className="hidden text-sm font-semibold text-brand-dark hover:underline sm:inline"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">บทความน่ารู้</h2>
            <Link
              href="/articles"
              className="hidden text-sm font-semibold text-brand-dark hover:underline sm:inline"
            >
              ดูบทความทั้งหมด →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-brand to-accent text-4xl text-white/80">
                  📰
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-brand-dark">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-accent">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:px-6 md:flex-row md:text-left">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              ต้องการคำปรึกษาหรือใบเสนอราคา?
            </h2>
            <p className="mt-1 text-sm text-white/80">
              ทีมงานผู้เชี่ยวชาญของเราพร้อมให้คำแนะนำและเลือกสินค้าที่เหมาะกับงานของคุณ
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-bold text-accent shadow-lg transition hover:bg-neutral-100"
          >
            ติดต่อเราเลย
          </Link>
        </div>
      </section>
    </div>
  );
}
