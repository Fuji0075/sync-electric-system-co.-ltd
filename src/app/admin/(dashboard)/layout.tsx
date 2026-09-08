import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "../actions";
import { getCurrentAdminAccess, canAccess, isSuperAdmin, type ModuleKey } from "@/lib/admin-permissions";
import AdminSidebar from "./AdminSidebar";
import AdminThemeToggle from "./AdminThemeToggle";

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
  const extraNav = isSuperAdmin(admin)
    ? [
        { href: "/admin/users", label: "จัดการผู้ใช้", icon: "👤" },
        { href: "/admin/logs", label: "ประวัติการทำงาน", icon: "📋" },
      ]
    : [];

  return (
    <div className="admin-shell flex min-h-screen bg-[var(--admin-canvas)]" data-theme="dark">
      <AdminSidebar
        nav={visibleNav}
        extraNav={extraNav}
        adminName={admin.name}
        roleLabel={isSuperAdmin(admin) ? "Super Admin" : "Admin"}
      />

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-header-bg)] px-6 py-3.5">
          <span className="text-sm text-[var(--admin-text-muted)]">
            เข้าสู่ระบบในชื่อ <strong className="text-[var(--admin-text)]">{admin.name}</strong>
            {isSuperAdmin(admin) && (
              <span className="ml-2 rounded-full bg-orange-400/15 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                SUPER ADMIN
              </span>
            )}
          </span>
          <div className="flex items-center gap-3">
            <AdminThemeToggle />
            <Link href="/" target="_blank" className="text-xs text-[var(--admin-text-muted)] hover:text-orange-400">
              ดูหน้าเว็บไซต์ ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-[var(--admin-border-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--admin-text-secondary)] hover:border-red-400/40 hover:text-red-400"
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
