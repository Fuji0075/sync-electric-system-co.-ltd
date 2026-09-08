import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BannerForm from "../../BannerForm";
import { updateBanner } from "../../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

type Params = Promise<{ id: string }>;

export default async function EditBannerPage({ params }: { params: Params }) {
  await requireModuleAccess("banners");
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) notFound();

  const action = updateBanner.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--admin-text)]">แก้ไขแบนเนอร์</h1>
      <BannerForm action={action} defaultValues={banner} />
    </div>
  );
}
