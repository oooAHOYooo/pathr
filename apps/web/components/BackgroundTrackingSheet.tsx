import { useEffect, useMemo } from "react";
import { Button } from "./Button";

function detectPlatform(ua: string) {
  const s = ua.toLowerCase();
  const isAndroid = s.includes("android");
  // iPadOS 13+ reports as Mac; keep it simple for MVP.
  const isIOS = /iphone|ipad|ipod/.test(s) || (s.includes("macintosh") && "ontouchend" in document);
  return { isIOS, isAndroid };
}

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

export function BackgroundTrackingSheet({ onClose }: { onClose: () => void }) {
  const { isIOS, isAndroid } = useMemo(() => detectPlatform(navigator.userAgent ?? ""), []);

  useEffect(() => {
    lockScroll(true);
    return () => lockScroll(false);
  }, []);

  return (
    <div className="fixed inset-0 z-[3500]">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/55" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[420px] px-5">
          <div className="overflow-hidden rounded-t-[34px] bg-white/12 ring-1 ring-white/18 backdrop-blur">
            <div className="flex items-center justify-center pt-3">
              <div className="h-1.5 w-12 rounded-full bg-white/25" />
            </div>

            <div className="px-5 pb-[calc(18px+env(safe-area-inset-bottom))] pt-4">
              <div className="text-sm font-semibold text-white/90">Background tracking</div>
              <div className="mt-2 text-sm text-white/70">
                Pathr is a web app. Phones may pause GPS updates when the browser is closed or the screen is locked.
                We’ll keep your trip safe and resume when you come back.
              </div>

              {isIOS ? (
                <div className="mt-4 rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">iPhone / iPad tips</div>
                  <div className="mt-3 space-y-2 text-sm text-white/75">
                    <div>- Keep Pathr in the foreground while recording (most reliable).</div>
                    <div>- Add to Home Screen for a more “app-like” experience.</div>
                    <div>- Settings → Privacy &amp; Security → Location Services → Safari Websites → Allow While Using.</div>
                    <div>- Turn off Low Power Mode while recording.</div>
                  </div>
                </div>
              ) : isAndroid ? (
                <div className="mt-4 rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Android tips</div>
                  <div className="mt-3 space-y-2 text-sm text-white/75">
                    <div>- Keep Pathr open while recording (best accuracy).</div>
                    <div>- In Chrome: Site settings → Location → Allow for this site.</div>
                    <div>- Android Settings → Apps → Chrome (or “Pathr” if installed) → Battery → Unrestricted.</div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Tip</div>
                  <div className="mt-2 text-sm text-white/75">Keep Pathr open while recording for the most reliable tracking.</div>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <Button variant="primary" className="h-12 flex-1 rounded-2xl" onClick={onClose} type="button">
                  Got it
                </Button>
              </div>

              <div className="mt-3 text-center text-xs text-white/55">
                TODO: background GPS requires a native app for truly reliable “always-on” tracking.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

