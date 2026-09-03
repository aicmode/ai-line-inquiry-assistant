import type { AIProviderStatus } from "@/lib/ai/types";
import type { InquiryAnalysis, NotificationResult } from "@/lib/inquiries/types";

/** POST /api/analyze の成功レスポンス */
export interface AnalyzeSuccessResponse {
  inquiryId: string;
  /** 受信時刻（ISO 8601） */
  receivedAt: string;
  analysis: InquiryAnalysis;
  provider: AIProviderStatus;
  notification: NotificationResult;
}

/** API のエラーレスポンス */
export interface ApiErrorResponse {
  error: string;
}
