import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { TopNav } from "../components/TopNav";
import { TripFinishSheet } from "../components/TripFinishSheet";
import { useRecording } from "../recording/RecordingProvider";

type Props = PropsWithChildren<{
  showControls?: boolean;
}>;

export function AppLayout({ showControls = true, children }: Props) {
  const year = new Date().getFullYear();
  const { lastFinishedTripId, clearLastFinishedTrip } = useRecording();
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#0B1726] text-white">
      {/* Glassy blue sports background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_480px_at_50%_0%,rgba(36,132,205,0.35),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_520px_at_0%_40%,rgba(255,205,0,0.12),rgba(0,0,0,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_620px_at_100%_60%,rgba(24,95,140,0.45),rgba(0,0,0,0)_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061523] via-[#0B1726] to-[#0A2E4E]" />
      </div>

      {/* Centered mobile shell */}
      <div className="mx-auto flex min-h-[100dvh] max-w-[420px] flex-col">
        <TopNav />

        <main className="flex-1 px-5 pb-2 pt-5">
          {children ?? <Outlet />}
        </main>

        {showControls ? <BottomNav /> : null}

        <footer className="px-5 pb-6 text-center text-[11px] text-white/55">
          <span>© {year} Pathr</span>
          <span className="mx-2">•</span>
          <span>Created by Little Market, LLC</span>
          <span className="mx-2">•</span>
          <Link to="/app/about" className="underline underline-offset-4 hover:text-white/75">
            About
          </Link>
        </footer>
      </div>

      {lastFinishedTripId ? <TripFinishSheet tripId={lastFinishedTripId} onClose={clearLastFinishedTrip} /> : null}
    </div>
  );
}

