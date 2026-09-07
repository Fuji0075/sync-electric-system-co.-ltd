import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AutoRefresh from "@/components/AutoRefresh";

export default async function AdminDashboardPage() {
  const [
    products,
    categories,
    articles,
    banners,
    messages,
    unreadMessages,
    conversationsNeedingAttention,
    newQuotes,
    totalQuotes,
    draftQuotations,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.article.count(),
    prisma.banner.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.conversation.count({ where: { needsAttention: true } }),
    prisma.quoteRequest.count({ where: { status: "new" } }),
    prisma.quoteRequest.count(),
    prisma.quoteDocument.count({ where: { status: { in: ["draft", "approved"] } } }),
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
    {
      label: "แชทที่ต้องการแอดมิน",
      value: conversationsNeedingAttention,
      href: "/admin/chat",
      icon: "💬",
      highlight: conversationsNeedingAttention > 0,
    },
    {
      label: "คำขอใบเสนอราคา (รอติดต่อกลับ)",
      value: `${newQuotes}/${totalQuotes}`,
      href: "/admin/quotes",
      icon: "📥",
      highlight: newQuotes > 0,
    },
    {
      label: "ใบเสนอราคา (ฉบับร่าง/รออนุมัติ)",
      value: draftQuotations,
      href: "/admin/quotations",
      icon: "🧾",
      highlight: draftQuotations > 0,
    },
  ];

  return (
    <div>
      <AutoRefresh intervalMs={10000} />
      <h1 className="mb-6 text-xl font-bold text-neutral-900">แดชบอร์ด</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
              c.highlight
                ? "border-red-300 hover:border-red-400"
                : "border-neutral-200 hover:border-brand"
            }`}
          >
            <span className="text-3xl">{c.icon}</span>
            <div>
              <div
                className={`text-2xl font-extrabold ${
                  c.highlight ? "text-red-600" : "text-neutral-900"
                }`}
              >
                {c.value}
              </div>
              <div className="text-xs text-neutral-500">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
