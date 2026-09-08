import { prisma } from "@/lib/prisma";
import AutoRefresh from "@/components/AutoRefresh";
import { requireModuleAccess } from "@/lib/admin-permissions";
import ChatSidebar, { type SidebarConversation } from "./ChatSidebar";

function formatTime(d: Date) {
  return new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(d);
}

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  await requireModuleAccess("chat");

  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const sidebarData: SidebarConversation[] = conversations.map((c) => {
    const lastMessage = c.messages[0];
    return {
      id: c.id,
      displayName: c.customer?.name || c.visitorName || `ผู้เยี่ยมชม #${c.id.slice(-5)}`,
      channel: c.channel,
      subtitle: c.visitorEmail,
      lastMessagePreview: lastMessage
        ? `${lastMessage.sender === "visitor" ? "" : "คุณ: "}${lastMessage.body}`
        : null,
      needsAttention: c.needsAttention,
      isOpen: c.status !== "closed",
      updatedAtLabel: formatTime(c.updatedAt),
    };
  });

  return (
    <div>
      <AutoRefresh />
      <div className="flex h-[calc(100vh-140px)] min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[#15151b] shadow-sm">
        <ChatSidebar conversations={sidebarData} />
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
