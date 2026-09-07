import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AutoRefresh from "@/components/AutoRefresh";
import { requireModuleAccess } from "@/lib/admin-permissions";

export default async function AdminChatListPage() {
  await requireModuleAccess("chat");
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div>
      <AutoRefresh />
      <h1 className="mb-6 text-xl font-bold text-neutral-900">แชทกับลูกค้า</h1>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <ul className="divide-y divide-neutral-100">
          {conversations.map((c) => {
            const lastMessage = c.messages[0];
            const displayName = c.customer?.name || c.visitorName || `ผู้เยี่ยมชม #${c.id.slice(-5)}`;
            return (
              <li key={c.id}>
                <Link
                  href={`/admin/chat/${c.id}`}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-800">{displayName}</span>
                      {c.needsAttention && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                          ต้องการแอดมิน
                        </span>
                      )}
                      {c.status === "closed" && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                          ปิดแล้ว
                        </span>
                      )}
                    </div>
                    {c.visitorEmail && (
                      <p className="text-xs text-neutral-400">{c.visitorEmail}</p>
                    )}
                    {lastMessage && (
                      <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                        {lastMessage.sender === "visitor" ? "" : "แอดมิน: "}
                        {lastMessage.body}
                      </p>
                    )}
                  </div>
                  <time className="shrink-0 text-xs text-neutral-400">
                    {new Date(c.updatedAt).toLocaleString("th-TH")}
                  </time>
                </Link>
              </li>
            );
          })}
          {conversations.length === 0 && (
            <li className="p-10 text-center text-sm text-neutral-400">ยังไม่มีการสนทนา</li>
          )}
        </ul>
      </div>
    </div>
  );
}
