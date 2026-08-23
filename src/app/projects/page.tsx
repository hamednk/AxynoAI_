import type { Metadata } from "next";
import { solutions } from "@/lib/content";
import { AppIcon } from "@/lib/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "پروژه‌ها و نمونه‌راهکارها",
  description:
    "نمونه‌های مفهومی راهکارهای هوش مصنوعی که می‌توانیم برای کسب‌وکار شما پیاده‌سازی کنیم.",
};

export default function ProjectsPage() {
  return (
    <>
      <div className="hero-bg border-b border-card-border px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="SIG · PROJECTS"
            title="نمونه‌راهکارها و پروژه‌های مفهومی"
            subtitle="تا زمان انتشار کیس‌استادی‌های واقعی، نمونه‌های زیر نشان‌دهنده نوع راهکارهایی هستند که می‌سازیم."
            align="start"
          />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {solutions.map((item, i) => {
            return (
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
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                    </div>
                    <p className="text-sm leading-7 text-muted">{item.description}</p>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
