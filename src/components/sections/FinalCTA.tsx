import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export async function FinalCTA() {
  const t = await getTranslations("FinalCTA");

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <FadeIn>
        <div className="cta-bg relative mx-auto max-w-7xl overflow-hidden px-5 py-12 text-white sm:px-12 sm:py-16 axis-cut nebula-glow">
          <div
            className="pointer-events-none absolute inset-y-0 start-[18%] w-px bg-white/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -end-20 top-1/2 size-72 -translate-y-1/2 rounded-full border border-white/10"
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <p className="font-mono-signal mb-4 text-[10px] tracking-[0.22em] text-white/40 uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="font-display text-2xl font-extrabold text-balance sm:text-3xl lg:text-[2.15rem] lg:leading-[1.45]">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/65 sm:text-base sm:leading-8">
              {t("subtitle")}
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
              <Button
                href="/contact"
                className="w-full bg-accent text-btn-fg hover:bg-accent-bright sm:w-auto"
              >
                {t("ctaPrimary")}
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                className="w-full border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/5 hover:text-white sm:w-auto"
              >
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
