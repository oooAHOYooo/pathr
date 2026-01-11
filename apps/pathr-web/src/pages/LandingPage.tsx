import { MapPlaceholder } from "../components/MapPlaceholder";

export function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10">
        <div className="text-sm font-semibold tracking-tight">Pathr</div>
        <div className="mt-2 text-sm text-ink/70">Start recording a drive in one tap.</div>

        <div className="mt-4 h-[72dvh]">
          <MapPlaceholder label="Map" />
        </div>

        <div className="mt-3 text-xs text-ink/60">
          The “Start Trip” button stays on screen while you drive.
        </div>
      </div>
    </div>
  );
}

