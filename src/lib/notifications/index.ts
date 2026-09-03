import type { NotificationResult } from "@/lib/inquiries/types";
import { demoNotificationService } from "./demo";
import { createSlackNotificationService } from "./slack";
import type {
  NotificationPayload,
  NotificationService,
  NotificationStatus,
} from "./types";

/**
 * 環境変数に応じて通知サービスを解決する（サーバー専用）。
 * 設定が無い場合はデモ通知にフォールバックし、外部送信は行わない。
 */
function resolveNotificationService(): NotificationService {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    return createSlackNotificationService(webhookUrl);
  }
  return demoNotificationService;
}

/** 現在の通知チャネル設定（画面表示用。秘密情報は含まない） */
export function getNotificationStatus(): NotificationStatus {
  const service = resolveNotificationService();

  if (service.channel === "slack") {
    return {
      channel: "slack",
      externalDelivery: true,
      description: "Slack Incoming Webhook へ担当者通知を送信します。",
    };
  }

  return {
    channel: "demo",
    externalDelivery: false,
    description:
      "デモ通知モードです。画面上に通知記録を残すのみで、外部への送信は行いません。",
  };
}

/** 担当者へ通知する */
export function notifyStaff(
  payload: NotificationPayload,
): Promise<NotificationResult> {
  return resolveNotificationService().notify(payload);
}
