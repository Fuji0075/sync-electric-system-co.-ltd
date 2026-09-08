import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

type SearchParams = Promise<{ series?: string; categoryId?: string }>;

export default async function NewProductPage({ searchParams }: { searchParams: SearchParams }) {
  await requireModuleAccess("products");
  const { series, categoryId } = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--admin-text)]">เพิ่มสินค้า</h1>
      <ProductForm
        action={createProduct}
        categories={categories}
        defaultValues={
          series || categoryId
            ? {
                name: "",
                summary: "",
                description: "",
                imageUrl: null,
                galleryImages: null,
                brand: null,
                series: series ?? null,
                sku: null,
                price: null,
                specs: null,
                highlights: null,
                categoryId: categoryId ?? "",
                inStock: true,
                featured: false,
              }
            : undefined
        }
      />
    </div>
  );
}
