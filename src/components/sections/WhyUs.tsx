import { whyUs } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <FadeIn>
        <SectionHeading
          eyebrow="SIG · 04 / WHY"
          title="چرا کسب‌وکارها ما را برای هوشمندسازی انتخاب می‌کنند؟"
        />
      </FadeIn>
      <ol className="space-y-0 border-t border-card-border">
        {whyUs.map((item, i) => (
          <FadeIn key={item.title} delay={(i % 3) * 0.05}>
            <li className="group grid gap-4 border-b border-card-border py-7 transition hover:bg-card/60 sm:grid-cols-[5rem_1fr_1.4fr] sm:items-baseline sm:gap-8">
              <span className="font-mono-signal text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-bold transition group-hover:text-accent">{item.title}</h3>
              <p className="text-sm leading-7 text-muted">{item.description}</p>
            </li>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
