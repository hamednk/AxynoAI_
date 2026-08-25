import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { AboutBrief } from "@/components/sections/AboutBrief";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhyUs } from "@/components/sections/WhyUs";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { Industries } from "@/components/sections/Industries";
import { SolutionsShowcase } from "@/components/sections/SolutionsShowcase";
import { FinalCTA } from "@/components/sections/FinalCTA";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <AboutBrief />
      <ServicesGrid showAllLink />
      <WhyUs />
      <ProcessTimeline />
      <Industries />
      <SolutionsShowcase limit={6} />
      <FinalCTA />
    </>
  );
}
