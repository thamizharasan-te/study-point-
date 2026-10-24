import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BranchCard } from "@/components/BranchCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { getSiteData } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { localize } from "@/lib/i18n/localize";
import { pageMeta } from "@/lib/i18n/meta";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang).pages.contact;
  return pageMeta(lang, "/contact", t.metaTitle, t.metaDescription);
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const p = getDict(lang).pages.contact;
  const raw = await getSiteData();
  const { branches } = localize(raw, lang);
  const options = raw.branches.map((b, i) => ({ value: b.name, label: branches[i].display_name ?? b.name }));
  return (
    <>
      <PageHero title={p.title} subtitle={p.subtitle} />
      <section className="container-page grid gap-6 py-10 lg:grid-cols-2">
        {branches.map((b) => <BranchCard key={b.id} branch={b} lang={lang} />)}
      </section>
      <section className="container-page pb-12" aria-labelledby="enquiry-heading">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow-card sm:p-8">
          <h2 id="enquiry-heading" className="text-2xl font-extrabold text-brand-navy">{p.formTitle}</h2>
          <p className="mb-5 mt-1 text-gray-600">{p.formText}</p>
          <EnquiryForm branches={options} />
        </div>
      </section>
    </>
  );
}
