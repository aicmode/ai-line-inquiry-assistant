import type { ReactNode } from "react";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  URGENCY_LABELS,
} from "@/lib/inquiries/labels";
import type {
  HandlingStatus,
  InquiryCategory,
  Urgency,
} from "@/lib/inquiries/types";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

const CATEGORY_CLASS =
  "border-slate-200 bg-slate-50 text-slate-700";

const URGENCY_CLASSES: Record<Urgency, string> = {
  high: "border-red-200 bg-red-600 text-white",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-white text-slate-500",
};

const STATUS_CLASSES: Record<HandlingStatus, string> = {
  open: "border-rose-200 bg-rose-50 text-rose-700",
  in_progress: "border-sky-200 bg-sky-50 text-sky-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function CategoryBadge({ category }: { category: InquiryCategory }) {
  return <Badge className={CATEGORY_CLASS}>{CATEGORY_LABELS[category]}</Badge>;
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <Badge className={URGENCY_CLASSES[urgency]}>
      優先度 {URGENCY_LABELS[urgency]}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: HandlingStatus }) {
  return <Badge className={STATUS_CLASSES[status]}>{STATUS_LABELS[status]}</Badge>;
}

export function InfoBadge({ children }: { children: ReactNode }) {
  return (
    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
      {children}
    </Badge>
  );
}

export function NeutralBadge({ children }: { children: ReactNode }) {
  return (
    <Badge className="border-slate-200 bg-white text-slate-600">{children}</Badge>
  );
}
