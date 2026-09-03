"use client";

import type { ReactNode } from "react";
import { AnalysisPanel } from "@/components/dashboard/AnalysisPanel";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { ReplyDraftPanel } from "@/components/dashboard/ReplyDraftPanel";
import { StatusSwitcher } from "@/components/dashboard/StatusSwitcher";
import { Card, CardHeader } from "@/components/ui/Card";
import { BellIcon, ChatIcon, SparkleIcon } from "@/components/ui/Icons";
import { formatDateTime } from "@/lib/format";
import { CHANNEL_LABELS } from "@/lib/inquiries/labels";
import type { HandlingStatus, Inquiry } from "@/lib/inquiries/types";

interface InquiryDetailProps {
  inquiry: Inquiry | null;
  onStatusChange: (id: string, status: HandlingStatus) => void;
}

function SubHeading({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
      <span className="text-emerald-600">{icon}</span>
      {children}
    </h3>
  );
}

/** 選択中の問い合わせの詳細・AI 解析結果・返信案・通知状態 */
export function InquiryDetail({ inquiry, onStatusChange }: InquiryDetailProps) {
  if (!inquiry) {
    return (
      <Card className="p-8 text-center text-sm text-slate-500">
        左の一覧から問い合わせを選択すると、AI の解析結果が表示されます。
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="問い合わせ詳細"
        description={`${formatDateTime(inquiry.receivedAt)}・${
          CHANNEL_LABELS[inquiry.channel]
        }・${inquiry.customerAlias}`}
        action={
          <StatusSwitcher
            value={inquiry.status}
            onChange={(status) => onStatusChange(inquiry.id, status)}
          />
        }
      />

      <div className="space-y-5 px-4 py-4 sm:px-5">
        <div>
          <SubHeading icon={<ChatIcon className="h-4 w-4" />}>
            お客様からのメッセージ
          </SubHeading>
          <p className="mt-2 rounded-lg rounded-tl-none border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-relaxed whitespace-pre-line text-slate-800">
            {inquiry.message}
          </p>
        </div>

        <div>
          <SubHeading icon={<SparkleIcon className="h-4 w-4" />}>
            AI解析結果
          </SubHeading>
          <div className="mt-2">
            <AnalysisPanel analysis={inquiry.analysis} />
          </div>
        </div>

        <div>
          <SubHeading icon={<ChatIcon className="h-4 w-4" />}>
            AI返信案
          </SubHeading>
          <div className="mt-2">
            <ReplyDraftPanel replyDraft={inquiry.analysis.replyDraft} />
          </div>
        </div>

        <div>
          <SubHeading icon={<BellIcon className="h-4 w-4" />}>
            担当者通知
          </SubHeading>
          <div className="mt-2">
            <NotificationPanel notification={inquiry.notification} />
          </div>
        </div>
      </div>
    </Card>
  );
}
