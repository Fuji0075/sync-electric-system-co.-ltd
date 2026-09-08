"use client";

import { useRef, useState } from "react";

export default function GalleryUploadField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string[];
}) {
  const [images, setImages] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "อัปโหลดไม่สำเร็จ");
        uploaded.push(data.url);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const jsonValue = JSON.stringify(images);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">{label}</label>
      <p className="mb-2 text-xs text-[var(--admin-text-faint2)]">
        รูปเพิ่มเติมสำหรับแกลเลอรี (นอกเหนือจากรูปหลักด้านบน) เลือกได้หลายไฟล์พร้อมกัน
      </p>

      {images.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative h-20 w-20 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label="ลบรูป"
                className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-xs text-white hover:bg-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg border border-[var(--admin-border-strong)] px-3 py-2 text-sm font-semibold text-[var(--admin-text-secondary)] hover:border-brand hover:text-brand disabled:opacity-50"
      >
        {uploading ? "กำลังอัปโหลด..." : "+ เพิ่มรูปแกลเลอรี"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      <input type="hidden" name={name} value={jsonValue} />
    </div>
  );
}
