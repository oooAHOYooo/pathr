import { useEffect, useRef } from "react";

type GeoPoint = { lat: number; lng: number };

export function useGeolocation(
  isEnabled: boolean,
  onPoint: (point: GeoPoint) => void
) {
  const geoWatchId = useRef<number | null>(null);

  const stopGeoWatch = () => {
    if (geoWatchId.current != null && navigator.geolocation?.clearWatch) {
      navigator.geolocation.clearWatch(geoWatchId.current);
    }
    geoWatchId.current = null;
  };

  const startGeoWatch = () => {
    if (!navigator.geolocation?.watchPosition) return;
    stopGeoWatch();
    geoWatchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onPoint({ lat, lng });
      },
      () => {
        // Fallback or error handling
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 12_000 }
    );
  };

  useEffect(() => {
    if (isEnabled) {
      startGeoWatch();
    } else {
      stopGeoWatch();
    }
    return () => stopGeoWatch();
  }, [isEnabled]);

  // Handle visibility changes (for iOS/backgrounding)
  useEffect(() => {
    const onVis = () => {
      if (!isEnabled) return;
      if (document.hidden) stopGeoWatch();
      else startGeoWatch();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [isEnabled]);

  return { startGeoWatch, stopGeoWatch };
}
