import type { Metadata } from "next";
import { BranchCard } from "@/components/BranchCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us — Point Pedro & Vathiry",
  description: "Contact Study Point: addresses, phone numbers, opening hours and maps for our Point Pedro and Vathiry branches, plus an online enquiry form.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { branches } = await getSiteData();
  return (
    <>
      <PageHero title="Contact Us" subtitle="We would love to hear from you. Visit a branch, call, WhatsApp or send an enquiry." />
      <section className="container-page grid gap-6 py-10 lg:grid-cols-2">
        {branches.map((b) => <BranchCard key={b.id} branch={b} />)}
      </section>
      <section className="container-page pb-12" aria-labelledby="enquiry-heading">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow-card sm:p-8">
          <h2 id="enquiry-heading" className="text-2xl font-extrabold text-brand-navy">Send us an enquiry</h2>
          <p className="mb-5 mt-1 text-gray-600">Fill in the form and we will contact you.</p>
          <EnquiryForm branches={branches.map((b) => b.name)} />
        </div>
      </section>
    </>
  );
}
