"use client";

/** Friendly fallback if something unexpected breaks while a page renders. */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-cream p-6 text-center">
      <h1 className="text-3xl font-extrabold text-brand-navy">Something went wrong</h1>
      <p className="max-w-md text-gray-700">Please try again. If it keeps happening, call us and we will help you.</p>
      <button type="button" onClick={reset} className="btn-green">Try again</button>
    </main>
  );
}
