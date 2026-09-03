import type {
  InquiryAnalysis,
  NotificationChannelName,
  NotificationResult,
} from "@/lib/inquiries/types";

/** 担当者通知に渡す情報 */
export interface NotificationPayload {
  inquiryId: string;
  receivedAt: Date;
  message: string;
  analysis: InquiryAnalysis;
}

/**
 * 通知サービスの共通インターフェース。
 * Slack / Email / LINE / Discord などは同じ形で実装を追加できる。
 */
export interface NotificationService {
  readonly channel: NotificationChannelName;
  notify(payload: NotificationPayload): Promise<NotificationResult>;
}

/** 現在有効な通知チャネルの状態（UI 表示用） */
export interface NotificationStatus {
  channel: NotificationChannelName;
  /** 外部サービスへ実際に送信する構成になっているか */
  externalDelivery: boolean;
  description: string;
}
