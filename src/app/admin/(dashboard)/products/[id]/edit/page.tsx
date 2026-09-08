import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "../../ProductForm";
import { updateProduct } from "../../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  await requireModuleAccess("products");
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!product) notFound();

  const action = updateProduct.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--admin-text)]">แก้ไขสินค้า</h1>
        {product.series && (
          <Link
            href={`/admin/products/new?series=${encodeURIComponent(product.series)}&categoryId=${product.categoryId}`}
            className="rounded-full border border-[var(--admin-border-strong)] px-4 py-2 text-xs font-semibold text-[var(--admin-text-secondary)] hover:border-brand hover:text-brand"
          >
            + เพิ่มรุ่น/แบรนด์อื่นในซีรีส์ &ldquo;{product.series}&rdquo;
          </Link>
        )}
      </div>
      <ProductForm action={action} categories={categories} defaultValues={product} />
    </div>
  );
}
