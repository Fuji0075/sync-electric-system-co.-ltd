import { prisma } from "@/lib/prisma";
import CategoryForm from "../CategoryForm";
import { createCategory } from "../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function NewCategoryPage() {
  await requireModuleAccess("categories");
  const groups = await prisma.categoryGroup.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--admin-text)]">เพิ่มหมวดหมู่สินค้า</h1>
      <CategoryForm action={createCategory} groups={groups} />
    </div>
  );
}
