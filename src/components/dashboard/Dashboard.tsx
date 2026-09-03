"use client";

import { DemoComposer } from "@/components/dashboard/DemoComposer";
import { InquiryDetail } from "@/components/dashboard/InquiryDetail";
import { InquiryList } from "@/components/dashboard/InquiryList";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ServiceOverview } from "@/components/ServiceOverview";
import { AlertIcon } from "@/components/ui/Icons";
import { useInquiries } from "@/hooks/useInquiries";
import type { AIProviderStatus } from "@/lib/ai/types";
import type { NotificationStatus } from "@/lib/notifications/types";

interface DashboardProps {
  /** サーバーで生成した基準時刻。SSR とブラウザで表示を一致させるために受け取る */
  nowIso: string;
  providerStatus: AIProviderStatus;
  notificationStatus: NotificationStatus;
}

export function Dashboard({
  nowIso,
  providerStatus,
  notificationStatus,
}: DashboardProps) {
  const {
    inquiries,
    selectedInquiry,
    selectInquiry,
    addInquiry,
    updateStatus,
    stats,
  } = useInquiries(nowIso);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-5 sm:px-6 sm:py-6">
      <ServiceOverview />

      <p className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-600">
        <AlertIcon className="mt-px h-4 w-4 shrink-0 text-slate-400" />
        <span>
          現在の構成：AI 解析＝
          {providerStatus.active === "mock" ? "Mock AI（デモ）" : "OpenAI API"}
          ／担当者通知＝
          {notificationStatus.channel === "demo"
            ? "デモ通知（外部送信なし）"
            : "Slack Webhook"}
          。{providerStatus.fallbackReason ?? notificationStatus.description}
        </span>
      </p>

      <StatsOverview stats={stats} />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <DemoComposer onAnalyzed={addInquiry} />
          <InquiryList
            inquiries={inquiries}
            selectedId={selectedInquiry?.id ?? null}
            onSelect={selectInquiry}
          />
        </div>

        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <InquiryDetail
              inquiry={selectedInquiry}
              onStatusChange={updateStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
