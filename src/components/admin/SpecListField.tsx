"use client";

import { useState } from "react";
import type { ProductSpec } from "@/lib/product-specs";

export default function SpecListField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: ProductSpec[];
}) {
  const [rows, setRows] = useState<ProductSpec[]>(defaultValue.length > 0 ? defaultValue : [{ label: "", value: "" }]);

  function updateRow(index: number, field: "label" | "value", text: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: text } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, { label: "", value: "" }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  const jsonValue = JSON.stringify(rows.filter((r) => r.label.trim() || r.value.trim()));

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">{label}</label>
      <p className="mb-2 text-xs text-[var(--admin-text-faint2)]">
        รายการแรกและรายการที่สองจะแสดงเป็นกล่องเด่นด้านบนราคาในหน้าเว็บ
      </p>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={row.label}
              onChange={(e) => updateRow(i, "label", e.target.value)}
              placeholder="ชื่อสเปก เช่น กำลังขับ"
              className="w-2/5 rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
            <input
              value={row.value}
              onChange={(e) => updateRow(i, "value", e.target.value)}
              placeholder="ค่า เช่น 0.25 – 2,000 HP"
              className="flex-1 rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="shrink-0 rounded-lg border border-[var(--admin-border-strong)] px-3 text-sm text-red-400 hover:border-red-400/40"
            >
              ลบ
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 rounded-full border border-[var(--admin-border-strong)] px-4 py-1.5 text-xs font-semibold text-[var(--admin-text-secondary)] hover:border-brand hover:text-brand"
      >
        + เพิ่มแถวสเปก
      </button>
      <input type="hidden" name={name} value={jsonValue} />
    </div>
  );
}
