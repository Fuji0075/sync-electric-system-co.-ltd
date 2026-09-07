import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "../../CategoryForm";
import { updateCategory } from "../../actions";

type Params = Promise<{ id: string }>;

export default async function EditCategoryPage({ params }: { params: Params }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  const action = updateCategory.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">แก้ไขหมวดหมู่สินค้า</h1>
      <CategoryForm action={action} defaultValues={category} />
    </div>
  );
}
