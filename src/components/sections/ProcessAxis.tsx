"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

type Step = { key: string; title: string; description: string };

export function ProcessAxis({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative space-y-4 ps-12 sm:ps-16">
      <span
        className="process-axis-track absolute inset-y-2 start-5 w-px sm:start-7"
        aria-hidden
      />
      <motion.span
        className="process-axis-fill absolute inset-y-2 start-5 w-px sm:start-7"
        style={{ scaleY: reduce ? 1 : fill }}
        aria-hidden
      />
      {steps.map((step, i) => (
        <motion.li
          key={step.key}
          className="group relative"
          initial={reduce ? false : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="absolute -start-12 top-5 flex size-10 items-center justify-center rounded-full border border-accent-bright/40 bg-navy-deep font-mono-signal text-xs text-accent-bright sm:-start-16 sm:size-14 sm:text-sm"
            initial={reduce ? false : { scale: 0.6, opacity: 0.4 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <span className="absolute inset-0 rounded-full shadow-[0_0_24px_-4px_var(--accent-bright)] opacity-0 transition group-hover:opacity-100" />
            {step.key}
          </motion.span>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition duration-500 group-hover:border-accent-bright/40 group-hover:bg-white/[0.06] sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-base font-bold text-white sm:text-lg">
                {step.title}
              </h3>
              <span className="h-px flex-1 bg-gradient-to-r from-accent-bright/40 to-transparent rtl:bg-gradient-to-l" />
              <span className="font-mono-signal text-[10px] text-white/30">
                {String(i + 1).padStart(2, "0")}/{String(steps.length).padStart(2, "0")}
              </span>
            </div>
            <p className="text-sm leading-7 text-white/60">{step.description}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
