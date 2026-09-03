import type { InquiryCategory } from "@/lib/inquiries/types";

/** 要約・意図・返信案の組み立てに使う抽出済みスロット */
export interface AnalysisSlots {
  dateTime: string | null;
  numberOfPeople: number | null;
  numberOfChildren: number | null;
  productOrService: string | null;
  isToday: boolean;
}

function peopleLabel(slots: AnalysisSlots): string | null {
  return slots.numberOfPeople !== null ? `${slots.numberOfPeople}名` : null;
}

function childrenSentence(slots: AnalysisSlots): string {
  return slots.numberOfChildren !== null
    ? `子ども${slots.numberOfChildren}名を含む。`
    : "";
}

/** スタッフが一読で状況を把握できる要約を組み立てる */
export function buildSummary(
  category: InquiryCategory,
  slots: AnalysisSlots,
): string {
  const when = slots.dateTime ? `${slots.dateTime}に` : "";
  const who = peopleLabel(slots) ? `${peopleLabel(slots)}で` : "";
  const target = slots.productOrService ?? "対象の商品・サービスは未取得";

  switch (category) {
    case "reservation":
      return `${when}${who}予約を希望。${childrenSentence(slots)}`.trim();
    case "change":
      return `既存予約の変更・キャンセルの相談。${
        slots.dateTime ? `希望日時は${slots.dateTime}。` : "希望日時は未取得。"
      }`;
    case "hours":
      return `営業時間・定休日についての確認。${
        slots.dateTime ? `${slots.dateTime}の営業状況を確認したい。` : ""
      }`.trim();
    case "stock":
      return `${target}の在庫状況の確認。`;
    case "product":
      return `${target}についての質問。`;
    case "pricing":
      return `${target}の料金についての確認。`;
    case "complaint":
      return `商品・サービスへの不満やトラブルの申し出。優先的な確認が必要。`;
    case "other":
      return `分類外の問い合わせ。担当者による内容確認が必要。`;
  }
}

/** お客様の意図を短文で表す */
export function buildCustomerIntent(
  category: InquiryCategory,
  slots: AnalysisSlots,
): string {
  const when = slots.dateTime ? `${slots.dateTime}に` : "";
  const who = peopleLabel(slots) ? `${peopleLabel(slots)}で` : "";

  switch (category) {
    case "reservation":
      return `${when}${who}予約したい`.trim();
    case "change":
      return "予約内容を変更・キャンセルしたい";
    case "hours":
      return "営業時間・定休日を知りたい";
    case "stock":
      return "在庫があるか知りたい";
    case "product":
      return "商品・サービスの内容を知りたい";
    case "pricing":
      return "料金を知りたい";
    case "complaint":
      return "トラブルや不満を伝えて対応してほしい";
    case "other":
      return "内容を確認してほしい";
  }
}

/**
 * 返信案を生成する。
 * 営業時間・在庫・料金など店舗ごとに異なる情報は断定せず、
 * 「確認して折り返す」形の下書きに統一する。
 */
export function buildReplyDraft(
  category: InquiryCategory,
  slots: AnalysisSlots,
): string {
  const reservationSlot =
    [slots.dateTime, peopleLabel(slots) ? `${slots.numberOfPeople}名様` : null]
      .filter(Boolean)
      .join("・") || "ご希望の日時";
  const target = slots.productOrService ?? "お問い合わせの商品・サービス";

  switch (category) {
    case "reservation":
      return [
        "お問い合わせありがとうございます。",
        `${reservationSlot}でのご予約について、ただいま空き状況を確認しております。`,
        "確認が取れ次第ご連絡いたしますので、少々お待ちくださいませ。",
      ].join("\n");
    case "change":
      return [
        "お問い合わせありがとうございます。",
        `ご予約の変更・キャンセルについて承りました。${
          slots.dateTime ? `ご希望：${slots.dateTime}。` : ""
        }`,
        "空き状況を確認のうえ、折り返しご連絡いたします。少々お待ちくださいませ。",
      ].join("\n");
    case "hours":
      return [
        "お問い合わせありがとうございます。",
        "営業時間・定休日についてのご質問を承りました。",
        "担当者が確認のうえ、正確な時間をご案内いたします。少々お待ちくださいませ。",
      ].join("\n");
    case "stock":
      return [
        "お問い合わせありがとうございます。",
        `${target}の在庫状況をただいま確認しております。`,
        "確認でき次第ご連絡いたしますので、少々お待ちくださいませ。",
      ].join("\n");
    case "product":
      return [
        "お問い合わせありがとうございます。",
        `${target}について、担当者が内容を確認しております。`,
        "詳細をご案内いたしますので、少々お待ちくださいませ。",
      ].join("\n");
    case "pricing":
      return [
        "お問い合わせありがとうございます。",
        `${target}の料金についてのご質問を承りました。`,
        "内容を確認のうえ、担当者より正確な金額をご案内いたします。少々お待ちくださいませ。",
      ].join("\n");
    case "complaint":
      return [
        "このたびはご不便をおかけし、誠に申し訳ございません。",
        "いただいた内容は担当者が確認し、優先して対応いたします。",
        "恐れ入りますが、少々お待ちくださいませ。",
      ].join("\n");
    case "other":
      return [
        "お問い合わせありがとうございます。",
        "内容を確認のうえ、担当者よりご返信いたします。",
        "少々お待ちくださいませ。",
      ].join("\n");
  }
}
