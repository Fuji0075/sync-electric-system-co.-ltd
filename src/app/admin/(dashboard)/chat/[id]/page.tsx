import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendAdminReply, closeConversation } from "../actions";
import { createQuoteFromConversation } from "../../quotations/actions";
import { parseChatMessage } from "@/lib/chat-message";
import ChatAvatar from "../ChatAvatar";

const SENDER_LABEL: Record<string, string> = {
  visitor: "ลูกค้า",
  admin: "แอดมิน",
  ai: "ผู้ช่วยอัตโนมัติ",
};

function formatTime(d: Date) {
  return new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(d);
}

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
    <>
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <ChatAvatar name={displayName} online={conversation.status !== "closed"} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate text-sm font-bold text-neutral-900">{displayName}</h2>
              {conversation.channel === "line" && (
                <span className="shrink-0 rounded bg-[#06C755] px-1.5 py-0.5 text-[9px] font-bold text-white">
                  LINE
                </span>
              )}
            </div>
            <p className="truncate text-xs text-neutral-400">
              {conversation.visitorEmail ?? (conversation.channel === "line" ? "ทักจาก LINE OA" : "ไม่ทราบอีเมล")}
              {conversation.visitorPhone ? ` · ${conversation.visitorPhone}` : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
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
              🧾 สร้างใบเสนอราคา
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

      <div className="flex-1 space-y-4 overflow-y-auto bg-neutral-50 p-5">
        {conversation.messages.map((m) => {
          const isVisitor = m.sender === "visitor";
          const isAdmin = m.sender === "admin";
          const { text } = parseChatMessage(m.body);
          return (
            <div key={m.id} className={`flex items-end gap-2 ${isVisitor ? "" : "flex-row-reverse"}`}>
              <ChatAvatar name={isVisitor ? displayName : SENDER_LABEL[m.sender] ?? m.sender} size="sm" />
              <div className={`flex max-w-[70%] flex-col ${isVisitor ? "items-start" : "items-end"}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line shadow-sm ${
                    isVisitor
                      ? "rounded-bl-md bg-white text-neutral-700"
                      : isAdmin
                        ? "rounded-br-md bg-brand text-white"
                        : "rounded-br-md bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {text}
                </div>
                <span className="mt-1 px-1 text-[10px] text-neutral-400">
                  {SENDER_LABEL[m.sender] ?? m.sender} · {formatTime(m.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        {conversation.messages.length === 0 && (
          <p className="pt-10 text-center text-sm text-neutral-400">ยังไม่มีข้อความ</p>
        )}
      </div>

      <form action={reply} className="flex items-center gap-2 border-t border-neutral-100 p-4">
        <input
          name="body"
          placeholder="Enter Message..."
          className="flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-brand focus:bg-white"
        />
        <button
          type="submit"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-white hover:bg-brand-dark"
          aria-label="ส่ง"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </>
  );
}
