import { getTranslations } from "next-intl/server";
import { whyUsKeys } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export async function WhyUs() {
  const t = await getTranslations("WhyUs");

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <FadeIn>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      </FadeIn>
      <ol className="space-y-0 border-t border-card-border">
        {whyUsKeys.map((key, i) => (
          <FadeIn key={key} delay={(i % 3) * 0.05}>
            <li className="group grid gap-2 border-b border-card-border py-6 transition hover:bg-card/60 sm:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.4fr)] sm:items-baseline sm:gap-8 sm:py-7">
              <span className="font-mono-signal text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="min-w-0 font-bold text-pretty transition group-hover:text-accent">
                {t(`items.${key}.title`)}
              </h3>
              <p className="min-w-0 text-sm leading-7 text-muted">
                {t(`items.${key}.description`)}
              </p>
            </li>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
