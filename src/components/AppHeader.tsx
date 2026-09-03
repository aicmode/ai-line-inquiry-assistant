import { InfoBadge, NeutralBadge } from "@/components/ui/Badge";
import { ChatIcon } from "@/components/ui/Icons";
import type { AIProviderStatus } from "@/lib/ai/types";
import type { NotificationStatus } from "@/lib/notifications/types";

interface AppHeaderProps {
  providerStatus: AIProviderStatus;
  notificationStatus: NotificationStatus;
}

export function AppHeader({
  providerStatus,
  notificationStatus,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <ChatIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900">
              AI LINE Inquiry Assistant
            </p>
            <p className="text-xs text-slate-500">
              LINE問い合わせ AI 整理アシスタント
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <InfoBadge>デモモード</InfoBadge>
          <NeutralBadge>
            AI: {providerStatus.active === "mock" ? "Mock（デモ）" : "OpenAI"}
          </NeutralBadge>
          <NeutralBadge>
            通知: {notificationStatus.channel === "demo" ? "デモ" : "Slack"}
          </NeutralBadge>
        </div>
      </div>
    </header>
  );
}
