import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <div className="mb-5 flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14" />
          <h1 className="mt-2 text-2xl font-extrabold text-brand-navy">Study Point Admin</h1>
          <p className="text-sm text-gray-600">Sign in to manage the website</p>
        </div>

        {!isSupabaseConfigured() ? (
          <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            Supabase is not connected yet. Add the environment variables described in the README, then reload this page.
          </p>
        ) : (
          <>
            {error === "not-allowed" && (
              <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                This account is not allowed to use the admin area.
              </p>
            )}
            <LoginForm />
          </>
        )}
        <p className="mt-5 text-center text-sm"><Link href="/" className="text-brand-navy underline">← Back to website</Link></p>
      </div>
    </main>
  );
}
