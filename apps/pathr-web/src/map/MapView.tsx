import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import type { FeatureCollection, LineString } from "geojson";

type Props = {
  className?: string;
  visited: FeatureCollection<LineString>;
  active: FeatureCollection<LineString>;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  highlightTripId?: string;
  carPosition?: { lat: number; lng: number } | null;
};

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// Product choice: default the map to New Haven, CT so the app has a consistent starting point
// (and doesn't immediately prompt for geolocation before the user has created value).
const DEFAULT_CENTER_NH_CT: L.LatLngExpression = [41.3083, -72.9279];
const DEFAULT_ZOOM = 13;

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
  highlightTripId,
  carPosition
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const visitedLayerRef = useRef<L.LayerGroup | null>(null);
  const activeLayerRef = useRef<L.LayerGroup | null>(null);
  const carLayerRef = useRef<L.LayerGroup | null>(null);
  const carMarkerRef = useRef<L.Marker | null>(null);

  const visitedData = useMemo(() => visited, [visited]);
  const activeData = useMemo(() => active, [active]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true
    }).setView(DEFAULT_CENTER_NH_CT, DEFAULT_ZOOM);

    mapRef.current = map;

    L.tileLayer(OSM_TILE_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19
    }).addTo(map);

    visitedLayerRef.current = L.layerGroup().addTo(map);
    activeLayerRef.current = L.layerGroup().addTo(map);
    carLayerRef.current = L.layerGroup().addTo(map);

    // Default to New Haven, CT unless we can determine the user's location.
    // If location services are available and the user allows it, recenter to the user's location.
    try {
      const perms = (navigator as any)?.permissions;
      const geo = navigator.geolocation;
      if (geo?.getCurrentPosition) {
        const recenter = () =>
          geo.getCurrentPosition(
            (pos) => {
              map.setView([pos.coords.latitude, pos.coords.longitude], map.getZoom(), { animate: false });
            },
            () => {
              // Intentionally ignore errors and keep the default view.
            },
            { enableHighAccuracy: true, timeout: 6000, maximumAge: 30_000 }
          );

        if (perms?.query) {
          void perms
            .query({ name: "geolocation" })
            .then((res: any) => {
              // "granted" -> recenter immediately
              // "prompt"  -> ask once (browser prompt); if user denies, we keep New Haven
              if (res?.state === "granted" || res?.state === "prompt") recenter();
            })
            .catch(() => {
              // Permissions API not available or failed; attempt once (may prompt).
              recenter();
            });
        } else {
          // Permissions API not supported; attempt once (may prompt).
          recenter();
        }
      }
    } catch {
      // Keep default view.
    }

    if (onMapClick) {
      map.on("click", (e: L.LeafletMouseEvent) =>
        onMapClick({ lng: e.latlng.lng, lat: e.latlng.lat })
      );
    }

    return () => {
      mapRef.current = null;
      visitedLayerRef.current = null;
      activeLayerRef.current = null;
      carLayerRef.current = null;
      carMarkerRef.current = null;
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

  useEffect(() => {
    const map = mapRef.current;
    const group = carLayerRef.current;
    if (!map || !group) return;

    if (!carPosition) {
      if (carMarkerRef.current) {
        group.removeLayer(carMarkerRef.current);
        carMarkerRef.current = null;
      }
      return;
    }

    const icon = L.divIcon({
      className: "pathr-car-icon",
      html: `
        <div style="
          width: 34px; height: 34px;
          border-radius: 16px;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.18);
          display: grid; place-items: center;
          box-shadow: 0 12px 28px rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M7.6 10.2 9 7.2c.25-.55.8-.9 1.4-.9h3.2c.6 0 1.15.35 1.4.9l1.4 3.0" stroke="#FFCD00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.5 10.5h11c.83 0 1.5.67 1.5 1.5v4.2c0 .83-.67 1.5-1.5 1.5H6.5c-.83 0-1.5-.67-1.5-1.5V12c0-.83.67-1.5 1.5-1.5Z" stroke="#FFCD00" stroke-width="2" stroke-linejoin="round"/>
            <path d="M8 16.5h.01M16 16.5h.01" stroke="#FFCD00" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const latlng: L.LatLngExpression = [carPosition.lat, carPosition.lng];
    if (!carMarkerRef.current) {
      carMarkerRef.current = L.marker(latlng, { icon, interactive: false });
      carMarkerRef.current.addTo(group);
    } else {
      carMarkerRef.current.setLatLng(latlng);
    }
  }, [carPosition]);

  return <div ref={containerRef} className={["h-full w-full", className].filter(Boolean).join(" ")} />;
}

