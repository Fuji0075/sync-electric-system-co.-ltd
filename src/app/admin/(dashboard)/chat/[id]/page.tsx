import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { sendAdminReply, closeConversation } from "../actions";
import { createQuoteFromConversation } from "../../quotations/actions";
import AutoRefresh from "@/components/AutoRefresh";

const SENDER_LABEL: Record<string, string> = {
  visitor: "ลูกค้า",
  admin: "แอดมิน",
  ai: "ผู้ช่วยอัตโนมัติ",
};

type Params = Promise<{ id: string }>;

export default async function AdminChatThreadPage({ params }: { params: Params }) {
  const { id } = await params;
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } }, customer: true },
  });
  if (!conversation) notFound();

  const reply = sendAdminReply.bind(null, conversation.id);
  const displayName =
    conversation.customer?.name || conversation.visitorName || `ผู้เยี่ยมชม #${conversation.id.slice(-5)}`;

  return (
    <div>
      <AutoRefresh />
      <Link href="/admin/chat" className="mb-4 inline-block text-sm text-brand-dark hover:underline">
        ← กลับไปรายการแชท
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{displayName}</h1>
          <p className="text-sm text-neutral-500">
            {conversation.visitorEmail ?? "ไม่ทราบอีเมล"}
            {conversation.visitorPhone ? ` · ${conversation.visitorPhone}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <form
            action={async () => {
              "use server";
              await createQuoteFromConversation(conversation.id);
            }}
          >
            <button
              type="submit"
              className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
            >
              🧾 สร้างใบเสนอราคาจากแชทนี้
            </button>
          </form>
          {conversation.status !== "closed" && (
            <form
              action={async () => {
                "use server";
                await closeConversation(conversation.id);
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-600 hover:border-red-300 hover:text-red-600"
              >
                ปิดการสนทนา
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="flex h-[28rem] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="flex-1 space-y-3 overflow-y-auto bg-neutral-50 p-4">
          {conversation.messages.map((m) => {
            const isVisitor = m.sender === "visitor";
            return (
              <div key={m.id} className={`flex ${isVisitor ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                    isVisitor
                      ? "bg-white border border-neutral-200 text-neutral-700"
                      : m.sender === "ai"
                        ? "bg-neutral-200 text-neutral-700"
                        : "bg-brand text-white"
                  }`}
                >
                  <p className="mb-0.5 text-[10px] font-semibold opacity-70">
                    {SENDER_LABEL[m.sender] ?? m.sender}
                  </p>
                  {m.body}
                </div>
              </div>
            );
          })}
          {conversation.messages.length === 0 && (
            <p className="text-center text-sm text-neutral-400">ยังไม่มีข้อความ</p>
          )}
        </div>

        <form action={reply} className="flex items-center gap-2 border-t border-neutral-200 p-3">
          <input
            name="body"
            placeholder="พิมพ์ตอบกลับลูกค้า..."
            className="flex-1 rounded-full border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-brand"
          />
          <button
            type="submit"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            ส่ง
          </button>
        </form>
      </div>
    </div>
  );
}
