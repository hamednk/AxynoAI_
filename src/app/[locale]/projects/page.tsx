import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { solutionMetas } from "@/lib/content";
import { AppIcon } from "@/lib/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { FinalCTA } from "@/components/sections/FinalCTA";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Projects");
  const tSol = await getTranslations("Solutions");

  return (
    <>
      <div className="hero-bg border-b border-card-border px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            align="start"
          />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {solutionMetas.map((item, i) => (
            <FadeIn key={item.slug} delay={(i % 4) * 0.04}>
              <article className="group grid gap-4 border border-card-border bg-card p-5 sm:grid-cols-[4rem_1fr] sm:items-center sm:gap-6 sm:p-6">
                <div className="flex size-14 items-center justify-center border border-card-border text-accent transition group-hover:border-accent/40 group-hover:bg-accent-soft">
                  <AppIcon name={item.icon} className="size-6" strokeWidth={1.25} />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-3">
                    <span className="font-mono-signal text-[10px] text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-lg font-semibold">
                      {tSol(`items.${item.slug}.title`)}
                    </h2>
                  </div>
                  <p className="text-sm leading-7 text-muted">
                    {tSol(`items.${item.slug}.description`)}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
