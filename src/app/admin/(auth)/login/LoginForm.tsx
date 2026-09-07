"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center">
          <span className="flex flex-col items-center justify-center rounded-md bg-brand px-4 py-2 leading-none shadow-sm">
            <span className="text-2xl font-extrabold italic text-white tracking-tight">
              Sync
            </span>
            <span className="text-[10px] font-semibold text-white/95 tracking-wide -mt-0.5">
              Electric System
            </span>
          </span>
          <h1 className="mt-4 text-lg font-bold text-neutral-900">Admin Console</h1>
        </div>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {state.error}
            </p>
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
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}
