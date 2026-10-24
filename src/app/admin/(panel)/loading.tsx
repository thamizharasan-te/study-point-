/** Shown instantly while an admin page loads, so a tap feels responsive. */
export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="animate-pulse space-y-4">
      <div className="h-8 w-1/3 rounded-lg bg-gray-200" />
      <div className="h-24 rounded-2xl bg-gray-200" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="h-20 rounded-2xl bg-gray-200" />)}
      </div>
    </div>
  );
}
