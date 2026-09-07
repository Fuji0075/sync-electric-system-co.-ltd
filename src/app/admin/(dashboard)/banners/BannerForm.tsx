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
    <form action={action} className="max-w-xl space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">หัวข้อ *</label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">คำอธิบายย่อย</label>
        <input
          name="subtitle"
          defaultValue={defaultValues?.subtitle ?? ""}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">ลิงก์รูปภาพ (URL) *</label>
        <input
          name="imageUrl"
          required
          defaultValue={defaultValues?.imageUrl}
          placeholder="/banners/banner-1.svg"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">ลิงก์เมื่อคลิก</label>
        <input
          name="linkUrl"
          defaultValue={defaultValues?.linkUrl ?? ""}
          placeholder="/products"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">ลำดับการแสดงผล</label>
        <input
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaultValues?.active ?? true}
          className="h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand"
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
