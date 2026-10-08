import { getTranslations } from "next-intl/server";
import {
  Cpu,
  HeartHandshake,
  LineChart,
  Maximize2,
  ShieldCheck,
  Target,
} from "lucide-react";
import { whyUsKeys } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const icons = {
  tailored: Target,
  modern: Cpu,
  results: LineChart,
  scalable: Maximize2,
  security: ShieldCheck,
  support: HeartHandshake,
} as const;

export async function WhyUs() {
  const t = await getTranslations("WhyUs");

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="section-glow -start-60 bottom-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        </FadeIn>
        <div role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyUsKeys.map((key, i) => {
            const Icon = icons[key];
            return (
              <FadeIn key={key} delay={(i % 3) * 0.06}>
                <div role="listitem" className="h-full">
                  <SpotlightCard className="group h-full rounded-2xl p-6 sm:p-7">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="relative flex size-12 items-center justify-center rounded-xl border border-card-border text-accent transition duration-500 group-hover:-rotate-6 group-hover:bg-accent group-hover:text-btn-fg">
                        <Icon className="size-5" strokeWidth={1.6} />
                      </span>
                      <span className="stat-number text-3xl opacity-25 transition group-hover:opacity-60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-pretty transition group-hover:text-accent">
                      {t(`items.${key}.title`)}
                    </h3>
                    <p className="text-sm leading-7 text-muted">
                      {t(`items.${key}.description`)}
                    </p>
                  </SpotlightCard>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
