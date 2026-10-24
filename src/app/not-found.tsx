import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-cream p-6 text-center">
      <p className="font-script text-5xl text-brand-pink">Oops!</p>
      <h1 className="text-3xl font-extrabold text-brand-navy">We couldn&apos;t find that page</h1>
      <p lang="ta" className="text-xl font-bold text-brand-navy">இந்தப் பக்கம் கிடைக்கவில்லை</p>
      <p className="max-w-md text-gray-700">The page may have moved. Let&apos;s get you back to learning.</p>
      <div className="flex gap-3">
        <Link href="/" className="btn-green">Go to the home page</Link>
        <Link href="/ta" lang="ta" className="btn-outline">முகப்புப் பக்கம்</Link>
      </div>
    </main>
  );
}
