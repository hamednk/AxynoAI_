export const site = {
  name: "AxynoAI",
  phone: "+989127274655",
  phoneDisplay: "+98 912 72 74 655",
  email: "info@AxynoAI.com",
  logo: "/logo.png",
} as const;

export const navHrefs = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/solutions", key: "solutions" },
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/contact", key: "contact" },
] as const;

export const footerServiceHrefs = [
  { href: "/services/ai-content", key: "ai-content" },
  { href: "/services/ai-chatbot", key: "ai-chatbot" },
  { href: "/services/ai-crm", key: "ai-crm" },
  { href: "/services/ai-extraction", key: "ai-extraction" },
  { href: "/services/ai-healthcare", key: "ai-healthcare" },
  { href: "/services/ai-education", key: "ai-education" },
  { href: "/services/ai-real-estate", key: "ai-real-estate" },
  { href: "/services/ai-cybersecurity", key: "ai-cybersecurity" },
] as const;

export const footerSolutionKeys = [
  "automation",
  "assistant",
  "chatbot",
  "crm",
  "extraction",
] as const;

export const footerCompanyHrefs = [
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/contact", key: "contact" },
] as const;
