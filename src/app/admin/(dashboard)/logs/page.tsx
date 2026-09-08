import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdminAccess, isSuperAdmin } from "@/lib/admin-permissions";
import { ACTIVITY_LABELS } from "@/lib/activity-log";

const ACTION_BADGE: Record<string, string> = {
  login: "bg-[var(--admin-surface-softer)] text-[var(--admin-text-muted)]",
  reply_chat: "bg-sky-100 text-sky-700",
  close_chat: "bg-[var(--admin-surface-softer)] text-[var(--admin-text-muted)]",
  create_quote: "bg-brand/10 text-emerald-400",
  claim_quote: "bg-amber-100 text-amber-700",
  edit_quote: "bg-[var(--admin-surface-softer)] text-[var(--admin-text-muted)]",
  send_quote: "bg-emerald-100 text-emerald-700",
  approve_quote: "bg-purple-100 text-purple-700",
};

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

type SearchParams = Promise<{ admin?: string; action?: string }>;

export default async function ActivityLogsPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await getCurrentAdminAccess();
  if (!admin || !isSuperAdmin(admin)) redirect("/admin");

  const { admin: adminFilter, action: actionFilter } = await searchParams;

  const [logs, adminUsers] = await Promise.all([
    prisma.activityLog.findMany({
      where: {
        ...(adminFilter ? { adminId: adminFilter } : {}),
        ...(actionFilter ? { action: actionFilter } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.adminUser.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[var(--admin-text)]">ประวัติการทำงานของผู้ใช้ Admin</h1>
        <p className="text-sm text-[var(--admin-text-faint)]">
          ดูว่าแอดมินคนไหนตอบแชท สร้าง/ส่งใบเสนอราคา หรือทำรายการใดในระบบบ้าง (แสดงล่าสุด 200 รายการ)
        </p>
      </div>

      <form className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--admin-text-faint)]">ผู้ใช้</label>
          <select
            name="admin"
            defaultValue={adminFilter ?? ""}
            className="rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-1.5 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
          >
            <option value="">ทั้งหมด</option>
            {adminUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--admin-text-faint)]">ประเภทการกระทำ</label>
          <select
            name="action"
            defaultValue={actionFilter ?? ""}
            className="rounded-lg border border-[var(--admin-border-strong)] bg-[var(--admin-surface-soft)] px-3 py-1.5 text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)] focus:border-brand"
          >
            <option value="">ทั้งหมด</option>
            {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-[var(--admin-text)] hover:bg-brand-dark"
        >
          กรอง
        </button>
        {(adminFilter || actionFilter) && (
          <Link href="/admin/logs" className="mt-4 text-sm text-[var(--admin-text-faint)] hover:underline">
            ล้างตัวกรอง
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--admin-surface-soft)] text-left text-xs uppercase text-[var(--admin-text-faint)]">
            <tr>
              <th className="px-4 py-3">เวลา</th>
              <th className="px-4 py-3">ผู้ใช้</th>
              <th className="px-4 py-3">การกระทำ</th>
              <th className="px-4 py-3">รายละเอียด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--admin-text-faint)]">
                  {formatDateTime(log.createdAt)}
                </td>
                <td className="px-4 py-3 font-medium text-[var(--admin-text)]">{log.adminName}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      ACTION_BADGE[log.action] ?? "bg-[var(--admin-surface-softer)] text-[var(--admin-text-muted)]"
                    }`}
                  >
                    {ACTIVITY_LABELS[log.action] ?? log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--admin-text-muted)]">{log.description}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-sm text-[var(--admin-text-faint2)]">
                  ยังไม่มีประวัติการทำงาน
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
