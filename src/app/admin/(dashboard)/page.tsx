import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [products, categories, articles, banners, messages, unreadMessages] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.article.count(),
      prisma.banner.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

  const cards = [
    { label: "สินค้า", value: products, href: "/admin/products", icon: "⚙️" },
    { label: "หมวดหมู่", value: categories, href: "/admin/categories", icon: "🗂️" },
    { label: "บทความ", value: articles, href: "/admin/articles", icon: "📰" },
    { label: "แบนเนอร์", value: banners, href: "/admin/banners", icon: "🖼️" },
    {
      label: "ข้อความติดต่อ (ยังไม่อ่าน)",
      value: `${unreadMessages}/${messages}`,
      href: "/admin/messages",
      icon: "✉️",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">แดชบอร์ด</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <span className="text-3xl">{c.icon}</span>
            <div>
              <div className="text-2xl font-extrabold text-neutral-900">{c.value}</div>
              <div className="text-xs text-neutral-500">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
