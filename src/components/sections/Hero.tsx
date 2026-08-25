"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { AxisField } from "@/components/visuals/AxisField";
import { LogoMark } from "@/components/brand/LogoMark";

export function Hero() {
  const reduce = useReducedMotion();
  const t = useTranslations("Hero");

  return (
    <section className="hero-bg relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AxisField />
        <div className="hero-streaks" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-background/50 via-background/15 to-transparent dark:from-background/45 dark:via-background/10" />
        {!reduce ? (
          <div className="signal-sweep pointer-events-none absolute inset-y-0 start-0 w-1/3 bg-gradient-to-l from-transparent via-[var(--scan)] to-transparent opacity-45 mix-blend-screen" />
        ) : null}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:justify-center lg:px-8 lg:pb-24 lg:pt-20">
        <motion.div
          className="mb-5"
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55 }}
        >
        </motion.div>

        <motion.p
          className="font-mono-signal mb-4 text-[11px] text-steel"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("eyebrow")}
        </motion.p>

        <motion.h1
          className="brand-hero-title text-[clamp(1.7rem,5vw,3.4rem)]"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          AxynoAI
        </motion.h1>

        <motion.p
          className="mt-3 font-display text-lg font-bold text-ink-soft sm:text-xl"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          {t("nameFa")}
        </motion.p>

        <motion.p
          className="mt-5 max-w-lg text-base leading-8 text-muted sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14 }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
        >
          <Button href="/contact">{t("ctaPrimary")}</Button>
          <Button href="/services" variant="secondary">
            {t("ctaSecondary")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
