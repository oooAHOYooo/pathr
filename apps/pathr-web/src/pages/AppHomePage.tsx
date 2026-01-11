import { MapPlaceholder } from "../components/MapPlaceholder";

export function AppHomePage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-ink/60">Tap “Start Trip” to begin recording.</div>
      <div className="h-[70dvh] md:h-[76dvh]">
        <MapPlaceholder label="Map" />
      </div>
    </div>
  );
}

