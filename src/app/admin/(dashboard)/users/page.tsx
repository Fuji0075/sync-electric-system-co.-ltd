import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdminAccess, isSuperAdmin } from "@/lib/admin-permissions";
import { toggleAdminActive, deleteAdminUser } from "./actions";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(d);
}

export default async function AdminUsersPage() {
  const admin = await getCurrentAdminAccess();
  if (!admin || !isSuperAdmin(admin)) redirect("/admin");

  const [adminUsers, customers] = await Promise.all([
    prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { conversations: true, quoteRequests: true } } },
    }),
  ]);

  const superAdmins = adminUsers.filter((u) => u.role === "super_admin");
  const staff = adminUsers.filter((u) => u.role !== "super_admin");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--admin-text)]">ผู้ใช้งานทั้งหมดในระบบ</h1>
          <p className="text-sm text-[var(--admin-text-faint)]">
            รวมข้อมูล Super Admin, พนักงานฝ่ายหลังบ้าน และสมาชิกลูกค้าจากทุกตารางในฐานข้อมูล
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-[var(--admin-text)] hover:bg-brand-dark"
        >
          + เพิ่มผู้ใช้ Admin
        </Link>
      </div>

      {/* summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Super Admin</p>
          <p className="mt-1 text-3xl font-bold text-amber-800">{superAdmins.length}</p>
          <p className="mt-1 text-xs text-amber-700">ผู้ดูแลระบบสูงสุด กำหนดสิทธิ์ได้ทั้งหมด</p>
        </div>
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-faint)]">พนักงาน / Admin</p>
          <p className="mt-1 text-3xl font-bold text-[var(--admin-text)]">{staff.length}</p>
          <p className="mt-1 text-xs text-[var(--admin-text-faint)]">เจ้าหน้าที่หลังบ้านตามสิทธิ์ที่ได้รับ</p>
        </div>
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">สมาชิกลูกค้า</p>
          <p className="mt-1 text-3xl font-bold text-emerald-400">{customers.length}</p>
          <p className="mt-1 text-xs text-emerald-400">ลูกค้าที่สมัครสมาชิกผ่านหน้าเว็บไซต์</p>
        </div>
      </div>

      {/* Super Admin */}
      <Section title="ฝ่าย Super Admin" badgeClass="bg-amber-100 text-amber-700" count={superAdmins.length}>
        <AdminTable users={superAdmins} currentAdminId={admin.id} />
      </Section>

      {/* Staff / Admin */}
      <Section title="ฝ่ายพนักงาน (Admin)" badgeClass="bg-[var(--admin-surface-softer)] text-[var(--admin-text-muted)]" count={staff.length}>
        <AdminTable users={staff} currentAdminId={admin.id} />
      </Section>

      {/* Customers */}
      <Section title="ฝ่ายสมาชิกลูกค้า (หน้าเว็บไซต์)" badgeClass="bg-brand/10 text-emerald-400" count={customers.length}>
        {customers.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-[var(--admin-text-faint2)]">ยังไม่มีลูกค้าสมัครสมาชิก</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[var(--admin-surface-soft)] text-left text-xs uppercase text-[var(--admin-text-faint)]">
              <tr>
                <th className="px-4 py-3">ชื่อ</th>
                <th className="px-4 py-3">อีเมล</th>
                <th className="px-4 py-3">เบอร์โทร</th>
                <th className="px-4 py-3">สมัครเมื่อ</th>
                <th className="px-4 py-3 text-right">การใช้งาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-[var(--admin-text)]">{c.name}</td>
                  <td className="px-4 py-3 text-[var(--admin-text-faint)]">{c.email}</td>
                  <td className="px-4 py-3 text-[var(--admin-text-faint)]">{c.phone || "-"}</td>
                  <td className="px-4 py-3 text-[var(--admin-text-faint)]">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3 text-right text-xs text-[var(--admin-text-faint)]">
                    {c._count.conversations} แชท · {c._count.quoteRequests} คำขอใบเสนอราคา
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  badgeClass,
  count,
  children,
}: {
  title: string;
  badgeClass: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-bold text-[var(--admin-text)]">{title}</h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>{count} คน</span>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">{children}</div>
    </div>
  );
}

function AdminTable({
  users,
  currentAdminId,
}: {
  users: Awaited<ReturnType<typeof prisma.adminUser.findMany>>;
  currentAdminId: string;
}) {
  if (users.length === 0) {
    return <p className="px-4 py-6 text-center text-sm text-[var(--admin-text-faint2)]">ไม่มีผู้ใช้ในกลุ่มนี้</p>;
  }
  return (
    <table className="w-full text-sm">
      <thead className="bg-[var(--admin-surface-soft)] text-left text-xs uppercase text-[var(--admin-text-faint)]">
        <tr>
          <th className="px-4 py-3">ชื่อ</th>
          <th className="px-4 py-3">อีเมล</th>
          <th className="px-4 py-3">เบอร์โทร</th>
          <th className="px-4 py-3">สถานะ</th>
          <th className="px-4 py-3 text-right">จัดการ</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[var(--admin-border)]">
        {users.map((u) => {
          const isMe = u.id === currentAdminId;
          return (
            <tr key={u.id}>
              <td className="px-4 py-3 font-medium text-[var(--admin-text)]">
                {u.name}
                {isMe && <span className="ml-1 text-xs text-[var(--admin-text-faint2)]">(คุณ)</span>}
              </td>
              <td className="px-4 py-3 text-[var(--admin-text-faint)]">{u.email}</td>
              <td className="px-4 py-3 text-[var(--admin-text-faint)]">{u.phone || "-"}</td>
              <td className="px-4 py-3">
                {u.active ? (
                  <span className="text-emerald-400">● ใช้งานอยู่</span>
                ) : (
                  <span className="text-[var(--admin-text-faint2)]">○ ปิดใช้งาน</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">
                  <Link href={`/admin/users/${u.id}/edit`} className="text-emerald-400 hover:underline">
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
  );
}
