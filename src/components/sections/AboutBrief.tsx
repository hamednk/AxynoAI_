import { getLocale, getTranslations } from "next-intl/server";
import { Cpu, Layers, Users } from "lucide-react";
import { aboutFeatureKeys, processStepKeys } from "@/lib/content";
import { serviceMetas } from "@/lib/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { CountUp } from "@/components/ui/CountUp";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const featureIcons = { expertise: Cpu, experience: Layers, team: Users } as const;

export async function AboutBrief() {
  const t = await getTranslations("AboutBrief");
  const tInd = await getTranslations("Industries");
  const locale = await getLocale();
  const industries = (tInd.raw("items") as string[]).length;

  const stats = [
    { key: "services", value: serviceMetas.length },
    { key: "industries", value: industries },
    { key: "steps", value: processStepKeys.length },
  ] as const;

  return (
    <section
      id="about-brief"
      className="relative overflow-hidden py-16 sm:py-24 lg:py-28"
    >
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="section-glow -top-40 start-1/2 -translate-x-1/2" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <FadeIn>
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
              className="mb-0 sm:mb-0"
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-card-border bg-card-border">
              {stats.map((stat) => (
                <div
                  key={stat.key}
                  className="flex flex-col gap-2 bg-card/90 p-4 backdrop-blur sm:p-6"
                >
                  <dt className="order-2 text-[11px] leading-5 text-muted sm:text-xs">
                    {t(`stats.${stat.key}.label`)}
                  </dt>
                  <dd className="order-1">
                    <CountUp
                      to={stat.value}
                      locale={locale}
                      suffix="+"
                      className="stat-number text-3xl sm:text-4xl lg:text-5xl"
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3">
          {aboutFeatureKeys.map((key, i) => {
            const Icon = featureIcons[key];
            return (
              <FadeIn key={key} delay={i * 0.08}>
                <SpotlightCard className="h-full rounded-2xl p-6 sm:p-7">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-card-border bg-accent-soft text-accent">
                      <Icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono-signal text-[10px] text-steel">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-7 text-muted">
                    {t(`features.${key}.description`)}
                  </p>
                </SpotlightCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
