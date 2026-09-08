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
      <h1 className="mb-6 text-xl font-bold text-white">แก้ไขผู้ใช้ Admin</h1>

      <form action={action} className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-[#15151b] p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">อีเมล</label>
          <input
            disabled
            value={target.email}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">ชื่อ-นามสกุล *</label>
          <input
            name="name"
            required
            defaultValue={target.name}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">เบอร์โทร</label>
          <input
            name="phone"
            defaultValue={target.phone ?? ""}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">บทบาท</label>
          {isSelf ? (
            <>
              {/* Disabled selects don't submit a value — use a hidden field
                  so this never silently demotes the account on save. */}
              <select
                disabled
                defaultValue={target.role}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-zinc-500"
              >
                <option value="admin">Admin (กำหนดสิทธิ์เอง)</option>
                <option value="super_admin">Super Admin (เข้าถึงได้ทุกส่วน)</option>
              </select>
              <input type="hidden" name="role" value={target.role} />
              <p className="mt-1 text-xs text-zinc-600">
                ไม่สามารถเปลี่ยนบทบาทของตัวเองได้ ให้ Super Admin คนอื่นเปลี่ยนแทน
              </p>
            </>
          ) : (
            <select
              name="role"
              defaultValue={target.role}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
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
