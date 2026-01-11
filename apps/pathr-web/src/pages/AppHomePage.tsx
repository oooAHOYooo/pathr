import { useMemo } from "react";
import type { FeatureCollection, LineString } from "geojson";
import { useRecording } from "../recording/RecordingProvider";
import { tripsToFeatureCollection } from "../map/geojson";
import { MapView } from "../map/MapView";

export function AppHomePage() {
  const { state, visitedTrips, addPoint } = useRecording();

  const visited = useMemo(() => tripsToFeatureCollection(visitedTrips), [visitedTrips]);
  const active = useMemo((): FeatureCollection<LineString> => {
    return {
      type: "FeatureCollection",
      features:
        state.points.length >= 2
          ? [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: state.points.map((p) => [p.longitude, p.latitude])
                }
              }
            ]
          : []
    };
  }, [state.points]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4">
      <div className="relative h-[calc(100dvh-56px-24px)] overflow-hidden rounded-xl border bg-surface">
        <MapView
          className="h-full w-full"
          visited={visited}
          active={active}
          onMapClick={addPoint}
        />

        <div className="pointer-events-none absolute left-0 right-0 top-0">
          <div className="p-3">
            <div className="inline-flex items-center rounded-xl border bg-paper/90 px-3 py-2 text-xs text-ink/70">
              Tap <span className="mx-1 font-medium text-ink">Start Trip</span> then click the map to add points.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

