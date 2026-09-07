"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

const NAV = [
  { href: "/", label: "หน้าแรก" },
  { href: "/products", label: "สินค้าทั้งหมด" },
  { href: "/catalog", label: "แค็ตตาล็อก" },
  { href: "/articles", label: "บทความ" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/contact", label: "ติดต่อเรา" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label="เมนู"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-700"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-t border-neutral-200 bg-white p-4 shadow-lg">
          <SearchBar className="mb-4" />
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
