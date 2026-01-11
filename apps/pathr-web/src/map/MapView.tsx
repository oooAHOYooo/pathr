import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import type { FeatureCollection, LineString } from "geojson";

type Props = {
  className?: string;
  visited: FeatureCollection<LineString>;
  active: FeatureCollection<LineString>;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  highlightTripId?: string;
};

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function toLatLngs(line: LineString): L.LatLngExpression[] {
  return line.coordinates.map(([lng, lat]) => [lat, lng]);
}

function collectAllLatLngs(fc: FeatureCollection<LineString>): L.LatLngExpression[] {
  const out: L.LatLngExpression[] = [];
  for (const f of fc.features) out.push(...toLatLngs(f.geometry));
  return out;
}

export function MapView({
  className,
  visited,
  active,
  onMapClick,
  highlightTripId
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const visitedLayerRef = useRef<L.LayerGroup | null>(null);
  const activeLayerRef = useRef<L.LayerGroup | null>(null);

  const visitedData = useMemo(() => visited, [visited]);
  const activeData = useMemo(() => active, [active]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true
    }).setView([37.7749, -122.4194], 11);

    mapRef.current = map;

    L.tileLayer(OSM_TILE_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19
    }).addTo(map);

    visitedLayerRef.current = L.layerGroup().addTo(map);
    activeLayerRef.current = L.layerGroup().addTo(map);

    if (onMapClick) {
      map.on("click", (e: L.LeafletMouseEvent) =>
        onMapClick({ lng: e.latlng.lng, lat: e.latlng.lat })
      );
    }

    return () => {
      mapRef.current = null;
      visitedLayerRef.current = null;
      activeLayerRef.current = null;
      map.remove();
    };
  }, [onMapClick]);

  useEffect(() => {
    const map = mapRef.current;
    const group = visitedLayerRef.current;
    if (!map || !group) return;

    group.clearLayers();

    for (const f of visitedData.features) {
      const latlngs = toLatLngs(f.geometry);
      const tripId = (f.properties as any)?.tripId as string | undefined;
      const isHighlight = Boolean(highlightTripId && tripId === highlightTripId);

      // Subtle underlay for depth.
      L.polyline(latlngs, {
        color: "rgba(37, 99, 235, 0.18)",
        weight: isHighlight ? 9 : 7,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(group);

      L.polyline(latlngs, {
        color: isHighlight ? "#2563EB" : "rgba(37, 99, 235, 0.85)",
        weight: isHighlight ? 5 : 4,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(group);
    }

    // If we have routes, keep them in view.
    const all = collectAllLatLngs(visitedData);
    if (all.length >= 2) {
      const bounds = L.latLngBounds(all as any);
      map.fitBounds(bounds.pad(0.12), { animate: false });
    }
  }, [visitedData, highlightTripId]);

  useEffect(() => {
    const group = activeLayerRef.current;
    if (!group) return;
    group.clearLayers();

    for (const f of activeData.features) {
      const latlngs = toLatLngs(f.geometry);
      L.polyline(latlngs, {
        color: "#2563EB",
        weight: 5,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(group);
    }
  }, [activeData]);

  return <div ref={containerRef} className={["h-full w-full", className].filter(Boolean).join(" ")} />;
}

