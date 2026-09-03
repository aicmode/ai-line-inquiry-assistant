import type { InquiryCategory } from "@/lib/inquiries/types";

/** カテゴリ判定用のキーワード辞書（重み付きスコアリング） */
interface CategoryRule {
  category: InquiryCategory;
  keywords: { word: string; weight: number }[];
}

export const CATEGORY_RULES: CategoryRule[] = [
  {
    category: "complaint",
    keywords: [
      { word: "クレーム", weight: 5 },
      { word: "苦情", weight: 5 },
      { word: "返金", weight: 4 },
      { word: "返品", weight: 3 },
      { word: "不良", weight: 4 },
      { word: "壊れ", weight: 4 },
      { word: "傷が", weight: 3 },
      { word: "汚れて", weight: 3 },
      { word: "違うもの", weight: 3 },
      { word: "間違って", weight: 2 },
      { word: "届かない", weight: 3 },
      { word: "対応が悪", weight: 5 },
      { word: "不満", weight: 4 },
      { word: "最悪", weight: 4 },
      { word: "残念です", weight: 2 },
    ],
  },
  {
    category: "change",
    keywords: [
      { word: "キャンセル", weight: 5 },
      { word: "取り消し", weight: 4 },
      { word: "変更", weight: 5 },
      { word: "ずらし", weight: 3 },
      { word: "リスケ", weight: 3 },
      { word: "延期", weight: 3 },
      { word: "日程を", weight: 2 },
    ],
  },
  {
    category: "reservation",
    keywords: [
      { word: "予約", weight: 4 },
      { word: "空いて", weight: 3 },
      { word: "空き", weight: 3 },
      { word: "取れますか", weight: 3 },
      { word: "とれますか", weight: 3 },
      { word: "席は", weight: 2 },
      { word: "貸切", weight: 2 },
      { word: "来店", weight: 2 },
      { word: "伺いたい", weight: 2 },
    ],
  },
  {
    category: "stock",
    keywords: [
      { word: "在庫", weight: 5 },
      { word: "残って", weight: 3 },
      { word: "売り切れ", weight: 4 },
      { word: "完売", weight: 3 },
      { word: "入荷", weight: 3 },
      { word: "まだあります", weight: 3 },
    ],
  },
  {
    category: "hours",
    keywords: [
      { word: "営業時間", weight: 5 },
      { word: "何時まで", weight: 4 },
      { word: "何時から", weight: 4 },
      { word: "定休日", weight: 4 },
      { word: "開いて", weight: 3 },
      { word: "休みです", weight: 3 },
      { word: "営業して", weight: 3 },
      { word: "ラストオーダー", weight: 3 },
    ],
  },
  {
    category: "pricing",
    keywords: [
      { word: "料金", weight: 4 },
      { word: "値段", weight: 4 },
      { word: "いくら", weight: 4 },
      { word: "価格", weight: 4 },
      { word: "費用", weight: 3 },
      { word: "見積", weight: 3 },
      { word: "予算", weight: 2 },
    ],
  },
  {
    category: "product",
    keywords: [
      { word: "商品", weight: 2 },
      { word: "メニュー", weight: 3 },
      { word: "サービス", weight: 2 },
      { word: "取扱", weight: 3 },
      { word: "取り扱い", weight: 3 },
      { word: "サイズ", weight: 2 },
      { word: "購入", weight: 2 },
      { word: "買った", weight: 2 },
      { word: "使い方", weight: 2 },
      { word: "施術", weight: 2 },
    ],
  },
];

/** 至急対応を示す表現 */
export const URGENT_KEYWORDS = [
  "至急",
  "大至急",
  "今すぐ",
  "すぐに",
  "急ぎ",
  "急いで",
  "本日中",
  "今から",
  "これから",
];

/** 商品・サービスの対象となる名詞 */
export const PRODUCT_NOUNS = [
  "商品",
  "メニュー",
  "コース",
  "プラン",
  "サービス",
  "部屋",
  "物件",
  "車両",
  "部品",
  "カット",
  "カラー",
  "パーマ",
  "施術",
  "ランチ",
  "ディナー",
  "セット",
  "弁当",
];

/** 色・サイズなどの属性表現 */
export const PRODUCT_ATTRIBUTES = [
  "黒",
  "白",
  "赤",
  "青",
  "緑",
  "黄",
  "茶",
  "紺",
  "ネイビー",
  "ベージュ",
  "グレー",
  "シルバー",
  "ゴールド",
  "ピンク",
  "紫",
  "Sサイズ",
  "Mサイズ",
  "Lサイズ",
  "LLサイズ",
];

/** 本文に含まれていれば補足情報として拾うキーワード */
export const DETAIL_KEYWORDS: { word: string; detail: string }[] = [
  { word: "個室", detail: "個室希望の記載あり" },
  { word: "駐車場", detail: "駐車場に関する記載あり" },
  { word: "アレルギー", detail: "アレルギーに関する記載あり" },
  { word: "禁煙", detail: "禁煙席に関する記載あり" },
  { word: "喫煙", detail: "喫煙席に関する記載あり" },
  { word: "ベビーカー", detail: "ベビーカー利用の記載あり" },
  { word: "車椅子", detail: "車椅子利用の記載あり" },
  { word: "ペット", detail: "ペット同伴に関する記載あり" },
  { word: "領収書", detail: "領収書に関する記載あり" },
  { word: "電話", detail: "電話連絡希望の記載あり" },
  { word: "初めて", detail: "初回利用の記載あり" },
  { word: "昨日", detail: "過去の利用・購入に関する記載あり" },
];
