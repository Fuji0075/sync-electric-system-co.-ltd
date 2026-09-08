import { prisma } from "@/lib/prisma";
import { createCategoryGroup, deleteCategoryGroup, updateCategoryGroup } from "./actions";
import { requireModuleAccess } from "@/lib/admin-permissions";
import EditGroupModal from "./EditGroupModal";

export default async function AdminCategoryGroupsPage() {
  await requireModuleAccess("categories");
  const groups = await prisma.categoryGroup.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { categories: true } } },
  });

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-[var(--admin-text)]">หมวดหมู่หลัก</h1>
      <p className="mb-6 text-sm text-[var(--admin-text-faint)]">
        ใช้จัดกลุ่มหมวดหมู่สินค้าย่อยในแถบข้างหน้าสินค้าทั้งหมด (เช่น &ldquo;มอเตอร์และเกียร์&rdquo; ครอบ &ldquo;มอเตอร์ไฟฟ้า&rdquo;
        และ &ldquo;มอเตอร์เกียร์&rdquo;) — กำหนดหมวดหมู่หลักของแต่ละหมวดย่อยได้ที่หน้า{" "}
        <a href="/admin/categories" className="text-brand-dark hover:underline">
          หมวดหมู่สินค้า
        </a>
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          action={createCategoryGroup}
          className="h-fit space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6"
        >
          <h2 className="font-semibold text-[var(--admin-text)]">เพิ่มหมวดหมู่หลัก</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ชื่อหมวดหมู่หลัก *</label>
            <input
              name="name"
              required
              placeholder="เช่น มอเตอร์และเกียร์"
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">
              Slug (เว้นว่างให้สร้างอัตโนมัติ)
            </label>
            <input
              name="slug"
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--admin-text-secondary)]">ลำดับการแสดงผล</label>
            <input
              name="order"
              type="number"
              defaultValue={groups.length}
              className="w-full rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-[var(--admin-text)] hover:bg-brand-dark"
          >
            เพิ่มหมวดหมู่หลัก
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
          <ul className="divide-y divide-[var(--admin-border)]">
            {groups.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <div className="font-medium text-[var(--admin-text)]">{g.name}</div>
                  <div className="text-xs text-[var(--admin-text-faint)]">
                    {g._count.categories} หมวดหมู่ย่อย · ลำดับ {g.order}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <EditGroupModal group={g} action={updateCategoryGroup.bind(null, g.id)} />
                  <form
                    action={async () => {
                      "use server";
                      await deleteCategoryGroup(g.id);
                    }}
                  >
                    <button type="submit" className="text-sm text-red-500 hover:underline">
                      ลบ
                    </button>
                  </form>
                </div>
              </li>
            ))}
            {groups.length === 0 && (
              <li className="p-8 text-center text-sm text-[var(--admin-text-faint2)]">ยังไม่มีหมวดหมู่หลัก</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
