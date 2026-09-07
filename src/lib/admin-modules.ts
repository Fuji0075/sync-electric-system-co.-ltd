// Client-safe: no server-only imports (Prisma, sessions) here. Anything
// that needs the database or cookies belongs in admin-permissions.ts.

export const MODULES = [
  { key: "banners", label: "แบนเนอร์หน้าแรก" },
  { key: "categories", label: "หมวดหมู่สินค้า" },
  { key: "products", label: "สินค้า" },
  { key: "articles", label: "บทความ" },
  { key: "catalog", label: "แค็ตตาล็อก" },
  { key: "messages", label: "ข้อความติดต่อ" },
  { key: "chat", label: "แชทกับลูกค้า" },
  { key: "quotes", label: "คำขอใบเสนอราคา" },
  { key: "quotations", label: "ใบเสนอราคา" },
  { key: "settings", label: "ตั้งค่าเว็บไซต์" },
] as const;

export type ModuleKey = (typeof MODULES)[number]["key"];

export type AdminAccess = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: ModuleKey[];
  active: boolean;
};

export function isSuperAdmin(admin: Pick<AdminAccess, "role">) {
  return admin.role === "super_admin";
}

export function canAccess(admin: AdminAccess, module: ModuleKey): boolean {
  return isSuperAdmin(admin) || admin.permissions.includes(module);
}

export function parsePermissions(raw: string): ModuleKey[] {
  const valid = new Set(MODULES.map((m) => m.key));
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is ModuleKey => valid.has(s as ModuleKey));
}
