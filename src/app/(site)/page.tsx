import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import { categoryIcon } from "@/lib/category-icons";

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
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-8 sm:grid-cols-4 sm:gap-4 sm:px-6">
          {[
            { icon: "🏆", label: "ประสบการณ์", value: "20+ ปี" },
            { icon: "📦", label: "สินค้าพร้อมส่ง", value: "มีสต๊อค" },
            { icon: "🛠️", label: "บริการหลังการขาย", value: "ตลอดอายุใช้งาน" },
            { icon: "👷", label: "ทีมงานผู้เชี่ยวชาญ", value: "สินค้าอุตสาหกรรม" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-neutral-100 sm:flex-col sm:items-center sm:text-center"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-lg">
                {item.icon}
              </span>
              <div>
                <div className="text-base font-extrabold text-brand-dark sm:text-lg">
                  {item.value}
                </div>
                <div className="text-xs text-neutral-500">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
              หมวดหมู่สินค้า
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
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
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-lg"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand/15 to-accent/10 text-3xl transition group-hover:scale-110 group-hover:from-brand/25">
                {categoryIcon(c.slug)}
              </span>
              <span className="text-xs font-semibold leading-snug text-neutral-700 group-hover:text-brand-dark">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
                คัดสรรมาให้แล้ว
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
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
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
                ความรู้อุตสาหกรรม
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
                บทความน่ารู้
              </h2>
            </div>
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
                className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-accent">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                  <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm transition group-hover:scale-110">
                    📰
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-brand-dark">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{a.excerpt}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-dark">
                    อ่านต่อ
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 transition group-hover:translate-x-0.5">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-accent">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-14 text-center sm:px-6 md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              ต้องการคำปรึกษาหรือใบเสนอราคา?
            </h2>
            <p className="mt-2 text-sm text-white/80 sm:text-base">
              ทีมงานผู้เชี่ยวชาญของเราพร้อมให้คำแนะนำและเลือกสินค้าที่เหมาะกับงานของคุณ
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-accent shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-100"
          >
            ติดต่อเราเลย
          </Link>
        </div>
      </section>
    </div>
  );
}
