import type { AIProvider, AnalyzeInput } from "@/lib/ai/types";
import {
  INQUIRY_CATEGORIES,
  URGENCY_LEVELS,
  type InquiryAnalysis,
  type InquiryCategory,
  type Urgency,
} from "@/lib/inquiries/types";

/**
 * OpenAI Chat Completions API を利用する実 AI プロバイダー。
 * API キーはサーバー側の環境変数からのみ読み込み、コードには一切埋め込まない。
 *
 * 注意: このリポジトリでは実 API キーを保持していないため、
 * 実際の API 応答に対する動作確認は行っていない（README「LINE / 外部 API の現状」参照）。
 */

const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const REQUEST_TIMEOUT_MS = 20_000;

const SYSTEM_PROMPT = `あなたは店舗に届いたLINE問い合わせを整理するアシスタントです。
次のJSONオブジェクトのみを出力してください（説明文やコードブロックは不要です）。

{
  "category": ${JSON.stringify(INQUIRY_CATEGORIES)} のいずれか,
  "summary": "スタッフ向けの日本語の要約（1〜2文）",
  "customerIntent": "お客様の意図（短文）",
  "dateTime": "希望日時。読み取れない場合は null",
  "numberOfPeople": 人数の数値。読み取れない場合は null,
  "productOrService": "対象の商品・サービス。読み取れない場合は null",
  "urgency": ${JSON.stringify(URGENCY_LEVELS)} のいずれか,
  "urgencyReason": "その優先度と判断した理由（1文）",
  "extractedDetails": ["本文から読み取れた補足情報"],
  "replyDraft": "店舗スタッフが送る前提の丁寧な返信案"
}

厳守事項:
- 本文に書かれていない情報は絶対に推測・創作しない。読み取れない項目は null または空配列にする。
- 営業時間・在庫・料金・空き状況などの事実を返信案の中で断定しない。「確認して折り返す」形にする。
- クレーム、当日中の対応希望、至急を示す表現がある場合は urgency を "high" にする。`;

function isCategory(value: unknown): value is InquiryCategory {
  return (
    typeof value === "string" &&
    (INQUIRY_CATEGORIES as readonly string[]).includes(value)
  );
}

function isUrgency(value: unknown): value is Urgency {
  return (
    typeof value === "string" &&
    (URGENCY_LEVELS as readonly string[]).includes(value)
  );
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function asRequiredString(value: unknown, field: string): string {
  const text = asNullableString(value);
  if (!text) {
    throw new Error(`OpenAI の応答に ${field} が含まれていません`);
  }
  return text;
}

/** モデルの応答を検証して InquiryAnalysis へ変換する（不正な場合は例外） */
export function parseAnalysisPayload(payload: unknown): InquiryAnalysis {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("OpenAI の応答が JSON オブジェクトではありません");
  }
  const raw = payload as Record<string, unknown>;

  if (!isCategory(raw.category)) {
    throw new Error("OpenAI の応答の category が不正です");
  }
  if (!isUrgency(raw.urgency)) {
    throw new Error("OpenAI の応答の urgency が不正です");
  }

  const numberOfPeople =
    typeof raw.numberOfPeople === "number" &&
    Number.isFinite(raw.numberOfPeople) &&
    raw.numberOfPeople > 0
      ? Math.floor(raw.numberOfPeople)
      : null;

  const extractedDetails = Array.isArray(raw.extractedDetails)
    ? raw.extractedDetails.filter(
        (detail): detail is string =>
          typeof detail === "string" && detail.trim().length > 0,
      )
    : [];

  return {
    category: raw.category,
    summary: asRequiredString(raw.summary, "summary"),
    customerIntent: asRequiredString(raw.customerIntent, "customerIntent"),
    dateTime: asNullableString(raw.dateTime),
    numberOfPeople,
    productOrService: asNullableString(raw.productOrService),
    urgency: raw.urgency,
    urgencyReason:
      asNullableString(raw.urgencyReason) ?? "AI による優先度判定です。",
    extractedDetails,
    replyDraft: asRequiredString(raw.replyDraft, "replyDraft"),
    analyzedBy: "openai",
  };
}

interface ChatCompletionResponse {
  choices?: { message?: { content?: string } }[];
}

export function createOpenAIProvider(
  apiKey: string,
  model: string = DEFAULT_MODEL,
  /** Azure OpenAI / プロキシ経由で利用する場合に差し替える */
  baseUrl: string = DEFAULT_BASE_URL,
): AIProvider {
  const endpoint = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  return {
    name: "openai",
    async analyze(input: AnalyzeInput): Promise<InquiryAnalysis> {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                `受信時刻: ${input.receivedAt.toISOString()}`,
                "問い合わせ本文:",
                input.message,
              ].join("\n"),
            },
          ],
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(
          `OpenAI API がエラーを返しました (HTTP ${response.status})`,
        );
      }

      const body = (await response.json()) as ChatCompletionResponse;
      const content = body.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("OpenAI API の応答が空でした");
      }

      return parseAnalysisPayload(JSON.parse(content));
    },
  };
}
