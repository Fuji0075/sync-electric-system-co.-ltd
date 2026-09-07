"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginCustomer, type AccountFormState } from "../actions";

const initialState: AccountFormState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginCustomer, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">อีเมล</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">รหัสผ่าน</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
      <p className="text-center text-xs text-neutral-500">
        ยังไม่มีบัญชี?{" "}
        <Link href="/account/register" className="font-semibold text-brand-dark hover:underline">
          สมัครสมาชิก
        </Link>
      </p>
    </form>
  );
}
