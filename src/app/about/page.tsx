import type { Metadata } from "next";
import { aboutFeatures, whyUs } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "درباره ما",
  description: `درباره ${site.nameFa} — تیم متخصص طراحی و پیاده‌سازی راهکارهای هوش مصنوعی برای کسب‌وکارها.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="hero-bg border-b border-card-border px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="SIG · ABOUT"
            title="متخصص در تبدیل هوش مصنوعی به راهکارهای واقعی"
            subtitle="ما با ترکیب دانش تخصصی، تجربه اجرایی و فناوری‌های روز هوش مصنوعی، راهکارهای هوشمندی طراحی و پیاده‌سازی می‌کنیم که به کسب‌وکارها کمک می‌کنند فرآیندهای خود را سریع‌تر، دقیق‌تر و هوشمندتر انجام دهند."
            align="start"
          />
          <p className="leading-8 text-muted">
            {site.nameFa} ({site.name}) یک تیم تخصصی در زمینه هوش مصنوعی، اتوماسیون،
            توسعه سیستم‌های هوشمند و پیاده‌سازی راهکارهای AI برای سازمان‌ها و
            کسب‌وکارهاست. تمرکز ما بر اعتماد، تخصص و نتیجه قابل اندازه‌گیری است.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-0 border border-card-border sm:grid-cols-3">
          {aboutFeatures.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div
                className={`h-full bg-card p-6 ${
                  i < aboutFeatures.length - 1 ? "sm:border-e sm:border-card-border" : ""
                }`}
              >
                <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
                <p className="text-sm leading-7 text-muted">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="SIG · PRINCIPLES" title="اصول همکاری ما" />
          <ol className="border-t border-card-border">
            {whyUs.map((item, i) => (
              <li
                key={item.title}
                className="grid gap-3 border-b border-card-border py-6 sm:grid-cols-[4rem_1fr_1.5fr]"
              >
                <span className="font-mono-signal text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm leading-7 text-muted">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
