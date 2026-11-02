import { Dashboard } from "@/components/dashboard/dashboard";
import { SetupNotice } from "@/components/setupNotice/setupNotice";
import { SoundWaves } from "@/components/soundWaves/soundWaves";
import { getDashboard } from "@/lib/spotify";

export default async function Home() {
  const result = await getDashboard();

  return (
    <main className="relative flex-1 overflow-hidden">
      {result.status === "ok" ? (
        <>
          <SoundWaves />
          <Dashboard data={result.data} />
        </>
      ) : (
        <SetupNotice result={result} />
      )}
    </main>
  );
}
