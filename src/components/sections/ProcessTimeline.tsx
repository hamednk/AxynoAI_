import { getTranslations } from "next-intl/server";
import { processStepKeys } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProcessAxis } from "@/components/sections/ProcessAxis";

export async function ProcessTimeline() {
  const t = await getTranslations("Process");
  const steps = processStepKeys.map((key) => ({
    key,
    title: t(`steps.${key}.title`),
    description: t(`steps.${key}.description`),
  }));

  return (
    <section className="relative overflow-hidden bg-navy-deep py-16 text-[#e8ecf2] sm:py-24 lg:py-28">
      <div className="aurora opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            className="max-w-2xl [&_h2]:text-white [&_p]:text-white/55 [&_span]:bg-accent-bright"
          />
        </FadeIn>
        <div className="mx-auto max-w-3xl">
          <ProcessAxis steps={steps} />
        </div>
      </div>
    </section>
  );
}
