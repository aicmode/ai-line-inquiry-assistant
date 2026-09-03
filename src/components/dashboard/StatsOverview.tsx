import type { InquiryStats } from "@/lib/inquiries/types";

interface StatCard {
  label: string;
  value: number;
  hint: string;
  emphasis?: "default" | "alert";
}

export function StatsOverview({ stats }: { stats: InquiryStats }) {
  const cards: StatCard[] = [
    { label: "今日の問い合わせ", value: stats.today, hint: "本日受信した件数" },
    {
      label: "未対応",
      value: stats.open,
      hint: "担当者の対応待ち",
      emphasis: "alert",
    },
    {
      label: "高優先度",
      value: stats.highUrgency,
      hint: "未対応・対応中のうち優先度「高」",
      emphasis: "alert",
    },
    { label: "対応済み", value: stats.done, hint: "対応が完了した件数" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500">{card.label}</p>
          <p
            className={`mt-1 text-2xl font-bold tabular-nums ${
              card.emphasis === "alert" && card.value > 0
                ? "text-red-600"
                : "text-slate-900"
            }`}
          >
            {card.value}
            <span className="ml-1 text-sm font-medium text-slate-400">件</span>
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            {card.hint}
          </p>
        </div>
      ))}
    </div>
  );
}
