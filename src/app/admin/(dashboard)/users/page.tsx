import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdminAccess, isSuperAdmin } from "@/lib/admin-permissions";
import { toggleAdminActive, deleteAdminUser } from "./actions";

export default async function AdminUsersPage() {
  const admin = await getCurrentAdminAccess();
  if (!admin || !isSuperAdmin(admin)) redirect("/admin");

  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">จัดการผู้ใช้ Admin</h1>
          <p className="text-sm text-neutral-500">
            เฉพาะ Super Admin เท่านั้นที่เห็นหน้านี้และกำหนดสิทธิ์การเข้าถึงได้
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + เพิ่มผู้ใช้
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">ชื่อ</th>
              <th className="px-4 py-3">อีเมล</th>
              <th className="px-4 py-3">บทบาท</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((u) => {
              const isMe = u.id === admin.id;
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {u.name}
                    {isMe && <span className="ml-1 text-xs text-neutral-400">(คุณ)</span>}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.role === "super_admin" ? (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                        Super Admin
                      </span>
                    ) : (
                      <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-600">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.active ? (
                      <span className="text-brand-dark">● ใช้งานอยู่</span>
                    ) : (
                      <span className="text-neutral-400">○ ปิดใช้งาน</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/users/${u.id}/edit`} className="text-brand-dark hover:underline">
                        แก้ไข
                      </Link>
                      {!isMe && (
                        <>
                          <form
                            action={async () => {
                              "use server";
                              await toggleAdminActive(u.id);
                            }}
                          >
                            <button type="submit" className="text-amber-600 hover:underline">
                              {u.active ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                            </button>
                          </form>
                          <form
                            action={async () => {
                              "use server";
                              await deleteAdminUser(u.id);
                            }}
                          >
                            <button type="submit" className="text-red-500 hover:underline">
                              ลบ
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
