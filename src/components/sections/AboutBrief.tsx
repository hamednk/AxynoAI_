import { aboutFeatures } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export function AboutBrief() {
  return (
    <section id="about-brief" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <FadeIn>
        <SectionHeading
          eyebrow="SIG · 02 / ABOUT"
          title="متخصص در تبدیل هوش مصنوعی به راهکارهای واقعی"
          subtitle="ما با ترکیب دانش تخصصی، تجربه اجرایی و فناوری‌های روز هوش مصنوعی، راهکارهای هوشمندی طراحی و پیاده‌سازی می‌کنیم که به کسب‌وکارها کمک می‌کنند فرآیندهای خود را سریع‌تر، دقیق‌تر و هوشمندتر انجام دهند."
        />
      </FadeIn>
      <div className="grid gap-0 border border-card-border sm:grid-cols-3">
        {aboutFeatures.map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.08}>
            <div
              className={`relative h-full bg-card p-7 ${
                i < aboutFeatures.length - 1 ? "sm:border-e sm:border-card-border" : ""
              }`}
            >
              <span className="font-mono-signal absolute start-7 top-5 text-[10px] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 mb-2 text-lg font-bold">{item.title}</h3>
              <p className="text-sm leading-7 text-muted">{item.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
