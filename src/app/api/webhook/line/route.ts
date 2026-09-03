import { analyzeInquiry } from "@/lib/ai";
import { verifyLineSignature } from "@/lib/line/signature";
import { isTextMessageEvent, type LineWebhookBody } from "@/lib/line/types";
import { notifyStaff } from "@/lib/notifications";

/**
 * LINE Messaging API の Webhook 受信エンドポイント（雛形）。
 *
 * 実装済み:
 *   - x-line-signature の HMAC-SHA256 検証
 *   - テキストメッセージの AI 解析 + 担当者通知の呼び出し
 *
 * 未実装（README にも明記）:
 *   - 解析結果の永続化（DB が無いため Dashboard には反映されない）
 *   - LINE への返信（reply API 呼び出し）
 *   - 実際の LINE 環境での疎通確認
 */
export async function POST(request: Request) {
  const channelSecret = process.env.LINE_CHANNEL_SECRET?.trim();
  if (!channelSecret) {
    return Response.json(
      {
        error:
          "LINE_CHANNEL_SECRET が未設定です。デモモードでは Webhook を受け付けません。",
      },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-line-signature");
  if (!verifyLineSignature(rawBody, signature, channelSecret)) {
    return Response.json({ error: "署名検証に失敗しました。" }, { status: 401 });
  }

  let body: LineWebhookBody;
  try {
    body = JSON.parse(rawBody) as LineWebhookBody;
  } catch {
    return Response.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 },
    );
  }

  const events = Array.isArray(body.events) ? body.events : [];
  let processed = 0;

  for (const event of events) {
    if (!isTextMessageEvent(event)) {
      continue;
    }
    const receivedAt = event.timestamp ? new Date(event.timestamp) : new Date();
    const { analysis } = await analyzeInquiry({
      message: event.message.text,
      receivedAt,
    });
    await notifyStaff({
      inquiryId: event.message.id,
      receivedAt,
      message: event.message.text,
      analysis,
    });
    processed += 1;
  }

  // 永続化層が無いため、解析結果は保存されず Dashboard には反映されない。
  return Response.json({ processed, persisted: false });
}

/** 設定状況の確認用（秘密情報は返さない） */
export async function GET() {
  return Response.json({
    configured: Boolean(process.env.LINE_CHANNEL_SECRET?.trim()),
    signatureVerification: "implemented",
    persistence: "not-implemented",
    reply: "not-implemented",
  });
}
