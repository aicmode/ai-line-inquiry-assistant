import type { AIProvider, AnalyzeInput } from "@/lib/ai/types";
import type {
  InquiryAnalysis,
  InquiryCategory,
  Urgency,
} from "@/lib/inquiries/types";
import {
  buildCustomerIntent,
  buildReplyDraft,
  buildSummary,
  type AnalysisSlots,
} from "./compose";
import {
  extractDateTime,
  extractDetails,
  extractPeople,
  extractProductOrService,
  hasUrgentExpression,
  normalizeMessage,
} from "./extract";
import { CATEGORY_RULES } from "./rules";

/** デモで「AI が解析している」状態を見せるための待ち時間（ミリ秒） */
const MOCK_LATENCY_MS = 700;

/** キーワードの重み付き合計が最も高いカテゴリを選ぶ */
export function classifyCategory(text: string): InquiryCategory {
  let best: { category: InquiryCategory; score: number } = {
    category: "other",
    score: 0,
  };

  for (const rule of CATEGORY_RULES) {
    const score = rule.keywords.reduce(
      (total, { word, weight }) => (text.includes(word) ? total + weight : total),
      0,
    );
    if (score > best.score) {
      best = { category: rule.category, score };
    }
  }

  return best.category;
}

interface UrgencyJudgement {
  urgency: Urgency;
  reason: string;
}

/** 優先度と、その判定根拠を返す */
export function judgeUrgency(
  text: string,
  category: InquiryCategory,
  timing: { isToday: boolean; isNearTerm: boolean },
): UrgencyJudgement {
  if (category === "complaint") {
    return {
      urgency: "high",
      reason: "クレーム・トラブルの可能性があるため最優先で確認が必要です。",
    };
  }
  if (hasUrgentExpression(text)) {
    return {
      urgency: "high",
      reason: "本文に至急・急ぎを示す表現が含まれています。",
    };
  }
  if (timing.isToday) {
    return {
      urgency: "high",
      reason: "当日中の対応を希望する内容のため、早急な返信が必要です。",
    };
  }
  if (
    timing.isNearTerm &&
    (category === "reservation" || category === "change")
  ) {
    return {
      urgency: "high",
      reason: "直近の日時が指定された予約・変更のため、早めの返信が必要です。",
    };
  }
  if (
    category === "reservation" ||
    category === "change" ||
    category === "stock" ||
    category === "pricing"
  ) {
    return {
      urgency: "medium",
      reason: "予約・在庫・料金に関する確認のため、当日中の返信が望まれます。",
    };
  }
  return {
    urgency: "low",
    reason: "急ぎを示す表現がなく、通常対応で問題ありません。",
  };
}

/**
 * ルールベースの解析本体（同期・副作用なし）。
 * API ルートからもデモ初期データ生成からも同じ関数を利用する。
 */
export function analyzeWithRules(input: AnalyzeInput): InquiryAnalysis {
  const text = normalizeMessage(input.message);
  const category = classifyCategory(text);

  // 「18時から19時に変更」のように変更依頼の場合は後ろの時刻を希望として扱う
  const preferLastTime = category === "change";
  const dateTime = extractDateTime(text, input.receivedAt, preferLastTime);
  const people = extractPeople(text);
  const { productOrService, attribute } = extractProductOrService(text);
  const extractedDetails = extractDetails(text, people, attribute);
  const { urgency, reason } = judgeUrgency(text, category, dateTime);

  const slots: AnalysisSlots = {
    dateTime: dateTime.label,
    numberOfPeople: people.numberOfPeople,
    numberOfChildren: people.numberOfChildren,
    productOrService,
    isToday: dateTime.isToday,
  };

  return {
    category,
    summary: buildSummary(category, slots),
    customerIntent: buildCustomerIntent(category, slots),
    dateTime: dateTime.label,
    numberOfPeople: people.numberOfPeople,
    productOrService,
    urgency,
    urgencyReason: reason,
    extractedDetails,
    replyDraft: buildReplyDraft(category, slots),
    analyzedBy: "mock",
  };
}

/** API キー不要で動作するデモ用 AI プロバイダー */
export const mockAIProvider: AIProvider = {
  name: "mock",
  async analyze(input) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
    return analyzeWithRules(input);
  },
};
