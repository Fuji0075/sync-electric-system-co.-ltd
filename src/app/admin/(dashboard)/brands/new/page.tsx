import BrandForm from "../BrandForm";
import { createBrand } from "../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function NewBrandPage() {
  await requireModuleAccess("brands");
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--admin-text)]">เพิ่มแบรนด์</h1>
      <BrandForm action={createBrand} />
    </div>
  );
}
