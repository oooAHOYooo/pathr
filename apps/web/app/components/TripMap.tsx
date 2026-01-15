'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TripPoint } from '@pathr/shared';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface TripMapProps {
  points: TripPoint[];
  currentLocation: { lat: number; lng: number };
}

export default function TripMap({ points, currentLocation }: TripMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([currentLocation.lat, currentLocation.lng], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [currentLocation]);

  // Update map center when current location changes
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      mapRef.current.setView([currentLocation.lat, currentLocation.lng], 15, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [currentLocation]);

  // Update polyline when points change
  useEffect(() => {
    if (!mapRef.current || points.length < 2) {
      if (polylineRef.current) {
        mapRef.current?.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
      return;
    }

    const latlngs = points.map((p) => [p.latitude, p.longitude] as [number, number]);

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latlngs);
    } else {
      const polyline = L.polyline(latlngs, {
        color: '#667EEA',
        weight: 4,
        opacity: 0.8,
      }).addTo(mapRef.current);
      polylineRef.current = polyline;
    }

    // Fit bounds to show entire route
    if (points.length > 1) {
      const bounds = L.latLngBounds(latlngs);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
