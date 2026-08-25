import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { aboutFeatureKeys, whyUsKeys } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { FinalCTA } from "@/components/sections/FinalCTA";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const tBrief = await getTranslations("AboutBrief");
  const tWhy = await getTranslations("WhyUs");

  return (
    <>
      <section className="hero-bg border-b border-card-border px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            align="start"
          />
          <p className="leading-8 text-muted">{t("body")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-0 border border-card-border sm:grid-cols-3">
          {aboutFeatureKeys.map((key, i) => (
            <FadeIn key={key} delay={i * 0.08}>
              <div
                className={`h-full bg-card p-6 ${
                  i < aboutFeatureKeys.length - 1 ? "sm:border-e sm:border-card-border" : ""
                }`}
              >
                <h2 className="mb-2 text-lg font-semibold">
                  {tBrief(`features.${key}.title`)}
                </h2>
                <p className="text-sm leading-7 text-muted">
                  {tBrief(`features.${key}.description`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("principlesEyebrow")}
            title={t("principlesTitle")}
          />
          <ol className="border-t border-card-border">
            {whyUsKeys.map((key, i) => (
              <li
                key={key}
                className="grid gap-3 border-b border-card-border py-6 sm:grid-cols-[4rem_1fr_1.5fr]"
              >
                <span className="font-mono-signal text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold">{tWhy(`items.${key}.title`)}</h3>
                <p className="text-sm leading-7 text-muted">
                  {tWhy(`items.${key}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
