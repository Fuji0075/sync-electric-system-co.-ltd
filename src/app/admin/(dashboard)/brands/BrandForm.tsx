import ImageUploadField from "@/components/admin/ImageUploadField";

type BrandFormProps = {
  action: (formData: FormData) => void;
  defaultValues?: {
    name: string;
    description: string;
    imageUrl: string | null;
    order: number;
    active: boolean;
  };
};

export default function BrandForm({ action, defaultValues }: BrandFormProps) {
  return (
    <form
      action={action}
      className="max-w-xl space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ชื่อแบรนด์ *</label>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          placeholder="เช่น FAG"
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">คำอธิบายแบรนด์ *</label>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={defaultValues?.description}
          placeholder="เช่น มอเตอร์ไฟฟ้า 3 เฟส / โครงเหล็ก IP55"
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
      <ImageUploadField
        name="imageUrl"
        label="รูปภาพแบรนด์"
        defaultValue={defaultValues?.imageUrl ?? ""}
        placeholder="/uploads/brand-fag.png หรือเลือกไฟล์จากเครื่อง"
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ลำดับการแสดงผล</label>
        <input
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-[var(--admin-text-secondary)]">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaultValues?.active ?? true}
          className="h-4 w-4 rounded border-[var(--admin-border-input)] bg-[var(--admin-surface-soft)] text-brand focus:ring-brand"
        />
        แสดงผลบนหน้าเว็บไซต์
      </label>
      <button
        type="submit"
        className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-[var(--admin-text)] hover:bg-brand-dark"
      >
        บันทึก
      </button>
    </form>
  );
}
