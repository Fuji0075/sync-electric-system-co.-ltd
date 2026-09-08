import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BrandForm from "../../BrandForm";
import { updateBrand } from "../../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

type Params = Promise<{ id: string }>;

export default async function EditBrandPage({ params }: { params: Params }) {
  await requireModuleAccess("brands");
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--admin-text)]">แก้ไขแบรนด์</h1>
      <BrandForm action={updateBrand.bind(null, id)} defaultValues={brand} />
    </div>
  );
}
