import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, services } from "@/lib/services";
import { AppIcon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "خدمت یافت نشد" };
  return {
    title: service.title,
    description: service.short,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <section className="hero-bg border-b border-card-border">
        <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex size-14 items-center justify-center border border-card-border bg-card text-accent">
            <AppIcon name={service.icon} className="size-7" strokeWidth={1.5} />
          </div>
          <p className="font-mono-signal mb-3 text-[10px] tracking-[0.2em] text-steel uppercase">
            SERVICE DETAIL
          </p>
          <h1 className="font-display text-3xl font-extrabold text-balance sm:text-4xl">
            {service.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">{service.short}</p>
          <p className="mt-6 text-base leading-8 text-foreground/90">
            {service.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact">دریافت مشاوره</Button>
            <Button href="/services" variant="secondary">
              همه خدمات
            </Button>
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
