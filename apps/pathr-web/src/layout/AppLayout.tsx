import type { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { FloatingControls } from "../components/FloatingControls";
import { TopNav } from "../components/TopNav";

type Props = PropsWithChildren<{
  showControls?: boolean;
}>;

export function AppLayout({ showControls = true, children }: Props) {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <TopNav />

      <main className="mx-auto min-h-[100dvh] max-w-6xl px-4 pb-28 pt-16">
        {children ?? <Outlet />}
      </main>

      {showControls ? <FloatingControls /> : null}
    </div>
  );
}

