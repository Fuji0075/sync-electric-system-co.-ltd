import { getSiteSettings } from "@/lib/settings";
import { updateSettings } from "./actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

const FIELDS: { key: string; label: string; textarea?: boolean }[] = [
  { key: "company_name_th", label: "ชื่อบริษัท (ไทย)" },
  { key: "company_name_en", label: "ชื่อบริษัท (อังกฤษ)" },
  { key: "address_th", label: "ที่อยู่ (ไทย)", textarea: true },
  { key: "address_en", label: "ที่อยู่ (อังกฤษ)", textarea: true },
  { key: "phone", label: "เบอร์โทรศัพท์" },
  { key: "fax", label: "แฟกซ์" },
  { key: "mobile", label: "เบอร์มือถือ" },
  { key: "email", label: "อีเมล" },
  { key: "line_id", label: "Line ID" },
  { key: "facebook", label: "Facebook" },
  { key: "sales_email", label: "อีเมลทีมขาย (รับแจ้งใบเสนอราคา)" },
];

export default async function AdminSettingsPage() {
  await requireModuleAccess("settings");
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--admin-text)]">ตั้งค่าเว็บไซต์</h1>

      <div className="mb-4 max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
        💡 การส่งอีเมลแจ้งใบเสนอราคาไปยัง &ldquo;อีเมลทีมขาย&rdquo; ด้านล่าง ต้องตั้งค่า SMTP
        (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) ในไฟล์ .env ก่อน มิเช่นนั้นระบบจะบันทึกคำขอไว้ในเว็บ
        แต่ยังไม่ส่งอีเมลจริง (ดูสถานะได้ที่หน้า &ldquo;ใบเสนอราคา&rdquo;)
      </div>

      <form action={updateSettings} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6">
        {FIELDS.map((f) =>
          f.textarea ? (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">{f.label}</label>
              <textarea
                name={f.key}
                defaultValue={settings[f.key] ?? ""}
                rows={2}
                className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
              />
            </div>
          ) : (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">{f.label}</label>
              <input
                name={f.key}
                defaultValue={settings[f.key] ?? ""}
                className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
              />
            </div>
          )
        )}
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-[var(--admin-text)] hover:bg-brand-dark"
        >
          บันทึกการตั้งค่า
        </button>
      </form>
    </div>
  );
}
