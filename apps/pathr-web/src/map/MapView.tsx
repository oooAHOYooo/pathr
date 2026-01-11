import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { FeatureCollection, LineString } from "geojson";

type Props = {
  className?: string;
  accessToken: string | undefined;
  visited: FeatureCollection<LineString>;
  active: FeatureCollection<LineString>;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  highlightTripId?: string;
};

const DEFAULT_STYLE = "mapbox://styles/mapbox/light-v11";

function visitedLineColorExpression(highlightTripId?: string) {
  // Mapbox GL JS expressions are structurally typed but annoyingly hard to satisfy in TS.
  return [
    "case",
    ["==", ["get", "tripId"], highlightTripId ?? ""],
    "#2563EB",
    "rgba(37, 99, 235, 0.85)"
  ] as unknown as mapboxgl.Expression;
}

export function MapView({
  className,
  accessToken,
  visited,
  active,
  onMapClick,
  highlightTripId
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const canRenderMap = Boolean(accessToken);

  const visitedData = useMemo(() => visited, [visited]);
  const activeData = useMemo(() => active, [active]);

  useEffect(() => {
    if (!canRenderMap) return;
    if (!containerRef.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = accessToken!;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: DEFAULT_STYLE,
      center: [-122.4194, 37.7749],
      zoom: 11,
      attributionControl: false
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

    map.on("load", () => {
      // Subtle label contrast reduction (premium "grey world" feel without heavy-handed filters).
      const style = map.getStyle();
      for (const layer of style.layers ?? []) {
        if (layer.type !== "symbol") continue;
        // Only touch text labels, not icons.
        const hasText = Boolean((layer.layout as any)?.["text-field"]);
        if (!hasText) continue;
        try {
          map.setPaintProperty(layer.id, "text-color", "rgba(17,17,17,0.55)");
          map.setPaintProperty(layer.id, "text-halo-color", "rgba(250,250,250,0.75)");
          map.setPaintProperty(layer.id, "text-halo-width", 1);
        } catch {
          // Some layers may not support these props (safe to ignore).
        }
      }

      map.addSource("visited-routes", {
        type: "geojson",
        data: visitedData
      });

      map.addSource("active-route", {
        type: "geojson",
        data: activeData
      });

      // Very subtle glow (underlay).
      map.addLayer({
        id: "visited-glow",
        type: "line",
        source: "visited-routes",
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "rgba(37, 99, 235, 0.20)",
          "line-width": ["interpolate", ["linear"], ["zoom"], 8, 5, 14, 10],
          "line-blur": 2.5
        }
      });

      map.addLayer({
        id: "visited-routes",
        type: "line",
        source: "visited-routes",
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": visitedLineColorExpression(highlightTripId),
          "line-width": ["interpolate", ["linear"], ["zoom"], 8, 2.5, 14, 5.5]
        }
      });

      map.addLayer({
        id: "active-route",
        type: "line",
        source: "active-route",
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#2563EB",
          "line-width": ["interpolate", ["linear"], ["zoom"], 8, 3, 14, 6]
        }
      });
    });

    if (onMapClick) {
      map.on("click", (e) => onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat }));
    }

    return () => {
      mapRef.current = null;
      map.remove();
    };
  }, [accessToken, canRenderMap, onMapClick, visitedData, activeData, highlightTripId]);

  // Keep sources updated.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("visited-routes") as mapboxgl.GeoJSONSource | undefined;
    if (!src) return;
    src.setData(visitedData);
  }, [visitedData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("active-route") as mapboxgl.GeoJSONSource | undefined;
    if (!src) return;
    src.setData(activeData);
  }, [activeData]);

  // Keep highlight updated without re-creating the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!map.getLayer("visited-routes")) return;
    try {
      map.setPaintProperty("visited-routes", "line-color", visitedLineColorExpression(highlightTripId));
    } catch {
      // ignore
    }
  }, [highlightTripId]);

  if (!canRenderMap) {
    return (
      <div className={["relative h-full w-full rounded-xl border bg-surface", className].filter(Boolean).join(" ")}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative p-4">
          <div className="max-w-md rounded-xl border bg-paper p-4 shadow-soft">
            <div className="text-sm font-medium">Mapbox token missing</div>
            <div className="mt-1 text-sm text-ink/70">
              Set <span className="font-mono text-[13px]">VITE_MAPBOX_TOKEN</span> to load the map.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={["h-full w-full", className].filter(Boolean).join(" ")} />;
}

