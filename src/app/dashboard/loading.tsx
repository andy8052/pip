export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-zinc-800" />
      <div className="h-4 w-80 animate-pulse rounded bg-zinc-800" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900"
          />
        ))}
      </div>
    </div>
  );
}
