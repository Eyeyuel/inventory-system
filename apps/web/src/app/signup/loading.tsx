export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4 rounded-xl border p-6">
        <div className="h-6 w-1/2 animate-pulse rounded bg-zinc-200" />
        <div className="h-10 animate-pulse rounded bg-zinc-200" />
        <div className="h-10 animate-pulse rounded bg-zinc-200" />
        <div className="h-10 animate-pulse rounded bg-zinc-200" />
        <div className="h-10 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
  );
}
