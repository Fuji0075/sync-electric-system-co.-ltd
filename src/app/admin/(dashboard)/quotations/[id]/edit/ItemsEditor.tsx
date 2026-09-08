"use client";

import { useState } from "react";

type Item = {
  key: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

let nextKey = 0;
function newKey() {
  nextKey += 1;
  return `new-${nextKey}`;
}

export default function ItemsEditor({
  initialItems,
  initialVatPercent,
}: {
  initialItems: { id: string; description: string; quantity: number; unit: string; unitPrice: number }[];
  initialVatPercent: number;
}) {
  const [items, setItems] = useState<Item[]>(
    initialItems.length > 0
      ? initialItems.map((i) => ({ key: i.id, ...i }))
      : [{ key: newKey(), description: "", quantity: 1, unit: "UNIT", unitPrice: 0 }]
  );
  const [vatPercent, setVatPercent] = useState(initialVatPercent);

  function updateItem(key: string, field: keyof Omit<Item, "key">, value: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              [field]: field === "description" || field === "unit" ? value : Number(value) || 0,
            }
          : item
      )
    );
  }

  function addRow() {
    setItems((prev) => [
      ...prev,
      { key: newKey(), description: "", quantity: 1, unit: "UNIT", unitPrice: 0 },
    ]);
  }

  function removeRow(key: string) {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const vatAmount = (subtotal * vatPercent) / 100;
  const grandTotal = subtotal + vatAmount;

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="w-10 px-3 py-2">#</th>
              <th className="px-3 py-2">รายละเอียด</th>
              <th className="w-20 px-3 py-2">จำนวน</th>
              <th className="w-24 px-3 py-2">หน่วย</th>
              <th className="w-32 px-3 py-2">ราคาต่อหน่วย</th>
              <th className="w-32 px-3 py-2">รวม</th>
              <th className="w-10 px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items.map((item, i) => (
              <tr key={item.key}>
                <td className="px-3 py-2 text-zinc-600">{i + 1}</td>
                <td className="px-3 py-2">
                  <textarea
                    name="item_description"
                    value={item.description}
                    onChange={(e) => updateItem(item.key, "description", e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    name="item_quantity"
                    type="number"
                    step="1"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.key, "quantity", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    name="item_unit"
                    value={item.unit}
                    onChange={(e) => updateItem(item.key, "unit", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    name="item_unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.key, "unitPrice", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
                  />
                </td>
                <td className="px-3 py-2 text-zinc-300">
                  {(item.quantity * item.unitPrice).toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeRow(item.key)}
                    aria-label="ลบรายการ"
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-zinc-400 hover:border-brand hover:text-brand"
      >
        + เพิ่มรายการ
      </button>

      <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>TOTAL</span>
          <span>{subtotal.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span className="flex items-center gap-1">
            VAT
            <input
              name="vatPercent"
              type="number"
              step="0.01"
              min="0"
              value={vatPercent}
              onChange={(e) => setVatPercent(Number(e.target.value) || 0)}
              className="w-14 rounded border border-white/15 bg-white/5 px-1 py-0.5 text-xs text-white"
            />
            %
          </span>
          <span>{vatAmount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-1 font-bold text-white">
          <span>GRAND TOTAL</span>
          <span>{grandTotal.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
