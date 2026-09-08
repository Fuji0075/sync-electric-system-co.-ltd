"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { avatarColorClass, initials } from "@/lib/chat-avatar";

export type SidebarNavItem = { href: string; label: string; icon: string };

const COLLAPSE_KEY = "admin_sidebar_collapsed";

export default function AdminSidebar({
  nav,
  extraNav,
  adminName,
  roleLabel,
}: {
  nav: SidebarNavItem[];
  extraNav: SidebarNavItem[];
  adminName: string;
  roleLabel: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // One-time read of a per-viewer preference from localStorage on mount —
    // server has no access to it, so this can't be a lazy useState
    // initializer without a hydration mismatch.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // ignore — localStorage can throw in private-browsing edge cases
    }
    setMounted(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <aside
      className={`relative hidden shrink-0 py-4 pl-4 transition-[width] duration-200 md:block ${
        collapsed ? "w-[88px]" : "w-72"
      } ${mounted ? "" : "invisible"}`}
    >
      <div className="flex h-[calc(100vh-2rem)] flex-col rounded-3xl bg-[#181820] text-zinc-300 shadow-xl">
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
          className="absolute -right-3 top-8 grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-[#232330] text-zinc-300 shadow-md hover:bg-[#2c2c3a] hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`h-3.5 w-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`}
          >
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={`flex items-center gap-2 px-5 pt-5 ${collapsed ? "justify-center px-0" : ""}`}>
          <span className="flex w-fit shrink-0 flex-col items-center justify-center rounded-lg bg-brand px-2.5 py-1.5 leading-none">
            <span className="text-base font-extrabold italic text-white">Sync</span>
            {!collapsed && (
              <span className="text-[7px] font-semibold text-white/95 -mt-0.5">Electric System</span>
            )}
          </span>
        </div>

        <div
          className={`mt-5 flex items-center gap-3 border-b border-white/10 px-5 pb-5 ${
            collapsed ? "flex-col justify-center px-2" : ""
          }`}
        >
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${avatarColorClass(
              adminName
            )}`}
          >
            {initials(adminName)}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-orange-400">{roleLabel}</p>
              <p className="truncate text-sm font-semibold text-white">{adminName}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Main</p>
          )}
          <div className="flex flex-col gap-1">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    collapsed ? "justify-center" : ""
                  } ${
                    active
                      ? "bg-white/10 text-white shadow-inner"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={`text-base ${active ? "" : "opacity-80"}`}>{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400" />}
                </Link>
              );
            })}
          </div>

          {extraNav.length > 0 && (
            <>
              {!collapsed && (
                <p className="mt-5 px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Super Admin
                </p>
              )}
              <div className={`flex flex-col gap-1 ${collapsed ? "mt-5" : ""}`}>
                {extraNav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        collapsed ? "justify-center" : ""
                      } ${
                        active
                          ? "bg-white/10 text-white shadow-inner"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className={`text-base ${active ? "" : "opacity-80"}`}>{item.icon}</span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {active && !collapsed && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}
