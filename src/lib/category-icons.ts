export const CATEGORY_ICONS: Record<string, string> = {
  "induction-motor": "⚙️",
  "gear-motor": "🔩",
  inverter: "🎛️",
  brake: "🛑",
  "water-pump": "💧",
  resistor: "🔌",
};

export function categoryIcon(slug: string) {
  return CATEGORY_ICONS[slug] ?? "⚡";
}
