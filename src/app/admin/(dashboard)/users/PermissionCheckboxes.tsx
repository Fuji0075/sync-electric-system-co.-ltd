import { MODULES, type ModuleKey } from "@/lib/admin-modules";

export default function PermissionCheckboxes({
  selected,
}: {
  selected: ModuleKey[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--admin-text-secondary)]">
        สิทธิ์การเข้าถึง (ไม่มีผลถ้าตั้งเป็น Super Admin — Super Admin เข้าถึงได้ทุกส่วนเสมอ)
      </label>
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-[var(--admin-border)] p-3 sm:grid-cols-3">
        {MODULES.map((m) => (
          <label key={m.key} className="flex items-center gap-2 text-sm text-[var(--admin-text-secondary)]">
            <input
              type="checkbox"
              name={`perm_${m.key}`}
              defaultChecked={selected.includes(m.key)}
              className="h-4 w-4 rounded border-[var(--admin-border-input)] bg-[var(--admin-surface-soft)] text-brand focus:ring-brand"
            />
            {m.label}
          </label>
        ))}
      </div>
    </div>
  );
}
