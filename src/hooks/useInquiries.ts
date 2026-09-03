"use client";

import { useCallback, useMemo, useState } from "react";
import { isSameDay } from "@/lib/format";
import { createDemoInquiries } from "@/lib/inquiries/demo-data";
import type {
  HandlingStatus,
  Inquiry,
  InquiryStats,
} from "@/lib/inquiries/types";

/**
 * 問い合わせ一覧の状態管理。
 * UI コンポーネントから業務ロジックを分離するためのフック。
 * デモアプリのため永続化は行わず、リロードで初期状態に戻る。
 */
export function useInquiries(nowIso: string) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(() =>
    createDemoInquiries(new Date(nowIso)),
  );
  // 未選択のときは一覧の先頭を表示する
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addInquiry = useCallback((inquiry: Inquiry) => {
    setInquiries((current) => [inquiry, ...current]);
    setSelectedId(inquiry.id);
  }, []);

  const updateStatus = useCallback((id: string, status: HandlingStatus) => {
    setInquiries((current) =>
      current.map((inquiry) =>
        inquiry.id === id ? { ...inquiry, status } : inquiry,
      ),
    );
  }, []);

  const stats = useMemo<InquiryStats>(
    () => ({
      today: inquiries.filter((inquiry) =>
        isSameDay(inquiry.receivedAt, nowIso),
      ).length,
      open: inquiries.filter((inquiry) => inquiry.status === "open").length,
      highUrgency: inquiries.filter(
        (inquiry) =>
          inquiry.analysis.urgency === "high" && inquiry.status !== "done",
      ).length,
      done: inquiries.filter((inquiry) => inquiry.status === "done").length,
    }),
    [inquiries, nowIso],
  );

  const selectedInquiry = useMemo(
    () =>
      inquiries.find((inquiry) => inquiry.id === selectedId) ??
      inquiries[0] ??
      null,
    [inquiries, selectedId],
  );

  return {
    inquiries,
    selectedInquiry,
    selectInquiry: setSelectedId,
    addInquiry,
    updateStatus,
    stats,
  };
}
