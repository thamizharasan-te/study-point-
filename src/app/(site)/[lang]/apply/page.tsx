import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { PageHero } from "@/components/PageHero";
import { getSiteData } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { localize } from "@/lib/i18n/localize";
import { pageMeta } from "@/lib/i18n/meta";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang).apply;
  return pageMeta(lang, "/apply", t.metaTitle, t.metaDescription);
}

export default async function ApplyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const a = getDict(lang).apply;
  const raw = await getSiteData();
  const { branches, images } = localize(raw, lang);
  const options = raw.branches.map((b, i) => ({ value: b.name, label: branches[i].display_name ?? b.name }));
  return (
    <>
      <PageHero tone="pink" title={a.title} subtitle={a.subtitle} />
      <section className="container-page py-8 sm:py-10" aria-labelledby="apply-heading">
        <div className="mx-auto max-w-3xl space-y-6">
          {images.applicationPdf && (
            <div className="flex flex-col items-start gap-3 rounded-3xl bg-brand-navy-soft p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-extrabold text-brand-navy">{a.pdfTitle}</p>
                <p className="text-sm text-gray-700">{a.pdfText}</p>
              </div>
              <a href={images.applicationPdf} target="_blank" rel="noopener noreferrer" download className="btn-navy shrink-0">
                <Download className="h-4 w-4" aria-hidden /> {a.pdfButton}
              </a>
            </div>
          )}
          <div className="rounded-3xl bg-white p-5 shadow-card sm:p-8">
            <h2 id="apply-heading" className="text-2xl font-extrabold text-brand-navy">{a.formTitle}</h2>
            <p className="mb-5 mt-1 text-gray-600">{a.formText}</p>
            <ApplicationForm branches={options} />
          </div>
        </div>
      </section>
    </>
  );
}
