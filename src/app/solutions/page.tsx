import type { Metadata } from "next";
import { SolutionsShowcase } from "@/components/sections/SolutionsShowcase";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "راهکارهای هوش مصنوعی",
  description:
    "نمونه راهکارهای AI شامل دستیار سازمانی، چت‌بات، استخراج اسناد، CRM هوشمند و اتوماسیون فرآیندها.",
};

export default function SolutionsPage() {
  return (
    <>
      <div className="hero-bg border-b border-card-border px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="SIG · SOLUTIONS"
            title="راهکارهایی که می‌توانیم برای کسب‌وکار شما ایجاد کنیم"
            subtitle="از ایده تا پیاده‌سازی — راهکارهای مفهومی و قابل توسعه برای نیازهای واقعی"
            align="start"
          />
        </div>
      </div>
      <SolutionsShowcase hideHeading />
      <FinalCTA />
    </>
  );
}
