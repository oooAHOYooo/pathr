export function TopNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b bg-paper">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold tracking-tight">Pathr</div>
        </div>

        <div className="flex items-center gap-3">
          <div
            aria-label="Account"
            className="h-9 w-9 rounded-full border bg-white shadow-soft"
            role="img"
          />
        </div>
      </div>
    </header>
  );
}

