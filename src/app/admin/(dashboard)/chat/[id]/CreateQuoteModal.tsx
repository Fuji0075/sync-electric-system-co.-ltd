"use client";

import { useEffect, useState, useTransition } from "react";

export default function CreateQuoteModal({
  action,
}: {
  action: () => Promise<{ quoteId: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await action();
        setQuoteId(result.quoteId);
        setOpen(true);
      } catch {
        setError("สร้างใบเสนอราคาไม่สำเร็จ ลองใหม่อีกครั้ง");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCreate}
        disabled={pending}
        className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "กำลังสร้าง..." : "🧾 สร้างใบเสนอราคา"}
      </button>
      {error && <span className="ml-2 text-xs text-red-500">{error}</span>}

      {open && quoteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#15151b] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <span className="text-sm font-semibold text-zinc-300">
                ใบเสนอราคาที่สร้างจากแชทนี้
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="ปิด"
                className="rounded-full p-1.5 text-zinc-500 hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <iframe
              src={`/admin/quotations/${quoteId}/edit-embed`}
              title="แก้ไขใบเสนอราคา"
              className="flex-1 border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
