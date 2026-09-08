import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdminAccess, isSuperAdmin } from "@/lib/admin-permissions";
import { ACTIVITY_LABELS } from "@/lib/activity-log";

const ACTION_BADGE: Record<string, string> = {
  login: "bg-white/10 text-zinc-400",
  reply_chat: "bg-sky-100 text-sky-700",
  close_chat: "bg-white/10 text-zinc-400",
  create_quote: "bg-brand/10 text-emerald-400",
  claim_quote: "bg-amber-100 text-amber-700",
  edit_quote: "bg-white/10 text-zinc-400",
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
        <h1 className="text-xl font-bold text-white">ประวัติการทำงานของผู้ใช้ Admin</h1>
        <p className="text-sm text-zinc-500">
          ดูว่าแอดมินคนไหนตอบแชท สร้าง/ส่งใบเสนอราคา หรือทำรายการใดในระบบบ้าง (แสดงล่าสุด 200 รายการ)
        </p>
      </div>

      <form className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[#15151b] p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">ผู้ใช้</label>
          <select
            name="admin"
            defaultValue={adminFilter ?? ""}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
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
          <label className="mb-1 block text-xs font-medium text-zinc-500">ประเภทการกระทำ</label>
          <select
            name="action"
            defaultValue={actionFilter ?? ""}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
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
          className="mt-4 rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          กรอง
        </button>
        {(adminFilter || actionFilter) && (
          <Link href="/admin/logs" className="mt-4 text-sm text-zinc-500 hover:underline">
            ล้างตัวกรอง
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#15151b]">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">เวลา</th>
              <th className="px-4 py-3">ผู้ใช้</th>
              <th className="px-4 py-3">การกระทำ</th>
              <th className="px-4 py-3">รายละเอียด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                  {formatDateTime(log.createdAt)}
                </td>
                <td className="px-4 py-3 font-medium text-white">{log.adminName}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      ACTION_BADGE[log.action] ?? "bg-white/10 text-zinc-400"
                    }`}
                  >
                    {ACTIVITY_LABELS[log.action] ?? log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400">{log.description}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-sm text-zinc-600">
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
