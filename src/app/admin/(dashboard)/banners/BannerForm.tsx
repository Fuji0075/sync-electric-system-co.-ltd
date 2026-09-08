type BannerFormProps = {
  action: (formData: FormData) => void;
  defaultValues?: {
    title: string;
    subtitle: string | null;
    imageUrl: string;
    linkUrl: string | null;
    order: number;
    active: boolean;
  };
};

export default function BannerForm({ action, defaultValues }: BannerFormProps) {
  return (
    <form action={action} className="max-w-xl space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">หัวข้อ *</label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">คำอธิบายย่อย</label>
        <input
          name="subtitle"
          defaultValue={defaultValues?.subtitle ?? ""}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ลิงก์รูปภาพ (URL) *</label>
        <input
          name="imageUrl"
          required
          defaultValue={defaultValues?.imageUrl}
          placeholder="/banners/banner-1.svg"
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ลิงก์เมื่อคลิก</label>
        <input
          name="linkUrl"
          defaultValue={defaultValues?.linkUrl ?? ""}
          placeholder="/products"
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
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
