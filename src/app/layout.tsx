import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI LINE Inquiry Assistant | LINE問い合わせ AI 整理アシスタント",
  description:
    "店舗に届くLINEの問い合わせをAIが分類・要約・情報抽出し、優先度と返信案つきで担当者へ届けるデモアプリです。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
