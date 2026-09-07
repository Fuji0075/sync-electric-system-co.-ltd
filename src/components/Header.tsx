import Link from "next/link";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import MobileMenu from "@/components/MobileMenu";
import { getSiteSettings } from "@/lib/settings";

const NAV = [
  { href: "/", label: "หน้าแรก" },
  { href: "/products", label: "สินค้าทั้งหมด" },
  { href: "/catalog", label: "แค็ตตาล็อก" },
  { href: "/articles", label: "บทความ" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/contact", label: "ติดต่อเรา" },
];

export default async function Header() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="bg-accent text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs sm:px-6">
          <span className="hidden sm:inline">
            {settings.company_name_th} — ผู้เชี่ยวชาญด้านมอเตอร์ไฟฟ้าอุตสาหกรรมกว่า 20 ปี
          </span>
          <div className="flex items-center gap-3">
            <a href={`mailto:${settings.email}`} className="hover:underline">
              {settings.email}
            </a>
            <span className="hidden text-white/40 sm:inline">|</span>
            <span className="hidden sm:inline">Line: {settings.line_id}</span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <SearchBar className="hidden flex-1 md:flex" />
        <a
          href={`tel:${settings.mobile.replace(/[^0-9+]/g, "")}`}
          className="ml-auto hidden items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark md:flex"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.2 1.1L6.6 10.8Z" />
          </svg>
          {settings.mobile}
        </a>
        <MobileMenu />
      </div>

      <nav className="hidden border-t border-neutral-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-1 text-sm font-medium text-neutral-700 sm:px-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 transition hover:bg-brand/10 hover:text-brand-dark"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
