"use client";

import type { ReactNode } from "react";
import { useEnquiry } from "./EnquiryProvider";
import { useLang } from "./LangProvider";

/** Any "Enquire Now" button — opens the enquiry pop-up. */
export function EnquireButton({ className = "btn-pink", children }: { className?: string; children?: ReactNode }) {
  const { open } = useEnquiry();
  const { t } = useLang();
  return (
    <button type="button" className={className} onClick={open}>
      {children ?? t.nav.enquire}
    </button>
  );
}
