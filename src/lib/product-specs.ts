export type ProductSpec = { label: string; value: string };

export function parseSpecs(raw: string | null): ProductSpec[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s): s is ProductSpec => Boolean(s && typeof s.label === "string" && typeof s.value === "string"))
      .filter((s) => s.label.trim() && s.value.trim());
  } catch {
    return [];
  }
}

export function parseStringList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string" && s.trim().length > 0);
  } catch {
    return [];
  }
}
