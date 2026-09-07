import { prisma } from "@/lib/prisma";
import { markMessageRead, deleteMessage } from "./actions";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">ข้อความติดต่อจากเว็บไซต์</h1>

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-2xl border p-5 ${
              m.read ? "border-neutral-200 bg-white" : "border-brand/30 bg-brand/5"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-neutral-900">{m.name}</span>
                <span className="ml-2 text-sm text-neutral-500">{m.email}</span>
                {m.phone && <span className="ml-2 text-sm text-neutral-500">{m.phone}</span>}
              </div>
              <time className="text-xs text-neutral-400">
                {new Date(m.createdAt).toLocaleString("th-TH")}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-neutral-700">{m.message}</p>
            <div className="mt-4 flex gap-3 text-sm">
              {!m.read && (
                <form
                  action={async () => {
                    "use server";
                    await markMessageRead(m.id);
                  }}
                >
                  <button type="submit" className="text-brand-dark hover:underline">
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
          <p className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">
            ยังไม่มีข้อความติดต่อ
          </p>
        )}
      </div>
    </div>
  );
}
