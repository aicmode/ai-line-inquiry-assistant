import type { ReactNode } from "react";
import {
  ArrowRightIcon,
  BellIcon,
  ChatIcon,
  FlagIcon,
  ListIcon,
  SparkleIcon,
} from "@/components/ui/Icons";

interface FlowStep {
  title: string;
  description: string;
  icon: ReactNode;
}

const FLOW_STEPS: FlowStep[] = [
  {
    title: "問い合わせ受信",
    description: "お客様がLINEでメッセージを送信",
    icon: <ChatIcon className="h-5 w-5" />,
  },
  {
    title: "AIが分類・要約",
    description: "予約・在庫・料金などに自動分類",
    icon: <SparkleIcon className="h-5 w-5" />,
  },
  {
    title: "情報を抽出",
    description: "日時・人数・商品などを取り出す",
    icon: <ListIcon className="h-5 w-5" />,
  },
  {
    title: "優先度を判定",
    description: "急ぎの問い合わせを高優先度に",
    icon: <FlagIcon className="h-5 w-5" />,
  },
  {
    title: "担当者へ通知",
    description: "返信案を添えてスタッフに連携",
    icon: <BellIcon className="h-5 w-5" />,
  },
];

export function ServiceOverview() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        LINEに届く問い合わせを、AIが自動で整理します
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
        お客様から届いたメッセージを、分類・要約・情報抽出・優先度判定まで自動で処理。
        担当者は整理された内容と返信案を確認するだけで対応できます。
        飲食店・美容室・小売店・車屋・不動産など、店舗型ビジネス全般で利用できます。
      </p>

      <ol className="mt-5 flex flex-col gap-2 md:flex-row md:items-stretch">
        {FLOW_STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col items-stretch gap-2 md:flex-1 md:flex-row md:items-center"
          >
            <div className="flex w-full items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:h-full md:flex-1 md:flex-col md:gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-emerald-600 shadow-sm">
                {step.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </div>
            </div>
            {index < FLOW_STEPS.length - 1 ? (
              <ArrowRightIcon className="mx-auto h-4 w-4 shrink-0 rotate-90 text-slate-300 md:mx-0 md:rotate-0" />
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
