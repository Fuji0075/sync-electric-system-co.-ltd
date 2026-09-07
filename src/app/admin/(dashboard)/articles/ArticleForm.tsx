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
    <form action={action} className="max-w-2xl space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">หัวข้อบทความ *</label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      {showSlug && (
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Slug (เว้นว่างให้สร้างอัตโนมัติ)
          </label>
          <input
            name="slug"
            defaultValue={defaultValues?.slug}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">คำโปรย *</label>
        <input
          name="excerpt"
          required
          defaultValue={defaultValues?.excerpt}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">เนื้อหา *</label>
        <textarea
          name="content"
          required
          rows={8}
          defaultValue={defaultValues?.content}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="published"
          defaultChecked={defaultValues?.published ?? true}
          className="h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand"
        />
        เผยแพร่บนเว็บไซต์
      </label>
      <button
        type="submit"
        className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
      >
        บันทึก
      </button>
    </form>
  );
}
