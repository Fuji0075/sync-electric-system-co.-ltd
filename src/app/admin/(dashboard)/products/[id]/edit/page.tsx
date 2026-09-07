import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "../../ProductForm";
import { updateProduct } from "../../actions";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!product) notFound();

  const action = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">แก้ไขสินค้า</h1>
      <ProductForm action={action} categories={categories} defaultValues={product} />
    </div>
  );
}
