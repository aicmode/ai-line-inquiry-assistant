import type { AIProviderName, InquiryAnalysis } from "@/lib/inquiries/types";

/** AI 解析への入力 */
export interface AnalyzeInput {
  /** 問い合わせ本文 */
  message: string;
  /** 受信時刻（「今日」「明日」の解決に使用） */
  receivedAt: Date;
}

/**
 * AI プロバイダーの共通インターフェース。
 * Mock / OpenAI などの実装はこの形に揃えることで差し替え可能にする。
 */
export interface AIProvider {
  readonly name: AIProviderName;
  analyze(input: AnalyzeInput): Promise<InquiryAnalysis>;
}

/** 現在有効な AI プロバイダーの状態（UI 表示・デバッグ用） */
export interface AIProviderStatus {
  /** 環境変数 AI_PROVIDER で要求された値 */
  requested: string;
  /** 実際に使用されるプロバイダー */
  active: AIProviderName;
  /** mock へフォールバックした理由。フォールバックしていない場合は null */
  fallbackReason: string | null;
}
