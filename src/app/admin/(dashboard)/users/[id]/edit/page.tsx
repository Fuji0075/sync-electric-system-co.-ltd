import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdminAccess, isSuperAdmin, parsePermissions } from "@/lib/admin-permissions";
import { updateAdminUser } from "../../actions";
import PermissionCheckboxes from "../../PermissionCheckboxes";

type Params = Promise<{ id: string }>;

export default async function EditAdminUserPage({ params }: { params: Params }) {
  const admin = await getCurrentAdminAccess();
  if (!admin || !isSuperAdmin(admin)) redirect("/admin");

  const { id } = await params;
  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) notFound();

  const action = updateAdminUser.bind(null, id);
  const isSelf = target.id === admin.id;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">แก้ไขผู้ใช้ Admin</h1>

      <form action={action} className="max-w-xl space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">อีเมล</label>
          <input
            disabled
            value={target.email}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">ชื่อ-นามสกุล *</label>
          <input
            name="name"
            required
            defaultValue={target.name}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">เบอร์โทร</label>
          <input
            name="phone"
            defaultValue={target.phone ?? ""}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">บทบาท</label>
          {isSelf ? (
            <>
              {/* Disabled selects don't submit a value — use a hidden field
                  so this never silently demotes the account on save. */}
              <select
                disabled
                defaultValue={target.role}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-400"
              >
                <option value="admin">Admin (กำหนดสิทธิ์เอง)</option>
                <option value="super_admin">Super Admin (เข้าถึงได้ทุกส่วน)</option>
              </select>
              <input type="hidden" name="role" value={target.role} />
              <p className="mt-1 text-xs text-neutral-400">
                ไม่สามารถเปลี่ยนบทบาทของตัวเองได้ ให้ Super Admin คนอื่นเปลี่ยนแทน
              </p>
            </>
          ) : (
            <select
              name="role"
              defaultValue={target.role}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="admin">Admin (กำหนดสิทธิ์เอง)</option>
              <option value="super_admin">Super Admin (เข้าถึงได้ทุกส่วน)</option>
            </select>
          )}
        </div>

        <PermissionCheckboxes selected={parsePermissions(target.permissions)} />

        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          บันทึก
        </button>
      </form>
    </div>
  );
}
