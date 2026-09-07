import { redirect } from "next/navigation";
import { getCurrentAdminAccess } from "@/lib/admin-permissions";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  // Uses getCurrentAdminAccess (checks the DB, not just the JWT) so a
  // deactivated account's still-valid session cookie doesn't bounce them
  // straight back to /admin, which redirects here again — an infinite loop.
  const admin = await getCurrentAdminAccess();
  if (admin) {
    redirect("/admin");
  }
  return <LoginForm />;
}
