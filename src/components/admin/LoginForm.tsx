"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const { error } = await createBrowserSupabase().auth.signInWithPassword({
      email: String(fd.get("email")).trim().toLowerCase(),
      password: String(fd.get("password")),
    });
    if (error) {
      setError("Wrong email or password. Please try again.");
      setBusy(false);
      return;
    }
    // The middleware checks the allow-list and sends non-admins back here.
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" required autoComplete="username" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      <button type="submit" className="btn-navy w-full" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Sign in
      </button>
    </form>
  );
}
