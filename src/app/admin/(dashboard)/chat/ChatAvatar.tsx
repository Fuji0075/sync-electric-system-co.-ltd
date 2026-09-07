import { avatarColorClass, initials } from "@/lib/chat-avatar";

export default function ChatAvatar({
  name,
  online,
  size = "md",
}: {
  name: string;
  online?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims = size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-11 w-11 text-sm" : "h-10 w-10 text-xs";
  return (
    <div className="relative shrink-0">
      <div
        className={`grid place-items-center rounded-full font-bold text-white ${avatarColorClass(name)} ${dims}`}
      >
        {initials(name)}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
            online ? "bg-emerald-500" : "bg-neutral-300"
          }`}
        />
      )}
    </div>
  );
}
