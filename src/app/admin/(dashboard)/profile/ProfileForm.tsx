"use client";

import { useActionState, useState } from "react";
import { updateAdminProfile, type ProfileFormState } from "./actions";

const initialState: ProfileFormState = {};

export default function ProfileForm({
  name,
  email,
  phone,
  signatureUrl,
}: {
  name: string;
  email: string;
  phone: string | null;
  signatureUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateAdminProfile, initialState);
  const [preview, setPreview] = useState<string | null>(signatureUrl);
  const [dataUrl, setDataUrl] = useState("");
  const [removeSignature, setRemoveSignature] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert("ไฟล์รูปใหญ่เกินไป กรุณาเลือกไฟล์ไม่เกิน 500KB");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setPreview(result);
      setDataUrl(result);
      setRemoveSignature(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <form action={formAction} className="max-w-lg space-y-5 rounded-2xl border border-neutral-200 bg-white p-6">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-brand/10 px-4 py-2 text-sm text-brand-dark">บันทึกโปรไฟล์แล้ว</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">ชื่อ</label>
        <input
          disabled
          value={name}
          className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">อีเมล</label>
        <input
          disabled
          value={email}
          className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">เบอร์โทร (แสดงในใบเสนอราคา)</label>
        <input
          name="phone"
          defaultValue={phone ?? ""}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          รูปลายเซ็น (แสดงในใบเสนอราคาที่คุณสร้าง)
        </label>
        <p className="mb-2 text-xs text-neutral-400">
          แนะนำ: ถ่ายรูปลายเซ็นบนกระดาษขาว หรือเซ็นในแอปวาดภาพแล้วบันทึกเป็น PNG พื้นหลังโปร่งใส (ไม่เกิน 500KB)
        </p>
        {preview && !removeSignature && (
          <div className="mb-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- small inline base64 signature preview */}
            <img src={preview} alt="ลายเซ็น" className="h-16 rounded border border-neutral-200 bg-white p-1" />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setRemoveSignature(true);
                setDataUrl("");
              }}
              className="text-xs text-red-500 hover:underline"
            >
              ลบรูปลายเซ็น
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFile}
          className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-dark"
        />
        <input type="hidden" name="signatureDataUrl" value={dataUrl} />
        <input type="hidden" name="removeSignature" value={removeSignature ? "on" : ""} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "กำลังบันทึก..." : "บันทึกโปรไฟล์"}
      </button>
    </form>
  );
}
