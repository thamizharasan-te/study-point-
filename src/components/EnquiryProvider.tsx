"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";

const Ctx = createContext<{ open: () => void }>({ open: () => {} });
export const useEnquiry = () => useContext(Ctx);

/** Holds the "Enquire Now" pop-up so any button on any page can open it. */
export function EnquiryProvider({ branches, children }: { branches: string[]; children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("input:not([tabindex='-1']), select, textarea")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialogRef.current) {
        // Keep keyboard focus inside the dialog.
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button, input:not([tabindex='-1']), select, textarea, a[href]");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="enquiry-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-card sm:max-w-xl sm:rounded-3xl sm:p-7">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="enquiry-title" className="text-2xl font-bold text-brand-navy">Enquire Now</h2>
                <p className="text-sm text-gray-600">Tell us a little and we&apos;ll get back to you.</p>
              </div>
              <button type="button" onClick={close} aria-label="Close enquiry form" className="rounded-full p-2 hover:bg-gray-100">
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>
            <EnquiryForm branches={branches} />
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
