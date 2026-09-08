type ArticleFormProps = {
  action: (formData: FormData) => void;
  defaultValues?: {
    title: string;
    slug?: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    published: boolean;
  };
  showSlug?: boolean;
};

export default function ArticleForm({ action, defaultValues, showSlug }: ArticleFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">หัวข้อบทความ *</label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
      {showSlug && (
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
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">คำโปรย *</label>
        <input
          name="excerpt"
          required
          defaultValue={defaultValues?.excerpt}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">เนื้อหา *</label>
        <textarea
          name="content"
          required
          rows={8}
          defaultValue={defaultValues?.content}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-[var(--admin-text-secondary)]">
        <input
          type="checkbox"
          name="published"
          defaultChecked={defaultValues?.published ?? true}
          className="h-4 w-4 rounded border-[var(--admin-border-input)] bg-[var(--admin-surface-soft)] text-brand focus:ring-brand"
        />
        เผยแพร่บนเว็บไซต์
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
