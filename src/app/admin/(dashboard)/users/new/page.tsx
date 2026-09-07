import { redirect } from "next/navigation";
import { getCurrentAdminAccess, isSuperAdmin } from "@/lib/admin-permissions";
import NewUserForm from "./NewUserForm";

export default async function NewAdminUserPage() {
  const admin = await getCurrentAdminAccess();
  if (!admin || !isSuperAdmin(admin)) redirect("/admin");

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">เพิ่มผู้ใช้ Admin</h1>
      <NewUserForm />
    </div>
  );
}
