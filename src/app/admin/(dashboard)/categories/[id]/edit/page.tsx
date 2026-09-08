import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "../../CategoryForm";
import { updateCategory } from "../../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

type Params = Promise<{ id: string }>;

export default async function EditCategoryPage({ params }: { params: Params }) {
  await requireModuleAccess("categories");
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  const action = updateCategory.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">แก้ไขหมวดหมู่สินค้า</h1>
      <CategoryForm action={action} defaultValues={category} />
    </div>
  );
}
