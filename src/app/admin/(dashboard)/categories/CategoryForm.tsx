type CategoryFormProps = {
  action: (formData: FormData) => void;
  defaultValues?: { name: string; slug: string; order: number };
};

export default function CategoryForm({ action, defaultValues }: CategoryFormProps) {
  return (
    <form action={action} className="max-w-lg space-y-4 rounded-2xl border border-white/10 bg-[#15151b] p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">ชื่อหมวดหมู่ *</label>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          Slug (เว้นว่างให้สร้างอัตโนมัติ)
        </label>
        <input
          name="slug"
          defaultValue={defaultValues?.slug}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">ลำดับการแสดงผล</label>
        <input
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
      >
        บันทึก
      </button>
    </form>
  );
}
