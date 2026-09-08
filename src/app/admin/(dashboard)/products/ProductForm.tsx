import ImageUploadField from "@/components/admin/ImageUploadField";
import GalleryUploadField from "@/components/admin/GalleryUploadField";
import SpecListField from "@/components/admin/SpecListField";
import StringListField from "@/components/admin/StringListField";
import { parseSpecs, parseStringList } from "@/lib/product-specs";

type Category = { id: string; name: string };

type ProductFormProps = {
  action: (formData: FormData) => void;
  categories: Category[];
  defaultValues?: {
    name: string;
    summary: string;
    description: string;
    imageUrl: string | null;
    galleryImages: string | null;
    brand: string | null;
    series: string | null;
    sku: string | null;
    price: number | null;
    specs: string | null;
    highlights: string | null;
    categoryId: string;
    inStock: boolean;
    featured: boolean;
  };
};

export default function ProductForm({ action, categories, defaultValues }: ProductFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ชื่อสินค้า *</label>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">หมวดหมู่ *</label>
        <select
          name="categoryId"
          required
          defaultValue={defaultValues?.categoryId}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
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
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">คำอธิบายสั้น *</label>
        <input
          name="summary"
          required
          defaultValue={defaultValues?.summary}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">รายละเอียดสินค้า *</label>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={defaultValues?.description}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">แบรนด์</label>
          <input
            name="brand"
            defaultValue={defaultValues?.brand ?? ""}
            className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">รุ่น/ซีรีส์ เช่น GB-Series</label>
          <input
            name="series"
            defaultValue={defaultValues?.series ?? ""}
            className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">รหัสสินค้า (SKU)</label>
          <input
            name="sku"
            defaultValue={defaultValues?.sku ?? ""}
            className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">
          ราคาต่อหน่วย (บาท) — ใช้เป็นราคาตั้งต้นตอนสร้างใบเสนอราคา
        </label>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={defaultValues?.price ?? ""}
          className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
        />
      </div>

      <ImageUploadField
        name="imageUrl"
        label="รูปภาพหลัก"
        defaultValue={defaultValues?.imageUrl ?? ""}
        placeholder="/products/example.jpg หรือเลือกไฟล์จากเครื่อง"
      />

      <GalleryUploadField
        name="galleryImages"
        label="แกลเลอรีรูปภาพเพิ่มเติม"
        defaultValue={parseStringList(defaultValues?.galleryImages ?? null)}
      />

      <SpecListField
        name="specs"
        label="ตารางสเปกสินค้า (Specifications)"
        defaultValue={parseSpecs(defaultValues?.specs ?? null)}
      />

      <StringListField
        name="highlights"
        label="จุดเด่นสินค้า"
        defaultValue={parseStringList(defaultValues?.highlights ?? null)}
        placeholder="เช่น สินค้าคุณภาพมาตรฐานสากล"
      />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-[var(--admin-text-secondary)]">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={defaultValues?.inStock ?? true}
            className="h-4 w-4 rounded border-[var(--admin-border-input)] bg-[var(--admin-surface-soft)] text-brand focus:ring-brand"
          />
          มีสินค้าพร้อมส่ง
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--admin-text-secondary)]">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={defaultValues?.featured ?? false}
            className="h-4 w-4 rounded border-[var(--admin-border-input)] bg-[var(--admin-surface-soft)] text-brand focus:ring-brand"
          />
          แสดงเป็นสินค้าแนะนำหน้าแรก
        </label>
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
