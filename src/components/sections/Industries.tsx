import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export async function Industries() {
  const t = await getTranslations("Industries");
  const items = t.raw("items") as string[];
  const loop = [...items, ...items];

  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
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
