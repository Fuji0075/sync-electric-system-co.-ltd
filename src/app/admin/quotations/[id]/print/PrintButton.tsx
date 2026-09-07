"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
    >
      🖨️ พิมพ์ / บันทึกเป็น PDF
    </button>
  );
}
