import { useState } from "react";
import { Button } from "./Button";
import { useRecording } from "../recording/RecordingProvider";

function IconTrips() {
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
    </svg>
  );
}

function IconProfile() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12 12.25a4.25 4.25 0 1 1 0-8.5 4.25 4.25 0 0 1 0 8.5Zm0-1.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z"
      />
      <path
        fill="currentColor"
        d="M4.5 20.25c0-3.314 3.358-5.75 7.5-5.75s7.5 2.436 7.5 5.75c0 .414-.336.75-.75.75h-13.5a.75.75 0 0 1-.75-.75Zm1.56-.75h11.88c-.46-2.04-2.86-3.5-5.94-3.5s-5.48 1.46-5.94 3.5Z"
      />
    </svg>
  );
}

type Props = {
  className?: string;
};

export function FloatingControls({ className }: Props) {
  const [hint, setHint] = useState<string | null>(null);
  const { state, start, pause, resume, stop, statusText } = useRecording();

  return (
    <div className={["fixed inset-x-0 bottom-0 z-20", className].filter(Boolean).join(" ")}>
      <div className="mx-auto max-w-6xl px-4 pb-5">
        {statusText ? (
          <div className="mb-2 text-center text-xs text-ink/60">{statusText}</div>
        ) : null}

        {hint ? (
          <div className="mb-2 text-center text-xs text-ink/60">
            {hint}{" "}
            <button
              className="underline underline-offset-2 hover:text-ink"
              onClick={() => setHint(null)}
              type="button"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <div className="flex items-end justify-end">
          <div className="flex items-center gap-2">
            <button
              aria-label="Trips"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-white text-ink/30"
              disabled
              type="button"
            >
              <IconTrips />
            </button>

            <button
              aria-label="Profile"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-white text-ink/30"
              disabled
              type="button"
            >
              <IconProfile />
            </button>

            {state.isRecording ? (
              <>
                <Button
                  className="h-12 rounded-full px-5"
                  onClick={() => (state.isPaused ? resume() : pause())}
                  type="button"
                >
                  {state.isPaused ? "Resume" : "Pause"}
                </Button>

                <Button
                  variant="primary"
                  className="h-12 rounded-full px-5"
                  onClick={() => {
                    stop();
                    setHint("Saved locally. Trips will sync to your account later.");
                  }}
                  type="button"
                >
                  Stop
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                className="h-12 rounded-full px-5"
                onClick={() => {
                  start();
                  setHint("Recording mode on. Click the map to add points.");
                }}
                type="button"
              >
                Start Trip
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

