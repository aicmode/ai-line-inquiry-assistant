"use client";

import {
  CategoryBadge,
  StatusBadge,
  UrgencyBadge,
} from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { ListIcon } from "@/components/ui/Icons";
import { formatTime } from "@/lib/format";
import { CHANNEL_LABELS } from "@/lib/inquiries/labels";
import type { Inquiry } from "@/lib/inquiries/types";

interface InquiryListProps {
  inquiries: Inquiry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** 時刻・概要・カテゴリ・優先度・対応状況が一目で分かる一覧 */
export function InquiryList({
  inquiries,
  selectedId,
  onSelect,
}: InquiryListProps) {
  return (
    <Card>
      <CardHeader
        title="問い合わせ一覧"
        description={`${inquiries.length}件（新しい順）`}
        icon={<ListIcon className="h-4 w-4" />}
      />
      {inquiries.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-500">
          問い合わせはまだありません。
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {inquiries.map((inquiry) => {
            const isSelected = inquiry.id === selectedId;
            return (
              <li key={inquiry.id}>
                <button
                  type="button"
                  onClick={() => onSelect(inquiry.id)}
                  aria-current={isSelected}
                  className={`w-full px-4 py-3 text-left transition-colors sm:px-5 ${
                    isSelected
                      ? "bg-emerald-50/70 ring-1 ring-emerald-200 ring-inset"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-500 tabular-nums">
                      {formatTime(inquiry.receivedAt)}
                      <span className="ml-1.5 font-normal text-slate-400">
                        {CHANNEL_LABELS[inquiry.channel]}
                      </span>
                    </span>
                    <StatusBadge status={inquiry.status} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-900">
                    {inquiry.analysis.summary}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <CategoryBadge category={inquiry.analysis.category} />
                    <UrgencyBadge urgency={inquiry.analysis.urgency} />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
