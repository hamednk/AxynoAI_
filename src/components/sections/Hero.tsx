"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AxisField } from "@/components/visuals/AxisField";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="hero-bg relative min-h-[100svh] overflow-hidden">
      {/* Full-bleed visual plane */}
      <div className="absolute inset-0">
        <AxisField />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-background/90 via-background/55 to-transparent" />
        {!reduce ? (
          <div className="signal-sweep pointer-events-none absolute inset-y-0 start-0 w-1/3 bg-gradient-to-l from-transparent via-[var(--scan)] to-transparent opacity-40 mix-blend-multiply dark:mix-blend-screen" />
        ) : null}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:justify-center lg:px-8 lg:pb-24 lg:pt-20">
        <motion.p
          className="font-mono-signal mb-5 text-[11px] text-steel"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          SIG · 01 / INTELLIGENCE ON AXIS
        </motion.p>

        {/* Brand as hero-level monument */}
        <motion.h1
          className="brand-monument text-[clamp(3.4rem,14vw,9.5rem)] text-foreground"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Axyno
          <span className="text-accent">AI</span>
        </motion.h1>

        <motion.p
          className="mt-2 font-display text-xl font-bold text-ink-soft sm:text-2xl"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          اکسینو AI
        </motion.p>

        <motion.p
          className="mt-6 max-w-lg text-base leading-8 text-muted sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14 }}
        >
          هوش مصنوعی را روی محور کسب‌وکار خود بنشانید — از ایده تا سامانهٔ زنده.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
        >
          <Button href="/contact">دریافت مشاوره رایگان</Button>
          <Button href="/services" variant="secondary">
            مشاهده خدمات
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
