import type { Feature, FeatureCollection, LineString } from "geojson";
import type { StoredTrip, TripPoint } from "@pathr/shared";

export type RouteFeatureProps = {
  tripId: string;
};

export function pointsToLineString(points: readonly TripPoint[]): LineString {
  return {
    type: "LineString",
    coordinates: points.map((p) => [p.longitude, p.latitude])
  };
}

export function tripsToFeatureCollection(trips: readonly StoredTrip[]): FeatureCollection<LineString, RouteFeatureProps> {
  return {
    type: "FeatureCollection",
    features: trips
      .filter((t) => (t.points?.length ?? 0) >= 2)
      .map((t) => ({
        type: "Feature",
        properties: { tripId: t.trip.id },
        geometry: pointsToLineString(t.points)
      }))
  };
}

export function tripToFeature(trip: StoredTrip): Feature<LineString, RouteFeatureProps> | null {
  if ((trip.points?.length ?? 0) < 2) return null;
  return {
    type: "Feature",
    properties: { tripId: trip.trip.id },
    geometry: pointsToLineString(trip.points)
  };
}

