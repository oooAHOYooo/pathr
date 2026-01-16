import { useEffect, useMemo, useState } from "react";
import { Button } from "./Button";
import { getStoredTripById } from "../storage/trips";
import { getTripDetails, type TripDetails, type TripRating, upsertTripDetails } from "../storage/tripDetails";
import { formatDistanceMiles, formatDurationSeconds, formatShortDate } from "@pathr/shared";

const TAGS = ["Commute", "Errands", "Scenic", "Work", "Family", "Roadtrip"] as const;

function lockScroll(locked: boolean) {
  const body = document.body;
  if (locked) {
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
  } else {
    body.style.overflow = "";
    body.style.touchAction = "";
  }
}

function Scale({
  value,
  onChange,
  labels
}: {
  value: TripRating | null;
  onChange: (v: TripRating) => void;
  labels: { left: string; right: string };
}) {
  const options: TripRating[] = [1, 2, 3, 4, 5];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
        <div>{labels.left}</div>
        <div>{labels.right}</div>
      </div>
      <div className="flex items-center justify-between gap-2">
        {options.map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={[
                "h-11 w-11 rounded-2xl text-sm font-semibold",
                "ring-1 ring-white/15 backdrop-blur",
                active ? "bg-accent text-paper ring-accent/50" : "bg-white/8 text-white/80 hover:bg-white/12"
              ].join(" ")}
              aria-pressed={active}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TripFinishSheet({ tripId, onClose }: { tripId: string; onClose: () => void }) {
  const stored = useMemo(() => getStoredTripById(tripId), [tripId]);
  const trip = stored?.trip;

  const existing = useMemo(() => getTripDetails(tripId), [tripId]);
  const [title, setTitle] = useState(existing?.title ?? "Trip");
  const [driveRating, setDriveRating] = useState<TripRating | null>(existing?.driveRating ?? null);
  const [trafficRating, setTrafficRating] = useState<TripRating | null>(existing?.trafficRating ?? null);
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [note, setNote] = useState(existing?.note ?? "");

  useEffect(() => {
    lockScroll(true);
    return () => lockScroll(false);
  }, []);

  if (!trip) return null;

  const onToggleTag = (t: string) => {
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  };

  const onSave = () => {
    const payload: TripDetails = {
      title: title.trim() || "Trip",
      driveRating,
      trafficRating,
      tags,
      note: note.trim(),
      updatedAt: new Date().toISOString()
    };
    upsertTripDetails(tripId, payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000]">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[420px] px-5">
          <div className="max-h-[calc(100dvh-16px)] overflow-hidden rounded-t-[34px] bg-white/12 ring-1 ring-white/18 backdrop-blur">
            <div className="flex max-h-[calc(100dvh-16px)] flex-col">
              {/* Handle */}
              <div className="flex items-center justify-center pt-3">
                <div className="h-1.5 w-12 rounded-full bg-white/25" />
              </div>

              {/* Header */}
              <div className="shrink-0 px-5 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white/90">Finish trip</div>
                    <div className="mt-1 text-xs text-white/65">
                      {formatShortDate(trip.startedAt)} • {formatDistanceMiles(trip.distanceMeters ?? 0)} •{" "}
                      {formatDurationSeconds(trip.durationSeconds ?? 0)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10 hover:bg-white/15"
                    aria-label="Not now"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-white/80">
                      <path
                        fill="currentColor"
                        d="M12 13.06 6.53 18.53a.75.75 0 1 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 1 1 1.06-1.06L12 10.94l5.47-5.47a.75.75 0 0 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable body
                  Add a generous bottom padding so the last field can scroll fully above the pinned footer. */}
              <div className="flex-1 overscroll-contain overflow-y-auto px-5 pb-[calc(140px+env(safe-area-inset-bottom))] pt-4">
                <div className="space-y-4">
                  <div className="rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Quick details</div>
                    <div className="mt-3 space-y-4">
                      <Scale value={driveRating} onChange={setDriveRating} labels={{ left: "Chill", right: "Intense" }} />
                      <Scale value={trafficRating} onChange={setTrafficRating} labels={{ left: "Clear", right: "Traffic" }} />
                    </div>
                  </div>

                  <div className="rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Tags</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {TAGS.map((t) => {
                        const active = tags.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => onToggleTag(t)}
                            className={[
                              "rounded-2xl px-3 py-2 text-xs font-semibold",
                              "ring-1 ring-white/10",
                              active ? "bg-accent text-paper ring-accent/40" : "bg-white/8 text-white/80 hover:bg-white/12"
                            ].join(" ")}
                            aria-pressed={active}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Name (optional)</div>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-3 h-12 w-full rounded-2xl bg-white/8 px-4 text-sm text-white/90 ring-1 ring-white/10 outline-none placeholder:text-white/40 focus:ring-accent/40"
                      placeholder="Trip"
                      inputMode="text"
                    />

                    <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Note (optional)</div>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="mt-3 min-h-[96px] w-full resize-none rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/90 ring-1 ring-white/10 outline-none placeholder:text-white/40 focus:ring-accent/40"
                      placeholder="Anything you want to remember?"
                    />
                  </div>
                </div>
              </div>

              {/* Pinned footer (prevents overlap on short screens + respects safe-area) */}
              <div className="shrink-0 border-t border-white/10 bg-black/20 px-5 pb-[calc(18px+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
                <div className="flex items-center gap-2">
                  <Button variant="primary" className="h-12 flex-1 rounded-2xl" onClick={onSave} type="button">
                    Save
                  </Button>
                  <Button className="h-12 rounded-2xl px-5" onClick={onClose} type="button">
                    Skip
                  </Button>
                </div>
                <div className="mt-3 text-center text-xs text-white/55">
                  Quick and local for now. TODO: sync to your account later.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

