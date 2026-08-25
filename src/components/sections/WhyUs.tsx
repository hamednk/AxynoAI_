import { getTranslations } from "next-intl/server";
import { whyUsKeys } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export async function WhyUs() {
  const t = await getTranslations("WhyUs");

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <FadeIn>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      </FadeIn>
      <ol className="space-y-0 border-t border-card-border">
        {whyUsKeys.map((key, i) => (
          <FadeIn key={key} delay={(i % 3) * 0.05}>
            <li className="group grid gap-4 border-b border-card-border py-7 transition hover:bg-card/60 sm:grid-cols-[5rem_1fr_1.4fr] sm:items-baseline sm:gap-8">
              <span className="font-mono-signal text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-bold transition group-hover:text-accent">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm leading-7 text-muted">
                {t(`items.${key}.description`)}
              </p>
            </li>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
