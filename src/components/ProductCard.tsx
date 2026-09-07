import Link from "next/link";
import { categoryIcon } from "@/lib/category-icons";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    summary: string;
    imageUrl?: string | null;
    price?: number | null;
    inStock: boolean;
    category: { name: string; slug: string };
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-lg"
    >
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-brand/10 to-accent/5">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, #0f6b2e 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl shadow-sm transition group-hover:scale-110">
          {categoryIcon(product.category.slug)}
        </span>
        {product.inStock && (
          <span className="absolute right-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            พร้อมส่ง
          </span>
        )}
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
          {product.price ? (
            <span className="text-sm font-extrabold text-brand-dark">
              ฿{product.price.toLocaleString("th-TH")}
            </span>
          ) : (
            <span
              className={`text-[11px] font-semibold ${
                product.inStock ? "text-brand-dark" : "text-neutral-400"
              }`}
            >
              {product.inStock ? "● มีสินค้าพร้อมส่ง" : "○ สอบถามสต๊อค"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
