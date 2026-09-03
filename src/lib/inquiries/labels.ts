import type {
  HandlingStatus,
  InquiryCategory,
  InquiryChannel,
  Urgency,
} from "./types";

/** 値が取得できなかった項目の表示文言 */
export const EMPTY_VALUE = "未取得";
/** 該当なしを明示する表示文言 */
export const NONE_VALUE = "なし";

export const CATEGORY_LABELS: Record<InquiryCategory, string> = {
  reservation: "予約",
  hours: "営業時間",
  product: "商品・サービス",
  stock: "在庫",
  pricing: "料金",
  change: "キャンセル・変更",
  complaint: "クレーム",
  other: "その他",
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

export const STATUS_LABELS: Record<HandlingStatus, string> = {
  open: "未対応",
  in_progress: "対応中",
  done: "対応済み",
};

export const CHANNEL_LABELS: Record<InquiryChannel, string> = {
  line: "LINE",
  demo: "デモ送信",
};
