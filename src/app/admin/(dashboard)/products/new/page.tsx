import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function NewProductPage() {
  await requireModuleAccess("products");
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--admin-text)]">เพิ่มสินค้า</h1>
      <ProductForm action={createProduct} categories={categories} />
    </div>
  );
}
