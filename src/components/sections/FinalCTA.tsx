import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="cta-bg relative mx-auto max-w-7xl overflow-hidden px-6 py-16 text-white sm:px-12 axis-cut">
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
              SIG · 08 / NEXT
            </p>
            <h2 className="font-display text-2xl font-extrabold text-balance sm:text-3xl lg:text-[2.15rem] lg:leading-[1.45]">
              آماده‌اید کسب‌وکارتان را هوشمندتر کنید؟
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/65 sm:text-base sm:leading-8">
              اگر ایده‌ای برای استفاده از هوش مصنوعی در کسب‌وکار خود دارید، با ما صحبت
              کنید. با بررسی نیازهای شما، بهترین راهکار را پیشنهاد می‌دهیم.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                href="/contact"
                className="bg-accent text-btn-fg hover:bg-accent-bright"
              >
                شروع یک گفت‌وگوی تخصصی
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                className="border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/5 hover:text-white"
              >
                دریافت مشاوره
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
