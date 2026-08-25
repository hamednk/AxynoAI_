export type ServiceMeta = {
  slug: string;
  icon: string;
};

export const serviceMetas: ServiceMeta[] = [
  { slug: "ai-content", icon: "PenTool" },
  { slug: "ai-project-management", icon: "Kanban" },
  { slug: "ai-chatbot", icon: "MessageSquare" },
  { slug: "ai-healthcare", icon: "HeartPulse" },
  { slug: "ai-education", icon: "GraduationCap" },
  { slug: "telegram-bot", icon: "Send" },
  { slug: "ai-real-estate", icon: "Building2" },
  { slug: "ai-cybersecurity", icon: "Shield" },
  { slug: "ai-crm", icon: "Users" },
  { slug: "ai-retail", icon: "ShoppingBag" },
  { slug: "ai-extraction", icon: "FileSearch" },
  { slug: "ai-legal", icon: "Scale" },
];

export function getServiceMetaBySlug(slug: string): ServiceMeta | undefined {
  return serviceMetas.find((s) => s.slug === slug);
}
