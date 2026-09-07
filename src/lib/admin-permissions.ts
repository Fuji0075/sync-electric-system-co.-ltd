import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  MODULES,
  isSuperAdmin,
  canAccess,
  parsePermissions,
  type ModuleKey,
  type AdminAccess,
} from "@/lib/admin-modules";

export { MODULES, isSuperAdmin, canAccess, parsePermissions };
export type { ModuleKey, AdminAccess };

/**
 * Looked up live from the database (not the session JWT) so a permission
 * change by the super admin takes effect immediately, without waiting for
 * the affected admin to log out and back in.
 */
export async function getCurrentAdminAccess(): Promise<AdminAccess | null> {
  const session = await getSession();
  if (!session) return null;

  const admin = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin || !admin.active) return null;

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions: parsePermissions(admin.permissions),
    active: admin.active,
  };
}

/**
 * Call at the top of a protected admin page's server component. Redirects
 * to the login page (no session) or the dashboard (logged in but lacking
 * this module's permission) instead of rendering. The (dashboard) layout
 * already redirects unauthenticated visitors, but each page still needs
 * its own module check — the layout can't know which module a given page
 * belongs to.
 */
export async function requireModuleAccess(module: ModuleKey): Promise<AdminAccess> {
  const admin = await getCurrentAdminAccess();
  if (!admin) redirect("/admin/login");
  if (!canAccess(admin, module)) redirect("/admin");
  return admin;
}
