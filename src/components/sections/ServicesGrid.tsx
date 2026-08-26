import { getTranslations } from "next-intl/server";
import { serviceMetas } from "@/lib/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";

export async function ServicesGrid({
  limit,
  showAllLink = false,
  hideHeading = false,
}: {
  limit?: number;
  showAllLink?: boolean;
  hideHeading?: boolean;
}) {
  const t = await getTranslations("Services");
  const list = limit ? serviceMetas.slice(0, limit) : serviceMetas;

  return (
    <section id="services" className="relative overflow-hidden bg-surface py-14 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-y-0 start-1/2 hidden w-px -translate-x-1/2 bg-[var(--axis)] lg:block"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!hideHeading ? (
          <FadeIn>
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
            />
          </FadeIn>
        ) : null}
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service, i) => (
            <FadeIn key={service.slug} delay={(i % 3) * 0.06}>
              <ServiceCard
                service={service}
                title={t(`items.${service.slug}.title`)}
                short={t(`items.${service.slug}.short`)}
                viewLabel={t("viewSolution")}
              />
            </FadeIn>
          ))}
        </div>
        {showAllLink ? (
          <div className="mt-10 flex justify-start sm:mt-12">
            <Button href="/services" variant="secondary" className="w-full sm:w-auto">
              {t("viewAll")}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
