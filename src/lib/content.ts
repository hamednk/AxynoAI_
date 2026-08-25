export const aboutFeatureKeys = ["expertise", "experience", "team"] as const;

export const whyUsKeys = [
  "tailored",
  "modern",
  "results",
  "scalable",
  "security",
  "support",
] as const;

export const processStepKeys = ["01", "02", "03", "04", "05", "06"] as const;

export type SolutionMeta = {
  slug: string;
  icon: string;
};

export const solutionMetas: SolutionMeta[] = [
  { slug: "enterprise-assistant", icon: "Bot" },
  { slug: "smart-chatbot", icon: "MessagesSquare" },
  { slug: "doc-extraction", icon: "ScanText" },
  { slug: "smart-recommend", icon: "Sparkles" },
  { slug: "ai-crm", icon: "Contact" },
  { slug: "process-automation", icon: "Workflow" },
  { slug: "data-analytics", icon: "BarChart3" },
  { slug: "sales-assistant", icon: "TrendingUp" },
  { slug: "support-assistant", icon: "Headset" },
];
