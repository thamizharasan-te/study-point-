"use client";

import type { ReactNode } from "react";
import { useEnquiry } from "./EnquiryProvider";

/** Any "Enquire Now" button — opens the enquiry pop-up. */
export function EnquireButton({ className = "btn-pink", children }: { className?: string; children?: ReactNode }) {
  const { open } = useEnquiry();
  return (
    <button type="button" className={className} onClick={open}>
      {children ?? "Enquire Now"}
    </button>
  );
}
