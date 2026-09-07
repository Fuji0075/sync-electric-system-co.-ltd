const AVATAR_COLORS = [
  "bg-brand",
  "bg-accent",
  "bg-amber-500",
  "bg-sky-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-indigo-500",
];

function hashString(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function avatarColorClass(seed: string) {
  return AVATAR_COLORS[hashString(seed) % AVATAR_COLORS.length];
}

export function initials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}
