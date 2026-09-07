"use client";

import { useActionState, useEffect, useState } from "react";
import { submitQuoteRequest, type QuoteRequestState } from "../actions";

const initialState: QuoteRequestState = { ok: false };

export default function QuoteRequestModal({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(submitQuoteRequest, initialState);

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
        className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
      >
        ขอใบเสนอราคา
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {state.ok ? (
              <div className="py-6 text-center">
                <div className="text-3xl">✅</div>
                <h3 className="mt-2 font-semibold text-brand-dark">ส่งคำขอใบเสนอราคาแล้ว</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  ทีมขายได้รับข้อมูลของคุณแล้ว จะติดต่อกลับโดยเร็วที่สุด
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-4 rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  ปิด
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-neutral-900">ขอใบเสนอราคา</h3>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="ปิด"
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <p className="mb-4 text-sm text-neutral-500">
                  สินค้า: <span className="font-medium text-neutral-800">{productName}</span>
                </p>

                <form action={formAction} className="space-y-3">
                  <input type="hidden" name="productId" value={productId} />
                  <input type="hidden" name="productName" value={productName} />

                  {state.error && (
                    <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{state.error}</p>
                  )}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">ชื่อ *</label>
                    <input
                      name="name"
                      required
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">อีเมล *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">เบอร์โทร</label>
                      <input
                        name="phone"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">บริษัท</label>
                      <input
                        name="company"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">จำนวน</label>
                      <input
                        name="quantity"
                        placeholder="เช่น 2 ตัว"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      รายละเอียดเพิ่มเติม
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
                  >
                    {pending ? "กำลังส่ง..." : "ส่งคำขอใบเสนอราคา"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
