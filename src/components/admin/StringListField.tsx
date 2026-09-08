"use client";

import { useState } from "react";

export default function StringListField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue: string[];
  placeholder?: string;
}) {
  const [items, setItems] = useState<string[]>(defaultValue.length > 0 ? defaultValue : [""]);

  function updateItem(index: number, text: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? text : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, ""]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const jsonValue = JSON.stringify(items.filter((s) => s.trim()));

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="shrink-0 rounded-lg border border-[var(--admin-border-strong)] px-3 text-sm text-red-400 hover:border-red-400/40"
            >
              ลบ
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-2 rounded-full border border-[var(--admin-border-strong)] px-4 py-1.5 text-xs font-semibold text-[var(--admin-text-secondary)] hover:border-brand hover:text-brand"
      >
        + เพิ่มจุดเด่น
      </button>
      <input type="hidden" name={name} value={jsonValue} />
    </div>
  );
}
