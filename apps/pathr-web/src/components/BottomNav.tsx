import { Link, useLocation } from "react-router-dom";
import { Button } from "./Button";
import { useRecording } from "../recording/RecordingProvider";

function NavIconTrips({ active }: { active: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M7 6.75a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 19 6.75v10.5A2.25 2.25 0 0 1 16.75 19.5h-7.5A2.25 2.25 0 0 1 7 17.25V6.75Zm2.25-.75a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75V6.75a.75.75 0 0 0-.75-.75h-7.5Z"
      />
      <path
        fill="currentColor"
        d="M10 9.25c0-.414.336-.75.75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 10 9.25Zm0 3.5c0-.414.336-.75.75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
      />
      {active ? <path fill="currentColor" d="M7 6.75h12v1.5H7z" opacity="0.08" /> : null}
    </svg>
  );
}

function NavIconSettings({ active }: { active: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M10.25 3.75h3.5a.75.75 0 0 1 .75.75v.77a6.72 6.72 0 0 1 1.43.83l.66-.38a.75.75 0 0 1 1.03.28l1.75 3.03a.75.75 0 0 1-.28 1.03l-.67.39c.06.49.06.98 0 1.47l.67.39a.75.75 0 0 1 .28 1.03l-1.75 3.03a.75.75 0 0 1-1.03.28l-.66-.38c-.45.34-.93.62-1.43.83v.77a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1-.75-.75v-.77a6.72 6.72 0 0 1-1.43-.83l-.66.38a.75.75 0 0 1-1.03-.28L4.63 15.6a.75.75 0 0 1 .28-1.03l.67-.39a6.7 6.7 0 0 1 0-1.47l-.67-.39a.75.75 0 0 1-.28-1.03L6.38 8.26a.75.75 0 0 1 1.03-.28l.66.38c.45-.34.93-.62 1.43-.83V4.5a.75.75 0 0 1 .75-.75Zm-.37 4.95a.75.75 0 0 1-.53.71 5.2 5.2 0 0 0-1.92 1.1.75.75 0 0 1-.87.1l-.59-.34-1 1.73.6.35a.75.75 0 0 1 .35.8 5.2 5.2 0 0 0 0 2.2.75.75 0 0 1-.35.8l-.6.35 1 1.73.59-.34a.75.75 0 0 1 .87.1 5.2 5.2 0 0 0 1.92 1.1.75.75 0 0 1 .53.71v.68h2v-.68a.75.75 0 0 1 .53-.71 5.2 5.2 0 0 0 1.92-1.1.75.75 0 0 1 .87-.1l.59.34 1-1.73-.6-.35a.75.75 0 0 1-.35-.8 5.2 5.2 0 0 0 0-2.2.75.75 0 0 1 .35-.8l.6-.35-1-1.73-.59.34a.75.75 0 0 1-.87-.1 5.2 5.2 0 0 0-1.92-1.1.75.75 0 0 1-.53-.71V5.25h-2V8.7Z"
      />
      <path fill="currentColor" d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-1.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      {active ? <path fill="currentColor" d="M5 12h14v1.5H5z" opacity="0.06" /> : null}
    </svg>
  );
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function BottomNav() {
  const location = useLocation();
  const { state, start, pause, resume, stop } = useRecording();

  const inTrips = location.pathname.startsWith("/app/trips");
  const inSettings = location.pathname.startsWith("/app/settings");

  const primaryLabel = !state.isRecording ? "Start" : state.isPaused ? "Resume" : "Pause";
  const onPrimary = !state.isRecording ? start : state.isPaused ? resume : pause;

  return (
    <nav className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-3">
      <div className="mx-auto max-w-[360px]">
        <div className="rounded-[28px] bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <Link
              to="/app/trips"
              className={classNames(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition",
                inTrips ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
              aria-label="Trips"
            >
              <NavIconTrips active={inTrips} />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrimary}
                className={classNames(
                  "h-12 rounded-2xl px-6 text-sm font-semibold shadow-[0_16px_40px_rgba(0,0,0,0.45)]",
                  "bg-accent text-paper hover:bg-[#E6B800]"
                )}
              >
                {primaryLabel}
              </button>

              {state.isRecording ? (
                <Button className="h-12 rounded-2xl px-4" onClick={stop} type="button" title="Finish and save this trip on this device.">
                  Finish
                </Button>
              ) : null}
            </div>

            <Link
              to="/app/settings"
              className={classNames(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition",
                inSettings ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
              aria-label="Settings"
            >
              <NavIconSettings active={inSettings} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

