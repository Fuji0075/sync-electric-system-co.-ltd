"use client";

import { useRef, useState } from "react";

export default function ImageUploadField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "อัปโหลดไม่สำเร็จ");
      setValue(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">{label}</label>

      {value && (
        <div className="mb-2 h-28 w-full overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="ตัวอย่างรูปภาพ" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 whitespace-nowrap rounded-lg border border-[var(--admin-border-strong)] px-3 py-2 text-sm font-semibold text-[var(--admin-text-secondary)] hover:border-brand hover:text-brand disabled:opacity-50"
        >
          {uploading ? "กำลังอัปโหลด..." : "เลือกไฟล์จากเครื่อง"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
