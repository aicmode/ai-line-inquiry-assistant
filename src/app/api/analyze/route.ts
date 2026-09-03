import { analyzeInquiry } from "@/lib/ai";
import type { AnalyzeSuccessResponse } from "@/lib/api-contract";
import { notifyStaff } from "@/lib/notifications";

/** 1 件あたりの問い合わせ本文の上限（デモ用の安全側の制限） */
const MAX_MESSAGE_LENGTH = 1_000;

interface AnalyzeRequestBody {
  message?: unknown;
  inquiryId?: unknown;
}

/**
 * 問い合わせ本文を解析し、担当者通知まで行う。
 * POST /api/analyze { "message": "...", "inquiryId": "..." }
 */
export async function POST(request: Request) {
  let body: AnalyzeRequestBody;
  try {
    body = (await request.json()) as AnalyzeRequestBody;
  } catch {
    return Response.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 },
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return Response.json(
      { error: "問い合わせ内容を入力してください。" },
      { status: 400 },
    );
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return Response.json(
      {
        error: `問い合わせ内容は ${MAX_MESSAGE_LENGTH} 文字以内で入力してください。`,
      },
      { status: 400 },
    );
  }

  const inquiryId =
    typeof body.inquiryId === "string" && body.inquiryId.trim()
      ? body.inquiryId.trim()
      : `inq-${Date.now()}`;
  const receivedAt = new Date();

  try {
    const { analysis, status } = await analyzeInquiry({ message, receivedAt });
    const notification = await notifyStaff({
      inquiryId,
      receivedAt,
      message,
      analysis,
    });

    const payload: AnalyzeSuccessResponse = {
      inquiryId,
      receivedAt: receivedAt.toISOString(),
      analysis,
      provider: status,
      notification,
    };
    return Response.json(payload);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "不明なエラー";
    console.error(`[analyze] 解析に失敗しました: ${reason}`);
    return Response.json(
      { error: "AI 解析に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 },
    );
  }
}
