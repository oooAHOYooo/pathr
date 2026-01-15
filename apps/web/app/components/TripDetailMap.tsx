'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TripPoint } from '@pathr/shared';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface TripDetailMapProps {
  points: TripPoint[];
}

export default function TripDetailMap({ points }: TripDetailMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || points.length === 0) return;

    const firstPoint = points[0];
    const map = L.map(mapContainerRef.current).setView([firstPoint.latitude, firstPoint.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [points]);

  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    const latlngs = points.map((p) => [p.latitude, p.longitude] as [number, number]);

    // Update or create polyline
    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latlngs);
    } else {
      const polyline = L.polyline(latlngs, {
        color: '#667EEA',
        weight: 5,
        opacity: 0.8,
      }).addTo(mapRef.current);
      polylineRef.current = polyline;
    }

    // Add start marker
    if (startMarkerRef.current) {
      startMarkerRef.current.setLatLng([points[0].latitude, points[0].longitude]);
    } else {
      const startMarker = L.marker([points[0].latitude, points[0].longitude], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      })
        .addTo(mapRef.current)
        .bindPopup('Start');
      startMarkerRef.current = startMarker;
    }

    // Add end marker
    const lastPoint = points[points.length - 1];
    if (endMarkerRef.current) {
      endMarkerRef.current.setLatLng([lastPoint.latitude, lastPoint.longitude]);
    } else {
      const endMarker = L.marker([lastPoint.latitude, lastPoint.longitude], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      })
        .addTo(mapRef.current)
        .bindPopup('End');
      endMarkerRef.current = endMarker;
    }

    // Fit bounds
    const bounds = L.latLngBounds(latlngs);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  }, [points]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
