/**
 * 問い合わせドメインの型定義。
 * UI・AI プロバイダー・通知サービスはすべてこの型を共有する。
 */

/** 問い合わせカテゴリ（業種を問わず利用できる汎用分類） */
export const INQUIRY_CATEGORIES = [
  "reservation",
  "hours",
  "product",
  "stock",
  "pricing",
  "change",
  "complaint",
  "other",
] as const;

export type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number];

/** 対応優先度 */
export const URGENCY_LEVELS = ["high", "medium", "low"] as const;
export type Urgency = (typeof URGENCY_LEVELS)[number];

/** 店舗スタッフ側の対応状況 */
export const HANDLING_STATUSES = ["open", "in_progress", "done"] as const;
export type HandlingStatus = (typeof HANDLING_STATUSES)[number];

/** 問い合わせの受信チャネル（将来 Instagram / Web フォーム等へ拡張可能） */
export type InquiryChannel = "line" | "demo";

/** AI 解析を担当したプロバイダー名 */
export type AIProviderName = "mock" | "openai";

/**
 * AI 解析結果。
 * 本文から読み取れなかった項目は推測せず null / 空配列を保持し、
 * 表示側で「未取得」「なし」として扱う。
 */
export interface InquiryAnalysis {
  /** 問い合わせ分類 */
  category: InquiryCategory;
  /** 要約（スタッフが一読して状況を把握できる一文） */
  summary: string;
  /** お客様の意図 */
  customerIntent: string;
  /** 希望日時。読み取れない場合は null */
  dateTime: string | null;
  /** 人数。読み取れない場合は null */
  numberOfPeople: number | null;
  /** 対象の商品・サービス。読み取れない場合は null */
  productOrService: string | null;
  /** 対応優先度 */
  urgency: Urgency;
  /** 優先度をその値にした根拠 */
  urgencyReason: string;
  /** 本文から抽出できた補足情報 */
  extractedDetails: string[];
  /** 返信案（担当者が確認・編集して送信する前提の下書き） */
  replyDraft: string;
  /** この解析を生成したプロバイダー */
  analyzedBy: AIProviderName;
}

/** 担当者通知の送信チャネル */
export type NotificationChannelName = "demo" | "slack";

/** 通知結果。delivered=false は「外部送信していない」ことを意味する */
export interface NotificationResult {
  channel: NotificationChannelName;
  /** 外部サービスへ実際に送信できたか */
  delivered: boolean;
  /** 画面に表示する説明文 */
  note: string;
  /** 通知処理を行った時刻（ISO 8601） */
  notifiedAt: string;
}

/** 1 件の問い合わせ */
export interface Inquiry {
  id: string;
  channel: InquiryChannel;
  /** デモ用の仮名。実在の個人情報は扱わない */
  customerAlias: string;
  /** 問い合わせ本文 */
  message: string;
  /** 受信時刻（ISO 8601） */
  receivedAt: string;
  status: HandlingStatus;
  analysis: InquiryAnalysis;
  /** 担当者通知の結果。未通知なら null */
  notification: NotificationResult | null;
}

/** ダッシュボード上部に表示する集計値 */
export interface InquiryStats {
  today: number;
  open: number;
  highUrgency: number;
  done: number;
}
