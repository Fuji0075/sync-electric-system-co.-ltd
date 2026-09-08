type CategoryFormProps = {
  action: (formData: FormData) => void;
  defaultValues?: { name: string; slug: string; order: number };
};

export default function CategoryForm({ action, defaultValues }: CategoryFormProps) {
  return (
    <form action={action} className="max-w-lg space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ชื่อหมวดหมู่ *</label>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">
          Slug (เว้นว่างให้สร้างอัตโนมัติ)
        </label>
        <input
          name="slug"
          defaultValue={defaultValues?.slug}
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
      <button
        type="submit"
        className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-[var(--admin-text)] hover:bg-brand-dark"
      >
        บันทึก
      </button>
    </form>
  );
}
