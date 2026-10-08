import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { Marquee } from "@/components/ui/Marquee";

function Chip({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-3 rounded-full border border-card-border bg-card/80 px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-foreground shadow-[var(--shadow-card)] backdrop-blur transition hover:border-accent/50 hover:text-accent sm:px-6 sm:py-3 sm:text-base">
      <span className="inline-block size-1.5 rotate-45 bg-accent" aria-hidden />
      {name}
    </span>
  );
}

export async function Industries() {
  const t = await getTranslations("Industries");
  const items = t.raw("items") as string[];
  const half = Math.ceil(items.length / 2);
  const rowA = items.slice(0, half);
  const rowB = items.slice(half);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" />
        </FadeIn>
      </div>

      <div className="space-y-4">
        <Marquee duration={38} gap="0.875rem">
          {rowA.map((name) => (
            <Chip key={name} name={name} />
          ))}
        </Marquee>
        <Marquee duration={44} gap="0.875rem" reverse>
          {rowB.map((name) => (
            <Chip key={name} name={name} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
