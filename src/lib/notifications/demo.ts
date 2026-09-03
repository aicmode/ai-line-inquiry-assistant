import type { NotificationService } from "./types";

/**
 * デモ用の通知サービス。
 * 外部サービスへは一切送信せず、「通知処理を行った」という記録だけを返す。
 */
export const demoNotificationService: NotificationService = {
  channel: "demo",
  async notify() {
    return {
      channel: "demo",
      delivered: false,
      note: "デモ通知です。担当者への実際の送信は行っていません。",
      notifiedAt: new Date().toISOString(),
    };
  },
};
