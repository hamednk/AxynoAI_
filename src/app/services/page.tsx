import type { Metadata } from "next";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "خدمات هوش مصنوعی",
  description:
    "خدمات تخصصی هوش مصنوعی شامل تولید محتوا، چت‌بات، CRM، پزشکی، آموزش، املاک، امنیت سایبری و استخراج اطلاعات.",
};

export default function ServicesPage() {
  return (
    <>
      <div className="hero-bg border-b border-card-border px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="SIG · SERVICES"
            title="خدمات هوش مصنوعی برای کسب‌وکارها"
            subtitle="راهکارهای هوشمند متناسب با نیاز، فرآیند و صنعت شما"
            align="start"
          />
        </div>
      </div>
      <ServicesGrid hideHeading />
      <FinalCTA />
    </>
  );
}
