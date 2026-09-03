import { mockAIProvider } from "@/lib/ai/mock";
import { createOpenAIProvider } from "@/lib/ai/openai";
import type { AIProvider, AIProviderStatus, AnalyzeInput } from "@/lib/ai/types";
import type { InquiryAnalysis } from "@/lib/inquiries/types";

/**
 * 環境変数に応じて AI プロバイダーを解決する（サーバー専用）。
 * 設定が無い / 不正な場合は必ず mock へフォールバックし、アプリは常に動作する。
 */

interface ResolvedProvider {
  provider: AIProvider;
  status: AIProviderStatus;
}

function resolveProvider(): ResolvedProvider {
  const requested = (process.env.AI_PROVIDER ?? "mock").trim().toLowerCase();
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim();
  const baseUrl = process.env.OPENAI_BASE_URL?.trim();

  if (requested === "openai") {
    if (!apiKey) {
      return {
        provider: mockAIProvider,
        status: {
          requested,
          active: "mock",
          fallbackReason:
            "OPENAI_API_KEY が未設定のため、デモ用の Mock AI で動作しています。",
        },
      };
    }
    return {
      provider: createOpenAIProvider(
        apiKey,
        model || undefined,
        baseUrl || undefined,
      ),
      status: { requested, active: "openai", fallbackReason: null },
    };
  }

  if (requested !== "mock") {
    return {
      provider: mockAIProvider,
      status: {
        requested,
        active: "mock",
        fallbackReason: `AI_PROVIDER="${requested}" は未対応のため、Mock AI で動作しています。`,
      },
    };
  }

  return {
    provider: mockAIProvider,
    status: { requested, active: "mock", fallbackReason: null },
  };
}

/** 現在の AI プロバイダー設定（画面表示用。秘密情報は含まない） */
export function getAIProviderStatus(): AIProviderStatus {
  return resolveProvider().status;
}

/**
 * 問い合わせを解析する。
 * 外部 API 呼び出しが失敗した場合も Mock AI へフォールバックし、デモが止まらないようにする。
 */
export async function analyzeInquiry(input: AnalyzeInput): Promise<{
  analysis: InquiryAnalysis;
  status: AIProviderStatus;
}> {
  const { provider, status } = resolveProvider();

  try {
    return { analysis: await provider.analyze(input), status };
  } catch (error) {
    if (provider.name === "mock") {
      throw error;
    }
    const reason = error instanceof Error ? error.message : "不明なエラー";
    console.warn(`[ai] ${provider.name} での解析に失敗したため mock で再試行します: ${reason}`);
    return {
      analysis: await mockAIProvider.analyze(input),
      status: {
        requested: status.requested,
        active: "mock",
        fallbackReason: `外部 AI API の呼び出しに失敗したため Mock AI で解析しました（${reason}）。`,
      },
    };
  }
}
