import type { Program } from "@/lib/types";
import { ProgramIcon } from "./ProgramIcon";

/** Grid of programme cards (title + description) for the Nursery and Classes pages. */
export function ProgramList({ items, accent }: { items: Program[]; accent: "pink" | "navy" }) {
  const iconColor = accent === "pink" ? "bg-brand-pink-soft text-brand-pink" : "bg-brand-navy-soft text-brand-navy";
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <li key={p.title} className="rounded-2xl bg-white p-5 shadow-card">
          <span className={`flex h-12 w-12 items-center justify-center rounded-full ${iconColor}`}>
            <ProgramIcon title={p.title} className="h-6 w-6" />
          </span>
          <h3 className="mt-3 text-xl font-bold text-brand-navy">{p.title}</h3>
          <p className="mt-1 text-gray-700">{p.description}</p>
        </li>
      ))}
    </ul>
  );
}
