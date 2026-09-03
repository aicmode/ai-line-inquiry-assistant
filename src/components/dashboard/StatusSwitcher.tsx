"use client";

import { STATUS_LABELS } from "@/lib/inquiries/labels";
import { HANDLING_STATUSES, type HandlingStatus } from "@/lib/inquiries/types";

interface StatusSwitcherProps {
  value: HandlingStatus;
  onChange: (status: HandlingStatus) => void;
}

const ACTIVE_CLASSES: Record<HandlingStatus, string> = {
  open: "bg-rose-600 text-white",
  in_progress: "bg-sky-600 text-white",
  done: "bg-emerald-600 text-white",
};

/** 対応状況（未対応 / 対応中 / 対応済み）の切り替え */
export function StatusSwitcher({ value, onChange }: StatusSwitcherProps) {
  return (
    <div
      className="inline-flex shrink-0 self-start rounded-lg border border-slate-200 bg-slate-50 p-0.5"
      role="group"
      aria-label="対応状況の変更"
    >
      {HANDLING_STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          aria-pressed={value === status}
          onClick={() => onChange(status)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
            value === status
              ? ACTIVE_CLASSES[status]
              : "text-slate-600 hover:bg-white hover:text-slate-900"
          }`}
        >
          {STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  );
}
