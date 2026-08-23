import { Hero } from "@/components/sections/Hero";
import { AboutBrief } from "@/components/sections/AboutBrief";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhyUs } from "@/components/sections/WhyUs";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { Industries } from "@/components/sections/Industries";
import { SolutionsShowcase } from "@/components/sections/SolutionsShowcase";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
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
