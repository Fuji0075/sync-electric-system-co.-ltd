import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "../actions";
import { getCurrentAdminAccess, canAccess, isSuperAdmin, type ModuleKey } from "@/lib/admin-permissions";

const NAV: { href: string; label: string; icon: string; module?: ModuleKey }[] = [
  { href: "/admin", label: "แดชบอร์ด", icon: "📊" },
  { href: "/admin/banners", label: "แบนเนอร์หน้าแรก", icon: "🖼️", module: "banners" },
  { href: "/admin/categories", label: "หมวดหมู่สินค้า", icon: "🗂️", module: "categories" },
  { href: "/admin/products", label: "สินค้า", icon: "⚙️", module: "products" },
  { href: "/admin/articles", label: "บทความ", icon: "📰", module: "articles" },
  { href: "/admin/catalog", label: "แค็ตตาล็อก", icon: "📄", module: "catalog" },
  { href: "/admin/messages", label: "ข้อความติดต่อ", icon: "✉️", module: "messages" },
  { href: "/admin/chat", label: "แชทกับลูกค้า", icon: "💬", module: "chat" },
  { href: "/admin/quotes", label: "คำขอใบเสนอราคา", icon: "📥", module: "quotes" },
  { href: "/admin/quotations", label: "ใบเสนอราคา", icon: "🧾", module: "quotations" },
  { href: "/admin/profile", label: "โปรไฟล์ของฉัน", icon: "✍️" },
  { href: "/admin/settings", label: "ตั้งค่าเว็บไซต์", icon: "🔧", module: "settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdminAccess();
  if (!admin) {
    redirect("/admin/login");
  }

  const visibleNav = NAV.filter((item) => !item.module || canAccess(admin, item.module));

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white md:block">
        <div className="border-b border-neutral-100 p-4">
          <span className="flex w-fit flex-col items-center justify-center rounded-md bg-brand px-3 py-1.5 leading-none">
            <span className="text-lg font-extrabold italic text-white">Sync</span>
            <span className="text-[8px] font-semibold text-white/95 -mt-0.5">
              Electric System
            </span>
          </span>
          <p className="mt-2 text-xs text-neutral-400">Admin Console</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-brand/10 hover:text-brand-dark"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {isSuperAdmin(admin) && (
            <>
              <Link
                href="/admin/users"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-brand/10 hover:text-brand-dark"
              >
                <span>👤</span>
                จัดการผู้ใช้
              </Link>
              <Link
                href="/admin/logs"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-brand/10 hover:text-brand-dark"
              >
                <span>📋</span>
                ประวัติการทำงาน
              </Link>
            </>
          )}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
          <span className="text-sm text-neutral-500">
            เข้าสู่ระบบในชื่อ <strong className="text-neutral-800">{admin.name}</strong>
            {isSuperAdmin(admin) && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                SUPER ADMIN
              </span>
            )}
          </span>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-neutral-500 hover:text-brand-dark">
              ดูหน้าเว็บไซต์ ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:border-red-300 hover:text-red-600"
              >
                ออกจากระบบ
              </button>
            </form>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
