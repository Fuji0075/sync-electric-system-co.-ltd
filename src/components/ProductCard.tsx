import Link from "next/link";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    summary: string;
    imageUrl?: string | null;
    inStock: boolean;
    category: { name: string };
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-md"
    >
      <div className="flex h-36 items-center justify-center bg-neutral-100 text-4xl">
        ⚙️
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-dark">
          {product.category.name}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-neutral-900 group-hover:text-brand-dark">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{product.summary}</p>
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`text-[11px] font-semibold ${
              product.inStock ? "text-brand-dark" : "text-neutral-400"
            }`}
          >
            {product.inStock ? "● มีสินค้าพร้อมส่ง" : "○ สอบถามสต๊อค"}
          </span>
        </div>
      </div>
    </Link>
  );
}
