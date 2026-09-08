import { prisma } from "@/lib/prisma";
import { markMessageRead, deleteMessage } from "./actions";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function AdminMessagesPage() {
  await requireModuleAccess("messages");
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[var(--admin-text)]">ข้อความติดต่อจากเว็บไซต์</h1>

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-2xl border p-5 ${
              m.read ? "border-[var(--admin-border)] bg-[var(--admin-surface)]" : "border-brand/30 bg-brand/5"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[var(--admin-text)]">{m.name}</span>
                <span className="ml-2 text-sm text-[var(--admin-text-faint)]">{m.email}</span>
                {m.phone && <span className="ml-2 text-sm text-[var(--admin-text-faint)]">{m.phone}</span>}
              </div>
              <time className="text-xs text-[var(--admin-text-faint2)]">
                {new Date(m.createdAt).toLocaleString("th-TH")}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-[var(--admin-text-secondary)]">{m.message}</p>
            <div className="mt-4 flex gap-3 text-sm">
              {!m.read && (
                <form
                  action={async () => {
                    "use server";
                    await markMessageRead(m.id);
                  }}
                >
                  <button type="submit" className="text-emerald-400 hover:underline">
                    ทำเครื่องหมายว่าอ่านแล้ว
                  </button>
                </form>
              )}
              <form
                action={async () => {
                  "use server";
                  await deleteMessage(m.id);
                }}
              >
                <button type="submit" className="text-red-500 hover:underline">
                  ลบ
                </button>
              </form>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="rounded-xl border border-dashed border-[var(--admin-border-strong)] p-10 text-center text-sm text-[var(--admin-text-faint)]">
            ยังไม่มีข้อความติดต่อ
          </p>
        )}
      </div>
    </div>
  );
}
