import { CATEGORY_LABELS, URGENCY_LABELS } from "@/lib/inquiries/labels";
import type { NotificationService } from "./types";

/**
 * Slack Incoming Webhook への通知。
 * SLACK_WEBHOOK_URL が設定されている場合のみ有効になる。
 *
 * 注意: このリポジトリでは実 Webhook URL を保持していないため、
 * 実際の Slack への送信は未検証（README「LINE / 外部 API の現状」参照）。
 */
export function createSlackNotificationService(
  webhookUrl: string,
): NotificationService {
  return {
    channel: "slack",
    async notify(payload) {
      const { analysis } = payload;
      const text = [
        `【新規問い合わせ / 優先度: ${URGENCY_LABELS[analysis.urgency]}】`,
        `分類: ${CATEGORY_LABELS[analysis.category]}`,
        `要約: ${analysis.summary}`,
        `本文: ${payload.message}`,
      ].join("\n");

      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
          return {
            channel: "slack",
            delivered: false,
            note: `Slack への通知に失敗しました (HTTP ${response.status})。`,
            notifiedAt: new Date().toISOString(),
          };
        }

        return {
          channel: "slack",
          delivered: true,
          note: "Slack の担当者チャンネルへ通知しました。",
          notifiedAt: new Date().toISOString(),
        };
      } catch (error) {
        const reason = error instanceof Error ? error.message : "不明なエラー";
        return {
          channel: "slack",
          delivered: false,
          note: `Slack への通知に失敗しました（${reason}）。`,
          notifiedAt: new Date().toISOString(),
        };
      }
    },
  };
}
