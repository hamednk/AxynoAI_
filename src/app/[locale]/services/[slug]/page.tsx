import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getServiceMetaBySlug, serviceMetas } from "@/lib/services";
import { AppIcon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceMetas.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });
  const meta = getServiceMetaBySlug(slug);
  if (!meta) return { title: t("notFound") };
  return {
    title: t(`items.${slug}.title`),
    description: t(`items.${slug}.short`),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Services");
  const service = getServiceMetaBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <section className="hero-bg border-b border-card-border">
        <div className="mx-auto max-w-4xl min-w-0 px-4 pt-24 pb-14 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
          <div className="mb-6 flex size-14 items-center justify-center border border-card-border bg-card text-accent">
            <AppIcon name={service.icon} className="size-7" strokeWidth={1.5} />
          </div>
          <p className="font-mono-signal mb-3 text-[10px] tracking-[0.2em] text-steel uppercase">
            {t("detailEyebrow")}
          </p>
          <h1 className="font-display text-2xl font-extrabold text-balance sm:text-3xl lg:text-4xl">
            {t(`items.${slug}.title`)}
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">
            {t(`items.${slug}.short`)}
          </p>
          <p className="mt-6 text-base leading-8 text-foreground/90">
            {t(`items.${slug}.description`)}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" className="w-full sm:w-auto">{t("consult")}</Button>
            <Button href="/services" variant="secondary" className="w-full sm:w-auto">
              {t("allServices")}
            </Button>
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
