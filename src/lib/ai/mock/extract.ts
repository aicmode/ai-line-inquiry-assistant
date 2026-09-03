import {
  DETAIL_KEYWORDS,
  PRODUCT_ATTRIBUTES,
  PRODUCT_NOUNS,
  URGENT_KEYWORDS,
} from "./rules";

/**
 * 本文からの情報抽出ロジック。
 * 本文に書かれていないことは推測せず、必ず null / 空配列を返す。
 */

/** 全角英数字などを正規化して判定しやすくする */
export function normalizeMessage(message: string): string {
  return message.normalize("NFKC").replace(/\s+/g, " ").trim();
}

export interface DateTimeExtraction {
  /** 表示用ラベル（例: 「明日 19:00」）。読み取れない場合は null */
  label: string | null;
  /** 当日中の希望かどうか */
  isToday: boolean;
  /** 今日・明日など直近の日付が指定されているか */
  isNearTerm: boolean;
}

interface TimeMatch {
  index: number;
  hour: number;
  minute: number;
}

function collectTimes(text: string): TimeMatch[] {
  const matches: TimeMatch[] = [];

  // 「19時」「19時半」「19時30分」
  const kanjiTime = /(\d{1,2})\s*時\s*(半|(\d{1,2})\s*分)?/g;
  for (const m of text.matchAll(kanjiTime)) {
    const hour = Number(m[1]);
    const minute = m[2] === "半" ? 30 : m[3] ? Number(m[3]) : 0;
    if (hour <= 24 && minute < 60) {
      matches.push({ index: m.index, hour, minute });
    }
  }

  // 「19:00」
  const colonTime = /(\d{1,2}):(\d{2})/g;
  for (const m of text.matchAll(colonTime)) {
    const hour = Number(m[1]);
    const minute = Number(m[2]);
    if (hour <= 24 && minute < 60) {
      matches.push({ index: m.index, hour, minute });
    }
  }

  return matches.sort((a, b) => a.index - b.index);
}

/** 「午後7時」のように午後表現が直前にある場合は 12 時間を加算する */
function applyMeridiem(text: string, time: TimeMatch): number {
  const prefix = text.slice(Math.max(0, time.index - 4), time.index);
  if (/午後|夕方|夜/.test(prefix) && time.hour < 12) {
    return time.hour + 12;
  }
  return time.hour;
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

/**
 * 希望日時を抽出する。
 * @param preferLastTime 「18時から19時に変更」のように複数時刻がある場合、後ろの時刻を希望として扱う
 */
export function extractDateTime(
  text: string,
  receivedAt: Date,
  preferLastTime: boolean,
): DateTimeExtraction {
  let dayLabel: string | null = null;
  let isToday = false;
  let isNearTerm = false;

  if (/今日|本日|きょう|今夜|今晩|当日/.test(text)) {
    dayLabel = "今日";
    isToday = true;
    isNearTerm = true;
  } else if (/明日|あした|あす/.test(text)) {
    dayLabel = "明日";
    isNearTerm = true;
  } else if (/明後日|あさって/.test(text)) {
    dayLabel = "明後日";
  } else {
    const explicit =
      text.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/) ??
      text.match(/(?<!\d)(\d{1,2})\/(\d{1,2})(?!\d)/);
    if (explicit) {
      const month = Number(explicit[1]);
      const day = Number(explicit[2]);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        dayLabel = `${month}月${day}日`;
        const target = new Date(receivedAt.getFullYear(), month - 1, day);
        const diffDays = Math.round(
          (target.getTime() -
            new Date(
              receivedAt.getFullYear(),
              receivedAt.getMonth(),
              receivedAt.getDate(),
            ).getTime()) /
            86_400_000,
        );
        isToday = diffDays === 0;
        isNearTerm = diffDays === 0 || diffDays === 1;
      }
    }
  }

  const times = collectTimes(text);
  const picked =
    times.length === 0
      ? null
      : preferLastTime
        ? times[times.length - 1]
        : times[0];

  const timeLabel = picked
    ? `${pad(applyMeridiem(text, picked))}:${pad(picked.minute)}`
    : null;

  if (!dayLabel && !timeLabel) {
    return { label: null, isToday: false, isNearTerm: false };
  }

  return {
    label: [dayLabel, timeLabel].filter(Boolean).join(" "),
    isToday,
    isNearTerm,
  };
}

export interface PeopleExtraction {
  /** 総人数。読み取れない場合は null */
  numberOfPeople: number | null;
  /** 子どもの人数。記載がない場合は null */
  numberOfChildren: number | null;
}

/** 人数・子どもの人数を抽出する */
export function extractPeople(text: string): PeopleExtraction {
  const childPattern =
    /(?:子ども|子供|お子様|お子さま|キッズ)[^。、]{0,6}?(\d{1,2})\s*(?:名様|名|人)/;
  const childMatch = text.match(childPattern);
  const numberOfChildren = childMatch ? Number(childMatch[1]) : null;
  const childNumberIndex = childMatch
    ? text.indexOf(childMatch[0]) + childMatch[0].indexOf(childMatch[1])
    : -1;

  const peoplePattern = /(\d{1,2})\s*(?:名様|名|人)/g;
  for (const m of text.matchAll(peoplePattern)) {
    if (m.index === childNumberIndex) {
      continue; // 子どもの人数は総人数として扱わない
    }
    const count = Number(m[1]);
    if (count >= 1 && count <= 99) {
      return { numberOfPeople: count, numberOfChildren };
    }
  }

  return { numberOfPeople: null, numberOfChildren };
}

/** 対象の商品・サービスと属性（色・サイズ）を抽出する */
export function extractProductOrService(text: string): {
  productOrService: string | null;
  attribute: string | null;
} {
  const noun = PRODUCT_NOUNS.find((word) => text.includes(word)) ?? null;
  const attribute =
    PRODUCT_ATTRIBUTES.find((word) => text.includes(word)) ?? null;

  if (!noun) {
    return { productOrService: null, attribute };
  }

  return {
    productOrService: attribute ? `${noun}（${attribute}）` : noun,
    attribute,
  };
}

/** 本文中の至急表現の有無 */
export function hasUrgentExpression(text: string): boolean {
  return URGENT_KEYWORDS.some((word) => text.includes(word));
}

/** 補足情報を抽出する（本文に根拠がある項目のみ） */
export function extractDetails(
  text: string,
  people: PeopleExtraction,
  attribute: string | null,
): string[] {
  const details: string[] = [];

  if (people.numberOfChildren !== null) {
    details.push(`子ども${people.numberOfChildren}名`);
  }
  if (attribute) {
    details.push(`色・サイズの指定：${attribute}`);
  }
  if (hasUrgentExpression(text)) {
    details.push("至急対応を希望する表現あり");
  }

  for (const { word, detail } of DETAIL_KEYWORDS) {
    if (text.includes(word) && !details.includes(detail)) {
      details.push(detail);
    }
  }

  return details;
}
