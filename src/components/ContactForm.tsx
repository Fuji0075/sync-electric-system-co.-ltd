"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/app/(site)/contact/actions";

const initialState: ContactFormState = { ok: false };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-8 text-center">
        <div className="text-3xl">✅</div>
        <h3 className="mt-2 font-semibold text-brand-dark">ส่งข้อความเรียบร้อยแล้ว</h3>
        <p className="mt-1 text-sm text-neutral-600">
          ขอบคุณที่ติดต่อเรา ทีมงานจะรีบติดต่อกลับโดยเร็วที่สุด
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">ชื่อ *</label>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">อีเมล *</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">เบอร์โทร</label>
        <input
          name="phone"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">ข้อความ *</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "กำลังส่ง..." : "ส่งข้อความ"}
      </button>
    </form>
  );
}
