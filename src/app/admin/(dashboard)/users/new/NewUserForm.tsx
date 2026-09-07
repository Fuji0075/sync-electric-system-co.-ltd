"use client";

import { useActionState } from "react";
import { createAdminUser, type UserFormState } from "../actions";
import PermissionCheckboxes from "../PermissionCheckboxes";

const initialState: UserFormState = {};

export default function NewUserForm() {
  const [state, formAction, pending] = useActionState(createAdminUser, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">ชื่อ-นามสกุล *</label>
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
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) *</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">บทบาท</label>
        <select
          name="role"
          defaultValue="admin"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="admin">Admin (กำหนดสิทธิ์เอง)</option>
          <option value="super_admin">Super Admin (เข้าถึงได้ทุกส่วน)</option>
        </select>
      </div>

      <PermissionCheckboxes selected={[]} />

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "กำลังสร้าง..." : "สร้างผู้ใช้"}
      </button>
    </form>
  );
}
