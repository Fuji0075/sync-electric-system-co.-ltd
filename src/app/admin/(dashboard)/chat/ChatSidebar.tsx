"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ChatAvatar from "./ChatAvatar";

export type SidebarConversation = {
  id: string;
  displayName: string;
  channel: string;
  subtitle: string | null;
  lastMessagePreview: string | null;
  needsAttention: boolean;
  isOpen: boolean;
  updatedAtLabel: string;
};

function ChannelBadge({ channel }: { channel: string }) {
  if (channel !== "line") return null;
  return (
    <span className="shrink-0 rounded bg-[#06C755] px-1.5 py-0.5 text-[9px] font-bold text-white">
      LINE
    </span>
  );
}

export default function ChatSidebar({ conversations }: { conversations: SidebarConversation[] }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const filtered = conversations.filter((c) =>
    c.displayName.toLowerCase().includes(query.trim().toLowerCase())
  );
  const needsAttention = conversations.filter((c) => c.needsAttention);

  return (
    <aside className="flex w-full max-w-xs shrink-0 flex-col border-r border-white/10 bg-[#15151b]">
      <div className="border-b border-white/5 p-4">
        <h1 className="text-lg font-bold text-white">แชทกับลูกค้า</h1>
        <div className="relative mt-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อลูกค้า..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand focus:bg-[#15151b]"
          />
        </div>
      </div>

      {needsAttention.length > 0 && (
        <div className="flex gap-3 overflow-x-auto border-b border-white/5 p-3">
          {needsAttention.slice(0, 8).map((c) => (
            <Link
              key={c.id}
              href={`/admin/chat/${c.id}`}
              title={c.displayName}
              className="flex shrink-0 flex-col items-center gap-1"
            >
              <ChatAvatar name={c.displayName} online={c.isOpen} size="sm" />
              <span className="max-w-[3.5rem] truncate text-[10px] text-zinc-500">
                {c.displayName.split(" ")[0]}
              </span>
            </Link>
          ))}
        </div>
      )}

      <p className="px-4 pt-3 text-xs font-semibold uppercase tracking-wide text-zinc-600">
        ล่าสุด
      </p>
      <ul className="flex-1 divide-y divide-white/10 overflow-y-auto">
        {filtered.map((c) => {
          const active = pathname === `/admin/chat/${c.id}`;
          return (
            <li key={c.id}>
              <Link
                href={`/admin/chat/${c.id}`}
                className={`flex items-center gap-3 px-4 py-3 transition hover:bg-white/5 ${
                  active ? "bg-brand/5" : ""
                }`}
              >
                <ChatAvatar name={c.displayName} online={c.isOpen} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-sm font-semibold text-white">
                        {c.displayName}
                      </span>
                      <ChannelBadge channel={c.channel} />
                    </span>
                    <time className="shrink-0 text-[10px] text-zinc-600">{c.updatedAtLabel}</time>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-zinc-500">
                      {c.lastMessagePreview ?? "ยังไม่มีข้อความ"}
                    </p>
                    {c.needsAttention && (
                      <span className="grid h-4 min-w-4 shrink-0 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                        !
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="p-8 text-center text-sm text-zinc-600">ไม่พบการสนทนา</li>
        )}
      </ul>
    </aside>
  );
}
