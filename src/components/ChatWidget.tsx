"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { parseChatMessage } from "@/lib/chat-message";
import { linkify } from "@/lib/linkify";

type ChatMessage = {
  id: string;
  sender: "visitor" | "admin" | "ai";
  body: string;
  createdAt: string;
};

const SENDER_LABEL: Record<ChatMessage["sender"], string> = {
  visitor: "คุณ",
  admin: "ทีมงาน Sync Electric",
  ai: "ผู้ช่วยอัตโนมัติ",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/chat", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch {
      // network hiccup — next poll will retry
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(fetchMessages, 4000);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load on open, not a render-time state sync
    fetchMessages();
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    setMessages((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, sender: "visitor", body: text, createdAt: new Date().toISOString() },
    ]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 flex h-[28rem] w-[20rem] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl sm:w-[22rem]">
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">แชทกับ Sync Electric</p>
              <p className="text-[11px] text-white/80">ถามข้อมูลสินค้า สเปค หรือขอใบเสนอราคา</p>
            </div>
            <button
              aria-label="ปิดแชท"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-neutral-50 p-3">
            {!loaded && (
              <p className="text-center text-xs text-neutral-400">กำลังโหลด...</p>
            )}
            {loaded && messages.length === 0 && (
              <p className="text-center text-xs text-neutral-400">
                สวัสดีค่ะ 👋 พิมพ์คำถามเกี่ยวกับสินค้าได้เลย
              </p>
            )}
            {messages.map((m) => {
              const isVisitor = m.sender === "visitor";
              const { text, quoteButtons } = parseChatMessage(m.body);
              return (
                <div key={m.id} className={`flex ${isVisitor ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                      isVisitor
                        ? "bg-brand text-white"
                        : m.sender === "ai"
                          ? "bg-white border border-neutral-200 text-neutral-700"
                          : "bg-accent text-white"
                    }`}
                  >
                    {!isVisitor && (
                      <p className="mb-0.5 text-[10px] font-semibold opacity-70">
                        {SENDER_LABEL[m.sender]}
                      </p>
                    )}
                    {linkify(text, "underline")}
                    {quoteButtons.length > 0 && (
                      <div className="mt-2 flex flex-col gap-1.5">
                        {quoteButtons.map((b) => (
                          <Link
                            key={b.slug}
                            href={`/products/${b.slug}?quote=1`}
                            className="inline-flex items-center justify-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
                          >
                            🧾 ขอใบเสนอราคา: {b.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-neutral-200 p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
              className="flex-1 rounded-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="ส่งข้อความ"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M3 20l18-8L3 4v6l12 2-12 2v6z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="เปิด/ปิดแชท"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl transition hover:bg-brand-dark"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
