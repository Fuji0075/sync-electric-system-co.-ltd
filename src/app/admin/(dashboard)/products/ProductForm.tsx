type Category = { id: string; name: string };

type ProductFormProps = {
  action: (formData: FormData) => void;
  categories: Category[];
  defaultValues?: {
    name: string;
    summary: string;
    description: string;
    imageUrl: string | null;
    brand: string | null;
    sku: string | null;
    categoryId: string;
    inStock: boolean;
    featured: boolean;
  };
};

export default function ProductForm({ action, categories, defaultValues }: ProductFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">ชื่อสินค้า *</label>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">หมวดหมู่ *</label>
        <select
          name="categoryId"
          required
          defaultValue={defaultValues?.categoryId}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="">เลือกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">คำอธิบายสั้น *</label>
        <input
          name="summary"
          required
          defaultValue={defaultValues?.summary}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">รายละเอียดสินค้า *</label>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={defaultValues?.description}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">แบรนด์</label>
          <input
            name="brand"
            defaultValue={defaultValues?.brand ?? ""}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">รหัสสินค้า (SKU)</label>
          <input
            name="sku"
            defaultValue={defaultValues?.sku ?? ""}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">ลิงก์รูปภาพ (URL)</label>
        <input
          name="imageUrl"
          defaultValue={defaultValues?.imageUrl ?? ""}
          placeholder="/products/example.jpg"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={defaultValues?.inStock ?? true}
            className="h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand"
          />
          มีสินค้าพร้อมส่ง
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={defaultValues?.featured ?? false}
            className="h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand"
          />
          แสดงเป็นสินค้าแนะนำหน้าแรก
        </label>
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
