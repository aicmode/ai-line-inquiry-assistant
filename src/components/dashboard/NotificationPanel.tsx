import { BellIcon } from "@/components/ui/Icons";
import { formatDateTime } from "@/lib/format";
import type { NotificationResult } from "@/lib/inquiries/types";

/**
 * 担当者通知の状態表示。
 * 外部送信していない場合は「デモ通知」であることを明示する。
 */
export function NotificationPanel({
  notification,
}: {
  notification: NotificationResult | null;
}) {
  if (!notification) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
        <BellIcon className="mt-px h-4 w-4 shrink-0 text-slate-400" />
        <span>未通知（この問い合わせはまだ担当者へ通知していません）</span>
      </div>
    );
  }

  const isDemo = !notification.delivered;

  return (
    <div
      className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs ${
        isDemo
          ? "border-slate-200 bg-slate-50 text-slate-600"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      <BellIcon
        className={`mt-px h-4 w-4 shrink-0 ${
          isDemo ? "text-slate-400" : "text-emerald-600"
        }`}
      />
      <div>
        <p className="font-medium">
          {isDemo
            ? "担当者へ通知済み（デモ通知）"
            : `担当者へ通知済み（${notification.channel}）`}
        </p>
        <p className="mt-0.5 leading-relaxed">{notification.note}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          通知時刻: {formatDateTime(notification.notifiedAt)}
        </p>
      </div>
    </div>
  );
}
