"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/ui/Icons";

type CopyState = "idle" | "copied" | "failed";

/** AI が生成した返信案。担当者が内容を確認してから送信する前提 */
export function ReplyDraftPanel({ replyDraft }: { replyDraft: string }) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(replyDraft);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    } finally {
      window.setTimeout(() => setCopyState("idle"), 2_000);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-slate-500">
          担当者が確認してから送信してください
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        >
          {copyState === "copied" ? (
            <CheckIcon className="h-3.5 w-3.5" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
          {copyState === "copied"
            ? "コピーしました"
            : copyState === "failed"
              ? "コピーできませんでした"
              : "返信案をコピー"}
        </button>
      </div>
      <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-3 text-sm leading-relaxed whitespace-pre-line text-slate-800">
        {replyDraft}
      </p>
    </div>
  );
}
