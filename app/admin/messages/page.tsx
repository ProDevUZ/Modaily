import { AdminShell } from "@/components/admin/admin-shell";
import { MessageListManager } from "@/components/admin/message-manager";

export default function AdminMessagesPage() {
  return (
    <AdminShell
      current="messages"
      title="Сообщения"
      description=""
      searchable={false}
      headerVariant="compact"
      headerAccessory={
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f5f9] text-sm font-semibold text-slate-500">
          A
        </span>
      }
      mainClassName="p-0"
      contentClassName=""
    >
      <MessageListManager />
    </AdminShell>
  );
}
