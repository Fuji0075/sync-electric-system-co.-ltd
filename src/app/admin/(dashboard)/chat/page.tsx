export default function AdminChatEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-[var(--admin-surface-soft)] text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-3xl">💬</span>
      <p className="text-sm font-medium text-[var(--admin-text-muted)]">เลือกการสนทนาทางซ้ายเพื่อเริ่มตอบกลับลูกค้า</p>
    </div>
  );
}
