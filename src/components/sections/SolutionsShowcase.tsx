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
    <section id="solutions" className="bg-surface py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!hideHeading ? (
          <FadeIn>
            <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
          </FadeIn>
        ) : null}
        <div className="space-y-3">
          {list.map((item, i) => (
            <FadeIn key={item.slug} delay={(i % 4) * 0.04}>
              <article className="group grid min-w-0 gap-4 border border-card-border bg-card p-4 transition hover:border-accent/40 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:p-6">
                <div className="flex size-12 items-center justify-center border border-card-border text-accent transition group-hover:border-accent/40 group-hover:bg-accent-soft">
                  <AppIcon name={item.icon} className="size-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-3">
                    <span className="font-mono-signal text-[10px] text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-bold leading-7 text-pretty sm:text-lg">
                      {t(`items.${item.slug}.title`)}
                    </h3>
                  </div>
                  <p className="text-sm leading-7 text-muted">
                    {t(`items.${item.slug}.description`)}
                  </p>
                </div>
                <Link
                  href="/solutions"
                  className="inline-flex items-center gap-2 text-sm text-accent hover:gap-3"
                >
                  {t("details")}
                  <ArrowLeft className="hidden size-4 rtl:inline" />
                  <ArrowRight className="size-4 rtl:hidden" />
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
        {limit ? (
          <div className="mt-10 flex justify-start">
            <Button href="/solutions" variant="secondary" className="w-full sm:w-auto">
              {t("viewAll")}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
