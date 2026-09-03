import { CategoryBadge, UrgencyBadge } from "@/components/ui/Badge";
import { EMPTY_VALUE, NONE_VALUE } from "@/lib/inquiries/labels";
import type { InquiryAnalysis } from "@/lib/inquiries/types";

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  const isEmpty = value === EMPTY_VALUE || value === NONE_VALUE;
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <dt className="text-[11px] font-medium text-slate-500">{label}</dt>
      <dd
        className={`mt-0.5 text-sm ${
          isEmpty ? "text-slate-400" : "font-medium text-slate-900"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

/** AI が抽出した項目の表示。未取得の項目は推測せず「未取得」と表示する */
export function AnalysisPanel({ analysis }: { analysis: InquiryAnalysis }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={analysis.category} />
        <UrgencyBadge urgency={analysis.urgency} />
        <span className="text-[11px] text-slate-400">
          解析エンジン: {analysis.analyzedBy === "mock" ? "Mock AI（デモ）" : "OpenAI"}
        </span>
      </div>

      <div>
        <p className="text-[11px] font-medium text-slate-500">要約</p>
        <p className="mt-0.5 text-sm leading-relaxed text-slate-900">
          {analysis.summary}
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field label="お客様の意図" value={analysis.customerIntent} />
        <Field label="希望日時" value={analysis.dateTime ?? EMPTY_VALUE} />
        <Field
          label="人数"
          value={
            analysis.numberOfPeople !== null
              ? `${analysis.numberOfPeople}名`
              : EMPTY_VALUE
          }
        />
        <Field
          label="対象の商品・サービス"
          value={analysis.productOrService ?? EMPTY_VALUE}
        />
      </dl>

      <div>
        <p className="text-[11px] font-medium text-slate-500">追加情報</p>
        {analysis.extractedDetails.length > 0 ? (
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {analysis.extractedDetails.map((detail) => (
              <li
                key={detail}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs text-slate-600"
              >
                {detail}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-0.5 text-sm text-slate-400">{NONE_VALUE}</p>
        )}
      </div>

      <p className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs leading-relaxed text-slate-500">
        <span className="font-medium text-slate-600">優先度の判定理由：</span>
        {analysis.urgencyReason}
      </p>
    </div>
  );
}
