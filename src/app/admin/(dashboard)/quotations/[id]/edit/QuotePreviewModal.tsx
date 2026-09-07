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
        className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-600 hover:border-brand hover:text-brand-dark"
      >
        ดูตัวอย่าง / พิมพ์
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2">
              <span className="text-sm font-semibold text-neutral-700">ตัวอย่างใบเสนอราคา</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="ปิด"
                className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100"
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
