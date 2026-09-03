"use client";

import { useState, type FormEvent } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { AlertIcon, SparkleIcon } from "@/components/ui/Icons";
import type {
  AnalyzeSuccessResponse,
  ApiErrorResponse,
} from "@/lib/api-contract";
import type { Inquiry } from "@/lib/inquiries/types";

const MAX_LENGTH = 1_000;

/** 入力例（すべて架空。実在の企業名・個人情報は含まない） */
const SAMPLE_MESSAGES = [
  "明日の19時に4人で予約できますか？子どもが1人います。",
  "この商品のMサイズはまだ在庫がありますか？",
  "今日中に見積もりを出してもらえますか？至急お願いします。",
];

interface DemoComposerProps {
  onAnalyzed: (inquiry: Inquiry) => void;
}

/** 問い合わせをデモ送信して AI 解析を実行するエリア */
export function DemoComposer({ onAnalyzed }: DemoComposerProps) {
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text || isAnalyzing) {
      if (!text) {
        setError("問い合わせ内容を入力してください。");
      }
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        const body = (await response
          .json()
          .catch(() => null)) as ApiErrorResponse | null;
        setError(body?.error ?? "AI 解析に失敗しました。もう一度お試しください。");
        return;
      }

      const result = (await response.json()) as AnalyzeSuccessResponse;
      onAnalyzed({
        id: result.inquiryId,
        channel: "demo",
        customerAlias: "お客様（デモ）",
        message: text,
        receivedAt: result.receivedAt,
        status: "open",
        analysis: result.analysis,
        notification: result.notification,
      });
      setMessage("");
    } catch {
      setError(
        "通信に失敗しました。ネットワーク状態を確認して再度お試しください。",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title="問い合わせをデモ送信"
        description="実際のLINEには接続していません。入力内容は解析に使うだけで保存されません。"
        icon={<SparkleIcon className="h-4 w-4" />}
      />
      <form onSubmit={handleSubmit} className="px-4 py-4 sm:px-5">
        <label
          htmlFor="demo-message"
          className="block text-xs font-medium text-slate-600"
        >
          お客様からの問い合わせ内容
        </label>
        <textarea
          id="demo-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder="例）明日の19時に4人で予約できますか？"
          className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
        />

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400">入力例:</span>
          {SAMPLE_MESSAGES.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setMessage(sample);
                setError(null);
              }}
              className="max-w-full truncate rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {sample}
            </button>
          ))}
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-3 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          >
            <AlertIcon className="mt-px h-4 w-4 shrink-0" />
            {error}
          </p>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 tabular-nums">
            {message.length} / {MAX_LENGTH} 文字
          </span>
          <button
            type="submit"
            disabled={isAnalyzing || message.trim().length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isAnalyzing ? (
              <>
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden
                />
                AIが解析中…
              </>
            ) : (
              <>
                <SparkleIcon className="h-4 w-4" />
                AIで整理する
              </>
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}
