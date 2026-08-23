import { industries } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export function Industries() {
  const loop = [...industries, ...industries];

  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="SIG · 06 / INDUSTRIES"
            title="هوش مصنوعی محدود به یک صنعت نیست"
          />
        </FadeIn>
      </div>

      <div className="relative border-y border-card-border bg-card py-5">
        <div className="ticker-track flex w-max gap-0">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="flex items-center gap-6 px-6 text-sm font-semibold whitespace-nowrap text-foreground sm:text-base"
            >
              {name}
              <span className="inline-block size-1.5 rotate-45 bg-accent" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
