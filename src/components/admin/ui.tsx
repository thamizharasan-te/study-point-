"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

/** Submit button that shows "Saving…" and disables itself while the form is sending. */
export function SubmitButton({ children, className = "btn-green", pendingText = "Saving…" }: { children: ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={clsx(className, "disabled:opacity-60")}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {pending ? pendingText : children}
    </button>
  );
}

/** Submit button that asks "Are you sure?" first — for deletes. */
export function ConfirmButton({ message, children, className = "btn bg-red-600 text-white hover:bg-red-700", ...rest }: { message: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx(className, "disabled:opacity-60")}
      onClick={(e) => { if (!window.confirm(message)) e.preventDefault(); }}
      {...rest}
    >
      {children}
    </button>
  );
}
