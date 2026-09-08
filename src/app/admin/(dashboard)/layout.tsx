import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "../actions";
import { getCurrentAdminAccess, canAccess, isSuperAdmin, type ModuleKey } from "@/lib/admin-permissions";
import AdminSidebar from "./AdminSidebar";

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
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar
        nav={visibleNav}
        extraNav={extraNav}
        adminName={admin.name}
        roleLabel={isSuperAdmin(admin) ? "Super Admin" : "Admin"}
      />

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
