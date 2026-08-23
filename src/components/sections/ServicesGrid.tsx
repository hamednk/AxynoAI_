import { services } from "@/lib/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";

export function ServicesGrid({
  limit,
  showAllLink = false,
  hideHeading = false,
}: {
  limit?: number;
  showAllLink?: boolean;
  hideHeading?: boolean;
}) {
  const list = limit ? services.slice(0, limit) : services;

  return (
    <section id="services" className="relative overflow-hidden bg-surface py-24">
      <div
        className="pointer-events-none absolute inset-y-0 start-1/2 hidden w-px -translate-x-1/2 bg-[var(--axis)] lg:block"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!hideHeading ? (
          <FadeIn>
            <SectionHeading
              eyebrow="SIG · 03 / SERVICES"
              title="خدمات هوش مصنوعی برای کسب‌وکارها"
              subtitle="راهکارهای هوشمند متناسب با نیاز، فرآیند و صنعت شما"
            />
          </FadeIn>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service, i) => (
            <FadeIn key={service.slug} delay={(i % 3) * 0.06}>
              <ServiceCard service={service} />
            </FadeIn>
          ))}
        </div>
        {showAllLink ? (
          <div className="mt-12 flex justify-start">
            <Button href="/services" variant="secondary">
              مشاهده همه خدمات
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
