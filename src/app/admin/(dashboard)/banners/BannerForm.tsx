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
    <form action={action} className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-[#15151b] p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">หัวข้อ *</label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">คำอธิบายย่อย</label>
        <input
          name="subtitle"
          defaultValue={defaultValues?.subtitle ?? ""}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">ลิงก์รูปภาพ (URL) *</label>
        <input
          name="imageUrl"
          required
          defaultValue={defaultValues?.imageUrl}
          placeholder="/banners/banner-1.svg"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">ลิงก์เมื่อคลิก</label>
        <input
          name="linkUrl"
          defaultValue={defaultValues?.linkUrl ?? ""}
          placeholder="/products"
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
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaultValues?.active ?? true}
          className="h-4 w-4 rounded border-white/20 bg-white/5 text-brand focus:ring-brand"
        />
        แสดงผลบนหน้าเว็บไซต์
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
