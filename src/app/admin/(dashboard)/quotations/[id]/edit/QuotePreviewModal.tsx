"use client";

import { useEffect, useState } from "react";

export default function QuotePreviewModal({ quoteId }: { quoteId: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-[var(--admin-border-strong)] px-4 py-2 text-xs font-semibold text-[var(--admin-text-muted)] hover:border-brand hover:text-brand"
      >
        ดูตัวอย่าง / พิมพ์
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[var(--admin-surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-4 py-2">
              <span className="text-sm font-semibold text-[var(--admin-text-secondary)]">ตัวอย่างใบเสนอราคา</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="ปิด"
                className="rounded-full p-1.5 text-[var(--admin-text-faint)] hover:bg-[var(--admin-surface-softer)]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <iframe
              src={`/admin/quotations/${quoteId}/print`}
              title="ตัวอย่างใบเสนอราคา"
              className="flex-1 border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
