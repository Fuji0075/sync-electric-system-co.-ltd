import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logout } from "../actions";

const NAV = [
  { href: "/admin", label: "แดชบอร์ด", icon: "📊" },
  { href: "/admin/banners", label: "แบนเนอร์หน้าแรก", icon: "🖼️" },
  { href: "/admin/categories", label: "หมวดหมู่สินค้า", icon: "🗂️" },
  { href: "/admin/products", label: "สินค้า", icon: "⚙️" },
  { href: "/admin/articles", label: "บทความ", icon: "📰" },
  { href: "/admin/catalog", label: "แค็ตตาล็อก", icon: "📄" },
  { href: "/admin/messages", label: "ข้อความติดต่อ", icon: "✉️" },
  { href: "/admin/settings", label: "ตั้งค่าเว็บไซต์", icon: "🔧" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

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
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-brand/10 hover:text-brand-dark"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
          <span className="text-sm text-neutral-500">
            เข้าสู่ระบบในชื่อ <strong className="text-neutral-800">{session.name}</strong>
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
