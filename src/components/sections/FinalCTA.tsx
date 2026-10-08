import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { OpenChatButton } from "@/components/chat/OpenChatButton";

export async function FinalCTA() {
  const t = await getTranslations("FinalCTA");

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <FadeIn>
        <div className="cta-bg relative mx-auto max-w-7xl overflow-hidden rounded-3xl px-5 py-14 text-white sm:px-12 sm:py-20 nebula-glow">
          <div className="aurora" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,#000_10%,transparent_70%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -end-24 top-1/2 size-80 -translate-y-1/2 rounded-full border border-white/10 sm:size-[28rem]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -end-10 top-1/2 size-56 -translate-y-1/2 rounded-full border border-white/10 sm:size-80"
            aria-hidden
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="font-mono-signal mb-5 text-[10px] tracking-[0.22em] text-white/50 uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="font-display text-2xl font-extrabold text-balance sm:text-4xl lg:text-5xl lg:leading-[1.35]">
              {t("title")}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/70 sm:text-base">
              {t("subtitle")}
            </p>
            <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <MagneticButton className="w-full sm:w-auto">
                <Button
                  href="/contact"
                  variant="light"
                  className="min-h-12 w-full sm:w-auto sm:px-8"
                >
                  {t("ctaPrimary")}
                </Button>
              </MagneticButton>
              <OpenChatButton
                label={t("askAssistant")}
                className="w-full border border-white/25 text-white backdrop-blur hover:border-white/60 hover:bg-white/10 sm:w-auto"
              />
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
