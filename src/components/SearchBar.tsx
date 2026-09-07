"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      }}
      className={`flex w-full max-w-md items-stretch overflow-hidden rounded-full border border-neutral-300 bg-white focus-within:border-brand ${className}`}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="text"
        placeholder="ค้นหาสินค้า เช่น มอเตอร์, เกียร์, อินเวอร์เตอร์..."
        className="w-full bg-transparent px-4 py-2 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
      />
      <button
        type="submit"
        aria-label="ค้นหา"
        className="flex items-center justify-center bg-brand px-4 text-white transition hover:bg-brand-dark"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          className="h-4 w-4"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
