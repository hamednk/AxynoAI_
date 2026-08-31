"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { AxisField } from "@/components/visuals/AxisField";

const AndromedaField = dynamic(
  () =>
    import("@/components/visuals/AndromedaField").then(
      (module) => module.AndromedaField,
    ),
  { ssr: false },
);

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const reduce = useReducedMotion();
  const t = useTranslations("Hero");
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.56, 0.88, 1],
    [1, 1, 0.32, 0],
  );
  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    [1, 1.015, 1.055],
  );
  const handleSceneReady = useCallback(() => setSceneReady(true), []);
  const handleSceneUnavailable = useCallback(() => setSceneReady(false), []);

  return (
    <section
      ref={heroRef}
      className={`hero-bg relative isolate min-h-[100svh] overflow-hidden ${
        sceneReady ? "hero-3d-ready" : ""
      }`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 origin-center"
        style={{ opacity: backgroundOpacity, scale: backgroundScale }}
      >
        {!sceneReady ? (
          <div className="hero-fallback-field absolute inset-0">
            <AxisField />
          </div>
        ) : null}
        <AndromedaField
          className={`andromeda-field absolute inset-0 transition-opacity duration-1000 ${
            sceneReady ? "opacity-100" : "opacity-0"
          }`}
          reducedMotion={Boolean(reduce)}
          onReady={handleSceneReady}
          onUnavailable={handleSceneUnavailable}
        />
        <div className="hero-copy-shade absolute inset-0" aria-hidden />
        {!reduce ? (
          <div className="signal-sweep absolute inset-y-0 start-0 w-1/4 bg-gradient-to-l from-transparent via-[var(--scan)] to-transparent opacity-20 mix-blend-screen" />
        ) : null}
      </motion.div>
      <div
        className="hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 z-[7]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl min-w-0 flex-col justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:justify-center lg:px-8 lg:pb-24 lg:pt-20">
        <motion.p
          className="font-mono-signal mb-3 text-[10px] text-steel sm:mb-4 sm:text-[11px]"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("eyebrow")}
        </motion.p>

        <motion.h1
          className="brand-hero-title text-[clamp(1.35rem,7.2vw,3.4rem)]"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          AxynoAI
        </motion.h1>

        <motion.p
          className="mt-3 font-display text-base font-bold text-ink-soft sm:text-lg md:text-xl"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          {t("nameFa")}
        </motion.p>

        <motion.p
          className="mt-4 max-w-lg text-sm leading-7 text-muted sm:mt-5 sm:text-base sm:leading-8 lg:text-lg"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14 }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="mt-7 flex w-full max-w-lg flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:flex-wrap"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
        >
          <Button href="/contact" className="w-full sm:w-auto">
            {t("ctaPrimary")}
          </Button>
          <Button href="/services" variant="secondary" className="w-full sm:w-auto">
            {t("ctaSecondary")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
