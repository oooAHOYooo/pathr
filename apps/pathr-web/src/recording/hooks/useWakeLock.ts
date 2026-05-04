import { useEffect, useRef } from "react";

export function useWakeLock(isActive: boolean) {
  const wakeLockRef = useRef<any>(null);

  const requestWakeLock = async () => {
    try {
      const wl = (navigator as any)?.wakeLock;
      if (!wl?.request) return;
      if (wakeLockRef.current?.release) await wakeLockRef.current.release();
      wakeLockRef.current = await wl.request("screen");
    } catch {
      // Some browsers don't support wake lock; ignore.
    }
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current?.release) await wakeLockRef.current.release();
    } catch {
      // ignore
    } finally {
      wakeLockRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive) void requestWakeLock();
    else void releaseWakeLock();
  }, [isActive]);

  return { requestWakeLock, releaseWakeLock };
}
