/**
 * LINE Messaging API の Webhook ペイロード（本アプリで扱う範囲のみ）。
 * 公式仕様の全項目は定義していない。
 */
export interface LineTextMessage {
  type: "text";
  id: string;
  text: string;
}

export interface LineWebhookEvent {
  type: string;
  timestamp?: number;
  replyToken?: string;
  source?: { type?: string; userId?: string };
  message?: LineTextMessage | { type: string };
}

export interface LineWebhookBody {
  destination?: string;
  events?: LineWebhookEvent[];
}

/** テキストメッセージイベントかどうかを判定する */
export function isTextMessageEvent(
  event: LineWebhookEvent,
): event is LineWebhookEvent & { message: LineTextMessage } {
  return (
    event.type === "message" &&
    typeof event.message === "object" &&
    event.message !== null &&
    event.message.type === "text" &&
    typeof (event.message as LineTextMessage).text === "string"
  );
}
