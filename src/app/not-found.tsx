import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-cream p-6 text-center">
      <p className="font-script text-5xl text-brand-pink">Oops!</p>
      <h1 className="text-3xl font-extrabold text-brand-navy">We couldn&apos;t find that page</h1>
      <p className="max-w-md text-gray-700">The page may have moved. Let&apos;s get you back to learning.</p>
      <Link href="/" className="btn-green">Go to the home page</Link>
    </main>
  );
}
