import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AutoRefresh from "@/components/AutoRefresh";
import { getCurrentAdminAccess, canAccess, type ModuleKey } from "@/lib/admin-permissions";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdminAccess();
  if (!admin) redirect("/admin/login");

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

  const cards: { label: string; value: string | number; href: string; icon: string; module: ModuleKey; highlight?: boolean }[] = [
    { label: "สินค้า", value: products, href: "/admin/products", icon: "⚙️", module: "products" },
    { label: "หมวดหมู่", value: categories, href: "/admin/categories", icon: "🗂️", module: "categories" },
    { label: "บทความ", value: articles, href: "/admin/articles", icon: "📰", module: "articles" },
    { label: "แบนเนอร์", value: banners, href: "/admin/banners", icon: "🖼️", module: "banners" },
    {
      label: "ข้อความติดต่อ (ยังไม่อ่าน)",
      value: `${unreadMessages}/${messages}`,
      href: "/admin/messages",
      icon: "✉️",
      module: "messages",
    },
    {
      label: "แชทที่ต้องการแอดมิน",
      value: conversationsNeedingAttention,
      href: "/admin/chat",
      icon: "💬",
      module: "chat",
      highlight: conversationsNeedingAttention > 0,
    },
    {
      label: "คำขอใบเสนอราคา (รอติดต่อกลับ)",
      value: `${newQuotes}/${totalQuotes}`,
      href: "/admin/quotes",
      icon: "📥",
      module: "quotes",
      highlight: newQuotes > 0,
    },
    {
      label: "ใบเสนอราคา (ฉบับร่าง/รออนุมัติ)",
      value: draftQuotations,
      href: "/admin/quotations",
      icon: "🧾",
      module: "quotations",
      highlight: draftQuotations > 0,
    },
  ];
  const visibleCards = cards.filter((c) => canAccess(admin, c.module));

  return (
    <div>
      <AutoRefresh intervalMs={10000} />
      <h1 className="mb-6 text-xl font-bold text-white">แดชบอร์ด</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`flex items-center gap-4 rounded-2xl border bg-[#15151b] p-5 shadow-sm transition hover:shadow-md ${
              c.highlight
                ? "border-red-500/40 hover:border-red-400"
                : "border-white/10 hover:border-brand"
            }`}
          >
            <span className="text-3xl">{c.icon}</span>
            <div>
              <div
                className={`text-2xl font-extrabold ${
                  c.highlight ? "text-red-400" : "text-white"
                }`}
              >
                {c.value}
              </div>
              <div className="text-xs text-zinc-500">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
