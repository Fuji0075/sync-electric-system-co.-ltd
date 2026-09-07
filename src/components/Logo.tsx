import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 shrink-0 ${className}`}
    >
      <span className="flex flex-col items-center justify-center rounded-md bg-brand px-3 py-1.5 leading-none shadow-sm">
        <span className="text-xl font-extrabold italic text-white tracking-tight">
          Sync
        </span>
        <span className="text-[9px] font-semibold text-white/95 tracking-wide -mt-0.5">
          Electric System
        </span>
      </span>
    </Link>
  );
}
