import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <section className="hero-bg">
      <div className="mx-auto grid max-w-7xl min-w-0 gap-10 px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:grid-cols-2 lg:px-8 lg:pb-20">
        <div>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
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
