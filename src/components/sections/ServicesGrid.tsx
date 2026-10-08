import { getTranslations } from "next-intl/server";
import { serviceMetas } from "@/lib/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** Bento layout: featured tiles span 2 columns on large screens. */
const featuredSlugs = new Set(["ai-chatbot", "ai-crm"]);

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
  const ordered = [
    ...list.filter((s) => featuredSlugs.has(s.slug)),
    ...list.filter((s) => !featuredSlugs.has(s.slug)),
  ];

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-surface py-16 sm:py-24 lg:py-28"
    >
      <div className="section-glow -end-60 top-20" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!hideHeading ? (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <FadeIn>
              <SectionHeading
                eyebrow={t("eyebrow")}
                title={t("title")}
                subtitle={t("subtitle")}
              />
            </FadeIn>
            {showAllLink ? (
              <FadeIn delay={0.1} className="hidden sm:mb-12 sm:block">
                <Button href="/services" variant="secondary">
                  {t("viewAll")}
                </Button>
              </FadeIn>
            ) : null}
          </div>
        ) : null}

        <div className="grid min-w-0 gap-4 lg:auto-rows-fr sm:grid-cols-2 lg:grid-cols-4">
          {ordered.map((service, i) => {
            const featured = featuredSlugs.has(service.slug);
            return (
              <FadeIn
                key={service.slug}
                delay={(i % 4) * 0.05}
                className={cn(featured && "sm:col-span-2 lg:row-span-1")}
              >
                <ServiceCard
                  service={service}
                  index={i}
                  featured={featured}
                  title={t(`items.${service.slug}.title`)}
                  short={
                    featured
                      ? t(`items.${service.slug}.description`)
                      : t(`items.${service.slug}.short`)
                  }
                  viewLabel={t("viewSolution")}
                />
              </FadeIn>
            );
          })}
        </div>

        {showAllLink ? (
          <div className="mt-8 sm:hidden">
            <Button href="/services" variant="secondary" className="min-h-12 w-full">
              {t("viewAll")}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
