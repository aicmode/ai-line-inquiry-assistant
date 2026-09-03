/**
 * 日時表示のユーティリティ。
 * サーバー / ブラウザでタイムゾーンが異なっても表示がぶれないよう、
 * 表示用タイムゾーンを固定する。
 */
const DISPLAY_TIME_ZONE = "Asia/Tokyo";

const timeFormatter = new Intl.DateTimeFormat("ja-JP", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: DISPLAY_TIME_ZONE,
});

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "long",
  day: "numeric",
  timeZone: DISPLAY_TIME_ZONE,
});

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: DISPLAY_TIME_ZONE,
});

/** 「09:30」形式 */
export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

/** 「9月3日 09:30」形式 */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
}

/** 同じ日付かどうか（表示用タイムゾーン基準） */
export function isSameDay(iso: string, reference: string): boolean {
  return (
    dateKeyFormatter.format(new Date(iso)) ===
    dateKeyFormatter.format(new Date(reference))
  );
}
