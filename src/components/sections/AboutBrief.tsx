import { getTranslations } from "next-intl/server";
import { aboutFeatureKeys } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export async function AboutBrief() {
  const t = await getTranslations("AboutBrief");

  return (
    <section id="about-brief" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <FadeIn>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </FadeIn>
      <div className="grid gap-0 border border-card-border sm:grid-cols-3">
        {aboutFeatureKeys.map((key, i) => (
          <FadeIn key={key} delay={i * 0.08}>
            <div
              className={`relative h-full bg-card p-7 ${
                i < aboutFeatureKeys.length - 1 ? "sm:border-e sm:border-card-border" : ""
              }`}
            >
              <span className="font-mono-signal absolute start-7 top-5 text-[10px] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 mb-2 text-lg font-bold">
                {t(`features.${key}.title`)}
              </h3>
              <p className="text-sm leading-7 text-muted">
                {t(`features.${key}.description`)}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
