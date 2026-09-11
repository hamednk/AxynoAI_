export type RagChunkType =
  | "company"
  | "service"
  | "solution"
  | "about"
  | "process"
  | "contact"
  | "faq";

export type RagChunk = {
  id: string;
  locale: "fa" | "en";
  type: RagChunkType;
  title: string;
  text: string;
  tags: string[];
};

type ServiceItem = { title: string; short: string; description: string };
type SolutionItem = { title: string; description: string };
type WhyItem = { title: string; description: string };
type StepItem = { title: string; description: string };

type LocaleMessages = {
  Meta: { tagline: string; description: string; nameFa: string };
  Hero: { subtitle: string };
  About: { title: string; subtitle: string; body: string };
  AboutBrief: {
    features: Record<string, { title: string; description: string }>;
  };
  Services: { items: Record<string, ServiceItem> };
  Solutions: { items: Record<string, SolutionItem> };
  WhyUs: { items: Record<string, WhyItem> };
  Process: { steps: Record<string, StepItem> };
  Industries: { title: string; items: string[] };
  Contact: { title: string; subtitle: string };
  FinalCTA: { title: string; subtitle: string };
};

import fa from "../../../messages/fa.json";
import en from "../../../messages/en.json";
import { site } from "@/lib/site";

function buildLocaleChunks(
  locale: "fa" | "en",
  messages: LocaleMessages,
): RagChunk[] {
  const chunks: RagChunk[] = [];

  chunks.push({
    id: `${locale}-company`,
    locale,
    type: "company",
    title: locale === "fa" ? "معرفی شرکت" : "Company overview",
    text: [
      `${site.name} (${messages.Meta.nameFa}).`,
      messages.Meta.tagline,
      messages.Meta.description,
      messages.Hero.subtitle,
      messages.FinalCTA.title,
      messages.FinalCTA.subtitle,
    ].join(" "),
    tags: ["company", "brand", "axynoai"],
  });

  chunks.push({
    id: `${locale}-about`,
    locale,
    type: "about",
    title: messages.About.title,
    text: [
      messages.About.subtitle,
      messages.About.body,
      ...Object.values(messages.AboutBrief.features).map(
        (item) => `${item.title}: ${item.description}`,
      ),
      ...Object.values(messages.WhyUs.items).map(
        (item) => `${item.title}: ${item.description}`,
      ),
    ].join("\n"),
    tags: ["about", "team", "principles"],
  });

  for (const [slug, item] of Object.entries(messages.Services.items)) {
    chunks.push({
      id: `${locale}-service-${slug}`,
      locale,
      type: "service",
      title: item.title,
      text: `${item.short}\n${item.description}\nURL: /services/${slug}`,
      tags: ["service", slug],
    });
  }

  for (const [slug, item] of Object.entries(messages.Solutions.items)) {
    chunks.push({
      id: `${locale}-solution-${slug}`,
      locale,
      type: "solution",
      title: item.title,
      text: `${item.description}\nURL: /solutions`,
      tags: ["solution", slug],
    });
  }

  chunks.push({
    id: `${locale}-process`,
    locale,
    type: "process",
    title: locale === "fa" ? "فرآیند همکاری" : "Delivery process",
    text: Object.entries(messages.Process.steps)
      .map(([key, step]) => `${key}. ${step.title}: ${step.description}`)
      .join("\n"),
    tags: ["process", "delivery"],
  });

  chunks.push({
    id: `${locale}-industries`,
    locale,
    type: "about",
    title: messages.Industries.title,
    text: messages.Industries.items.join("، "),
    tags: ["industries"],
  });

  chunks.push({
    id: `${locale}-contact`,
    locale,
    type: "contact",
    title: messages.Contact.title,
    text: [
      messages.Contact.subtitle,
      `Phone: ${site.phoneDisplay} (${site.phone})`,
      `Email: ${site.email}`,
      "Website contact page: /contact",
    ].join("\n"),
    tags: ["contact", "phone", "email"],
  });

  chunks.push({
    id: `${locale}-faq`,
    locale,
    type: "faq",
    title: locale === "fa" ? "سوالات متداول" : "FAQ",
    text:
      locale === "fa"
        ? [
            "اکسینو AI خدمات طراحی و پیاده‌سازی راهکارهای هوش مصنوعی برای کسب‌وکارها ارائه می‌دهد.",
            "برای شروع می‌توانید از صفحه تماس درخواست مشاوره رایگان بفرستید یا با شماره و ایمیل شرکت ارتباط بگیرید.",
            "خدمات شامل چت‌بات، CRM هوشمند، تولید محتوا، استخراج اطلاعات، ربات تلگرام، پزشکی، آموزش، املاک، امنیت سایبری و موارد دیگر است.",
            "اگر اطلاعات کافی در دانش موجود نبود، کاربر را به مشاوره و تماس هدایت کنید.",
          ].join("\n")
        : [
            "AxynoAI designs and implements AI solutions for businesses.",
            "Users can request a free consultation via the contact page, phone, or email.",
            "Services include chatbots, AI CRM, content generation, data extraction, Telegram bots, healthcare, education, real estate, cybersecurity, and more.",
            "If knowledge is insufficient, guide the user to consultation and contact.",
          ].join("\n"),
    tags: ["faq", "consult"],
  });

  return chunks;
}

export const ragChunks: RagChunk[] = [
  ...buildLocaleChunks("fa", fa as LocaleMessages),
  ...buildLocaleChunks("en", en as LocaleMessages),
];

export function getRagChunksByLocale(locale: "fa" | "en") {
  return ragChunks.filter((chunk) => chunk.locale === locale);
}

export function ragChunksToMarkdown(locale: "fa" | "en") {
  return getRagChunksByLocale(locale)
    .map(
      (chunk) =>
        `## ${chunk.title}\n\nTags: ${chunk.tags.join(", ")}\nType: ${chunk.type}\nLocale: ${chunk.locale}\n\n${chunk.text}`,
    )
    .join("\n\n---\n\n");
}
