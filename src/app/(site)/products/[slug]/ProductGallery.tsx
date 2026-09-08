"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  productName,
  fallbackIcon,
  inStock,
  seriesTag,
}: {
  images: string[];
  productName: string;
  fallbackIcon: string;
  inStock: boolean;
  seriesTag: string | null;
}) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div>
      {seriesTag && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-bold text-neutral-700 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {seriesTag}
        </span>
      )}

      {hasImages ? (
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-supplied product image, arbitrary local/external URL */}
          <img src={images[active]} alt={productName} className="h-full w-full object-contain p-8" />
          {inStock && (
            <span className="absolute right-5 top-5 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-sm">
              พร้อมส่ง
            </span>
          )}
        </div>
      ) : (
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand/10 to-accent/5">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle, #0f6b2e 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          />
          <span className="relative grid h-40 w-40 place-items-center rounded-[2rem] bg-white text-8xl shadow-lg sm:h-48 sm:w-48">
            {fallbackIcon}
          </span>
          {inStock && (
            <span className="absolute right-5 top-5 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-sm">
              พร้อมส่ง
            </span>
          )}
        </div>
      )}

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${
                i === active ? "border-brand" : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
