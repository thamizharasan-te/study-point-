import { ClipboardList, GraduationCap, MessageCircle, School } from "lucide-react";
import { EnquireButton } from "../EnquireButton";

// General steps only — no fees, dates or promises. Review wording with the client.
const STEPS = [
  { icon: ClipboardList, title: "Send an enquiry", text: "Fill in the short form, call or WhatsApp us." },
  { icon: MessageCircle, title: "We get in touch", text: "We answer your questions and suggest the right programme." },
  { icon: School, title: "Visit your nearest branch", text: "Meet our teachers and see the classroom." },
  { icon: GraduationCap, title: "Start learning", text: "Your child joins and begins a happy learning journey." },
];

export function HowToJoin() {
  return (
    <section className="container-page reveal py-10" aria-labelledby="join-title">
      <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-brand-navy">Getting started</p>
      <h2 id="join-title" className="mt-1 text-center text-3xl font-extrabold text-brand-navy sm:text-4xl">How to Join Study Point</h2>
      <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="lift relative rounded-3xl bg-white p-6 text-center shadow-card">
            <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-brand-pink text-sm font-extrabold text-white" aria-hidden>{i + 1}</span>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-soft text-brand-green"><Icon className="h-7 w-7" aria-hidden /></span>
            <h3 className="mt-3 text-lg font-bold text-brand-navy"><span className="sr-only">Step {i + 1}: </span>{title}</h3>
            <p className="mt-1 text-sm text-gray-700">{text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-7 text-center"><EnquireButton /></div>
    </section>
  );
}
