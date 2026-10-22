import { ArrowRight, MapPin, Phone, Send } from "lucide-react";
import type { Branch } from "@/lib/types";
import { telLink } from "@/lib/utils";
import { EnquireButton } from "../EnquireButton";

export function CtaBand({ branches }: { branches: Branch[] }) {
  const phones = Array.from(new Set(branches.flatMap((b) => b.phones)));
  return (
    <section className="mt-8 bg-gradient-to-r from-brand-green-dark to-brand-green text-white" aria-labelledby="cta-title">
      <div className="container-page flex flex-col items-center gap-5 py-8 text-center lg:flex-row lg:justify-between lg:text-left">
        <div className="flex items-center gap-4">
          <Send className="hidden h-10 w-10 sm:block" aria-hidden />
          <div>
            <h2 id="cta-title" className="text-2xl font-bold sm:text-3xl">Give Your Child the Best Start Today!</h2>
            <p className="text-sm text-white/85">Join the Study Point family and be part of a brighter future.</p>
          </div>
        </div>
        <EnquireButton className="btn-white">Enquire Now <ArrowRight className="h-4 w-4" aria-hidden /></EnquireButton>
        <ul className="space-y-1 text-sm font-semibold">
          <li className="flex items-center justify-center gap-2 lg:justify-start">
            <Phone className="h-4 w-4" aria-hidden />
            {phones.map((p, i) => <span key={p}>{i > 0 && " / "}<a href={telLink(p)} className="hover:underline">{p}</a></span>)}
          </li>
          <li className="flex items-center justify-center gap-2 lg:justify-start">
            <MapPin className="h-4 w-4" aria-hidden /> {branches.map((b) => b.name).join("  |  ")}
          </li>
        </ul>
      </div>
    </section>
  );
}
