"use client";

import { useEffect, useState, useTransition } from "react";

type CatalogFile = {
  id: string;
  title: string;
  fileUrl: string;
  coverImage: string | null;
  order: number;
};

export default function EditCatalogModal({
  file,
  action,
}: {
  file: CatalogFile;
  action: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await action(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-emerald-400 hover:underline"
      >
        แก้ไข
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-[#15151b] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="text-sm font-semibold text-zinc-300">แก้ไขไฟล์แค็ตตาล็อก</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="ปิด"
                className="rounded-full p-1.5 text-zinc-500 hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form action={handleSubmit} className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">ชื่อไฟล์ *</label>
                <input
                  name="title"
                  required
                  defaultValue={file.title}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">ลิงก์ไฟล์ (URL) *</label>
                <input
                  name="fileUrl"
                  required
                  defaultValue={file.fileUrl}
                  placeholder="/catalogs/motor-catalog.pdf"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">ลิงก์รูปหน้าปก (URL)</label>
                <input
                  name="coverImage"
                  defaultValue={file.coverImage ?? ""}
                  placeholder="/catalogs/covers/motor-catalog.jpg"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">ลำดับ</label>
                <input
                  name="order"
                  type="number"
                  defaultValue={file.order}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-500 hover:bg-white/10"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
                >
                  {pending ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
