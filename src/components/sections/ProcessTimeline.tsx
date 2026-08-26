import { getTranslations } from "next-intl/server";
import { processStepKeys } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export async function ProcessTimeline() {
  const t = await getTranslations("Process");

  return (
    <section className="overflow-hidden bg-navy-deep py-14 text-[#e8ecf2] sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            className="[&_h2]:text-white [&_p]:text-white/55 [&_span]:bg-accent-bright"
          />
        </FadeIn>

        <div className="relative mt-4">
          <div
            className="pointer-events-none absolute top-5 start-0 end-0 hidden h-px bg-white/15 md:block"
            aria-hidden
          />
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {processStepKeys.map((step, i) => (
              <FadeIn key={step} delay={i * 0.06}>
                <li className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="relative z-10 flex size-10 items-center justify-center border border-accent-bright/50 bg-navy-deep font-mono-signal text-xs text-accent-bright">
                      {step}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold text-white">
                    {t(`steps.${step}.title`)}
                  </h3>
                  <p className="text-sm leading-7 text-white/50">
                    {t(`steps.${step}.description`)}
                  </p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
