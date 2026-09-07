import CategoryForm from "../CategoryForm";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">เพิ่มหมวดหมู่สินค้า</h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
