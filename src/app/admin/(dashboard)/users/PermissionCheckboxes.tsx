import { MODULES, type ModuleKey } from "@/lib/admin-modules";

export default function PermissionCheckboxes({
  selected,
}: {
  selected: ModuleKey[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">
        สิทธิ์การเข้าถึง (ไม่มีผลถ้าตั้งเป็น Super Admin — Super Admin เข้าถึงได้ทุกส่วนเสมอ)
      </label>
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-neutral-200 p-3 sm:grid-cols-3">
        {MODULES.map((m) => (
          <label key={m.key} className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              name={`perm_${m.key}`}
              defaultChecked={selected.includes(m.key)}
              className="h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand"
            />
            {m.label}
          </label>
        ))}
      </div>
    </div>
  );
}
