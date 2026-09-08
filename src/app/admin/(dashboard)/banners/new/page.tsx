import BannerForm from "../BannerForm";
import { createBanner } from "../actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function NewBannerPage() {
  await requireModuleAccess("banners");
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-white">เพิ่มแบนเนอร์</h1>
      <BannerForm action={createBanner} />
    </div>
  );
}
