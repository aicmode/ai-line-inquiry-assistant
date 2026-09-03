import { analyzeWithRules } from "@/lib/ai/mock";
import type { HandlingStatus, Inquiry } from "./types";

/**
 * デモ用の架空問い合わせ。
 * 実在する企業名・人物名・連絡先は一切含まない。
 */
interface DemoSeed {
  /** 基準時刻から何分前に受信したか */
  minutesAgo: number;
  customerAlias: string;
  message: string;
  status: HandlingStatus;
}

const DEMO_SEEDS: DemoSeed[] = [
  {
    minutesAgo: 8,
    customerAlias: "お客様A",
    message: "今日19時から2名空いていますか？",
    status: "open",
  },
  {
    minutesAgo: 34,
    customerAlias: "お客様B",
    message: "先日受け取った商品に傷がありました。交換してもらえますか？",
    status: "open",
  },
  {
    minutesAgo: 72,
    customerAlias: "お客様C",
    message: "この商品の黒はまだ在庫ありますか？",
    status: "open",
  },
  {
    minutesAgo: 118,
    customerAlias: "お客様D",
    message: "予約した時間を18時から19時に変更したいです。",
    status: "in_progress",
  },
  {
    minutesAgo: 176,
    customerAlias: "お客様E",
    message: "昨日購入した商品について確認したいことがあります。",
    status: "in_progress",
  },
  {
    minutesAgo: 245,
    customerAlias: "お客様F",
    message: "営業時間は何時までですか？",
    status: "done",
  },
];

/**
 * 基準時刻をもとにデモ問い合わせを生成する。
 * 解析結果は本番と同じ Mock AI のルールエンジンで生成している。
 */
export function createDemoInquiries(now: Date): Inquiry[] {
  return DEMO_SEEDS.map((seed, index) => {
    const receivedAt = new Date(now.getTime() - seed.minutesAgo * 60_000);
    const analysis = analyzeWithRules({ message: seed.message, receivedAt });

    return {
      id: `demo-${index + 1}`,
      channel: "line",
      customerAlias: seed.customerAlias,
      message: seed.message,
      receivedAt: receivedAt.toISOString(),
      status: seed.status,
      analysis,
      notification:
        analysis.urgency === "high"
          ? {
              channel: "demo",
              delivered: false,
              note: "デモ通知です。担当者への実際の送信は行っていません。",
              notifiedAt: new Date(receivedAt.getTime() + 60_000).toISOString(),
            }
          : null,
    } satisfies Inquiry;
  });
}
