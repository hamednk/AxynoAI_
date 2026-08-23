import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: `دریافت مشاوره رایگان از ${site.nameFa} — تماس و ایمیل مستقیم.`,
};

export default function ContactPage() {
  return (
    <section className="hero-bg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-20">
        <div>
          <SectionHeading
            eyebrow="SIG · CONTACT"
            title="شروع یک گفت‌وگوی تخصصی"
            subtitle="ایده یا نیازتان را بگویید؛ کوتاه بررسی می‌کنیم و مسیر مناسب را پیشنهاد می‌دهیم."
            align="start"
          />
          <div className="space-y-3">
            <a
              href={`tel:${site.phone}`}
              className="signal-panel flex items-center gap-3 p-4 transition hover:border-accent/40"
              dir="ltr"
            >
              <span className="flex size-10 items-center justify-center border border-card-border bg-accent-soft text-accent">
                <Phone className="size-5" />
              </span>
              <div className="text-start">
                <p className="font-mono-signal text-[10px] text-muted">PHONE</p>
                <p className="font-medium">{site.phoneDisplay}</p>
              </div>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="signal-panel flex items-center gap-3 p-4 transition hover:border-accent/40"
              dir="ltr"
            >
              <span className="flex size-10 items-center justify-center border border-card-border bg-accent-soft text-accent">
                <Mail className="size-5" />
              </span>
              <div className="text-start">
                <p className="font-mono-signal text-[10px] text-muted">EMAIL</p>
                <p className="font-medium">{site.email}</p>
              </div>
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
