import BannerForm from "../BannerForm";
import { createBanner } from "../actions";

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">เพิ่มแบนเนอร์</h1>
      <BannerForm action={createBanner} />
    </div>
  );
}
