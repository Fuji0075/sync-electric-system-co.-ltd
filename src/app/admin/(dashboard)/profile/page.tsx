import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

export default async function AdminProfilePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const admin = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin) redirect("/admin/login");

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-white">โปรไฟล์ของฉัน</h1>
      <p className="mb-6 text-sm text-zinc-500">
        ข้อมูลนี้จะถูกใช้เป็นชื่อพนักงานขายและลายเซ็นในใบเสนอราคาที่คุณสร้างหรือกดรับเรื่องจากแชทลูกค้าโดยอัตโนมัติ
      </p>
      <ProfileForm
        name={admin.name}
        email={admin.email}
        phone={admin.phone}
        signatureUrl={admin.signatureUrl}
      />
    </div>
  );
}
