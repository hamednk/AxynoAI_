import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { solutionMetas } from "@/lib/content";
import { AppIcon } from "@/lib/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";

export async function SolutionsShowcase({
  limit,
  hideHeading = false,
}: {
  limit?: number;
  hideHeading?: boolean;
}) {
  const t = await getTranslations("Solutions");
  const list = limit ? solutionMetas.slice(0, limit) : solutionMetas;

  return (
    <section id="solutions" className="relative overflow-hidden bg-surface py-16 sm:py-24 lg:py-28">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!hideHeading ? (
          <FadeIn>
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
            />
          </FadeIn>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item, i) => (
            <FadeIn key={item.slug} delay={(i % 3) * 0.05}>
              <Link
                href="/solutions"
                className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-card-border bg-card p-5 transition duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[var(--shadow-card-hover)] sm:p-6"
              >
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-accent-bright to-transparent transition duration-700 group-hover:scale-x-100"
                  aria-hidden
                />
                <div className="mb-5 flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-card-border text-accent transition duration-500 group-hover:border-accent/40 group-hover:bg-accent-soft group-hover:shadow-[0_0_24px_-8px_var(--glow)]">
                    <AppIcon name={item.icon} className="size-5" strokeWidth={1.5} />
                  </span>
                  <span className="font-mono-signal text-[10px] text-steel">
                    SOL · {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold leading-7 text-pretty sm:text-lg">
                  {t(`items.${item.slug}.title`)}
                </h3>
                <p className="flex-1 text-sm leading-7 text-muted">
                  {t(`items.${item.slug}.description`)}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all group-hover:gap-3">
                  {t("details")}
                  <ArrowLeft className="hidden size-4 rtl:inline" />
                  <ArrowRight className="size-4 rtl:hidden" />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
        {limit ? (
          <div className="mt-10 flex justify-center">
            <Button href="/solutions" variant="secondary" className="min-h-12 w-full sm:w-auto">
              {t("viewAll")}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
