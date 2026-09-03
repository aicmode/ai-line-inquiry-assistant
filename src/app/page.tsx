import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { getAIProviderStatus } from "@/lib/ai";
import { getNotificationStatus } from "@/lib/notifications";

// 環境変数（AI プロバイダー・通知チャネル）の状態を実行時に反映する
export const dynamic = "force-dynamic";

export default function Home() {
  const providerStatus = getAIProviderStatus();
  const notificationStatus = getNotificationStatus();
  // SSR とブラウザで表示時刻がずれないよう、基準時刻はサーバーで生成して渡す
  const nowIso = new Date().toISOString();

  return (
    <>
      <AppHeader
        providerStatus={providerStatus}
        notificationStatus={notificationStatus}
      />
      <main className="flex-1">
        <Dashboard
          nowIso={nowIso}
          providerStatus={providerStatus}
          notificationStatus={notificationStatus}
        />
      </main>
      <AppFooter />
    </>
  );
}
