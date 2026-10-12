import { site, navHrefs, footerServiceHrefs } from "@/lib/site";
import { serviceMetas } from "@/lib/services";
import { solutionMetas } from "@/lib/content";
import type { RagChunk } from "./corpus";

function pathFor(locale: "fa" | "en", href: string) {
  if (locale === "en") {
    return href === "/" ? "/en" : `/en${href}`;
  }
  return href;
}

export function buildExtraChunks(locale: "fa" | "en"): RagChunk[] {
  const isFa = locale === "fa";

  const navLines = navHrefs
    .map((item) => `${item.key}: ${pathFor(locale, item.href)}`)
    .join("\n");

  const servicePaths = serviceMetas
    .map((s) => pathFor(locale, `/services/${s.slug}`))
    .join("\n");

  const solutionPaths = solutionMetas
    .map((s) => `${s.slug} → ${pathFor(locale, "/solutions")}`)
    .join("\n");

  const featuredServices = footerServiceHrefs
    .map((s) => pathFor(locale, s.href))
    .join("\n");

  return [
    {
      id: `${locale}-navigation`,
      locale,
      type: "contact",
      title: isFa ? "نقشه سایت و مسیرها" : "Site map and paths",
      text: isFa
        ? [
            "مسیرهای اصلی سایت (پیش‌فرض فارسی بدون پیشوند locale؛ انگلیسی با /en):",
            navLines,
            "صفحات خدمات:",
            servicePaths,
            "راهکارها:",
            solutionPaths,
            "خدمات پرکاربرد در فوتر:",
            featuredServices,
            `تماس مستقیم: تلفن ${site.phoneDisplay} — ایمیل ${site.email}`,
          ].join("\n")
        : [
            "Main site paths (Persian default has no locale prefix; English uses /en):",
            navLines,
            "Service pages:",
            servicePaths,
            "Solutions:",
            solutionPaths,
            "Featured footer services:",
            featuredServices,
            `Direct contact: phone ${site.phoneDisplay} — email ${site.email}`,
          ].join("\n"),
      tags: ["navigation", "urls", "sitemap"],
    },
    {
      id: `${locale}-consultation`,
      locale,
      type: "contact",
      title: isFa ? "روند مشاوره و شروع همکاری" : "Consultation and engagement flow",
      text: isFa
        ? [
            "شروع همکاری معمولاً با مشاوره رایگان و کوتاه است.",
            "کاربر می‌تواند از صفحه تماس فرم را پر کند (نام، ایمیل یا موبایل، پیام) یا با تلفن و ایمیل مستقیم ارتباط بگیرد.",
            `تلفن: ${site.phoneDisplay} (${site.phone})`,
            `ایمیل: ${site.email}`,
            `صفحه تماس: ${pathFor(locale, "/contact")}`,
            "پس از دریافت نیاز، تیم فرآیند کسب‌وکار را بررسی می‌کند، فرصت‌های AI را مشخص می‌کند و مسیر طراحی تا استقرار را پیشنهاد می‌دهد.",
            "قیمت‌گذاری پروژهٔ محور است و بعد از مشاوره رایگان و شناخت نیاز، برآورد شفاف ارائه می‌شود.",
            "ادغام با سیستم‌های موجود (CRM، وب‌سایت، تلگرام، پایگاه دانش، فروشگاه) بخشی از طراحی راهکار است.",
          ].join("\n")
        : [
            "Engagement usually starts with a short free consultation.",
            "Users can fill the contact form (name, email or phone, message) or reach out by phone/email.",
            `Phone: ${site.phoneDisplay} (${site.phone})`,
            `Email: ${site.email}`,
            `Contact page: ${pathFor(locale, "/contact")}`,
            "After understanding the need, the team reviews processes, identifies AI opportunities, and proposes a design-to-deployment path.",
            "Pricing is project-based; a clear estimate follows free consultation and discovery.",
            "Integration with existing systems (CRM, website, Telegram, knowledge base, store) is part of solution design.",
          ].join("\n"),
      tags: ["consultation", "pricing", "onboarding", "contact"],
    },
    {
      id: `${locale}-pricing`,
      locale,
      type: "faq",
      title: isFa ? "هزینه و قیمت‌گذاری" : "Cost and pricing",
      text: isFa
        ? [
            "هزینه و قیمت راهکارهای AxynoAI ثابت و از پیش‌اعلام‌شده نیست؛ پروژهٔ محور است.",
            "عوامل اصلی اثرگذار روی هزینه:",
            "- دامنه و پیچیدگی راهکار (چت‌بات، CRM، استخراج سند، اتوماسیون و ...)",
            "- کیفیت و حجم داده / پایگاه دانش مورد نیاز",
            "- تعداد کانال‌ها (وب، اپ، تلگرام، پیام‌رسان)",
            "- سطح یکپارچه‌سازی با سیستم‌های موجود",
            "- نیاز به داشبورد، گزارش، نقش‌های دسترسی و امنیت",
            "- پشتیبانی و توسعه پس از استقرار",
            "برای برآورد تقریبی، مشاوره رایگان کافی است: نیاز را کوتاه می‌گویید، تیم محدوده را شفاف می‌کند و مسیر + هزینهٔ متناسب را پیشنهاد می‌دهد.",
            `شروع سریع: ${pathFor(locale, "/contact")} یا تماس ${site.phoneDisplay} / ${site.email}`,
            "هیچ رقم ساختگی اعلام نکن؛ به‌جای «نمی‌دانم»، همین مدل قیمت‌گذاری و عوامل را کامل توضیح بده.",
          ].join("\n")
        : [
            "AxynoAI pricing is not a fixed public price list; it is project-based.",
            "Main cost drivers:",
            "- Scope and solution complexity (chatbot, CRM, document extraction, automation, etc.)",
            "- Data / knowledge-base quality and volume",
            "- Number of channels (web, app, Telegram, messengers)",
            "- Integration depth with existing systems",
            "- Dashboards, reporting, access roles, and security needs",
            "- Post-launch support and continued development",
            "A free consultation is enough for a rough estimate: share the need briefly, we clarify scope, then propose path + matching cost.",
            `Start here: ${pathFor(locale, "/contact")} or ${site.phoneDisplay} / ${site.email}`,
            "Never invent a fake number; instead of saying you don't know, explain this pricing model and the cost drivers fully.",
          ].join("\n"),
      tags: ["pricing", "cost", "هزینه", "قیمت", "estimate", "faq"],
    },
    {
      id: `${locale}-faq-extended`,
      locale,
      type: "faq",
      title: isFa ? "سوالات متداول تکمیلی" : "Extended FAQ",
      text: isFa
        ? [
            "س: از کجا شروع کنیم؟ ج: مشاوره رایگان از صفحه تماس یا تماس تلفنی/ایمیل؛ سپس شناخت و تحلیل فرآیند.",
            "س: هزینه تقریباً چقدر است؟ ج: قیمت پروژهٔ محور است و به دامنه، داده، کانال‌ها، یکپارچه‌سازی و پشتیبانی بستگی دارد. رقم ثابت عمومی نداریم؛ بعد از مشاوره رایگان برآورد شفاف می‌دهیم.",
            "س: چقدر طول می‌کشد؟ ج: پروژه‌های کوچک ممکن است چند هفته باشند؛ سامانه‌های پیچیده‌تر چند ماه. پس از تحلیل برآورد داده می‌شود.",
            "س: با سیستم فعلی ما کار می‌کند؟ ج: بله، تمرکز ما اتصال به سیستم‌های موجود و اتوماسیون واقعی است.",
            "س: داده‌ها امن است؟ ج: امنیت و محرمانگی در طراحی لحاظ می‌شود؛ کنترل دسترسی و محدوده داده تعریف می‌شود.",
            "س: پشتیبانی دارید؟ ج: از ایده تا استقرار و توسعه مستمر همراهی می‌کنیم.",
            "س: فقط نرم‌افزار آماده می‌فروشید؟ ج: خیر؛ راهکار متناسب با کسب‌وکار طراحی و پیاده‌سازی می‌شود.",
            "س: زبان پشتیبانی؟ ج: ارتباط فارسی و انگلیسی از طریق سایت دوزبانه پشتیبانی می‌شود.",
          ].join("\n")
        : [
            "Q: How do we start? A: Free consultation via the contact page, phone, or email; then discovery and process analysis.",
            "Q: Roughly how much does it cost? A: Pricing is project-based and depends on scope, data, channels, integrations, and support. No fixed public rate; a clear estimate follows free consultation.",
            "Q: How long does it take? A: Smaller projects may take weeks; complex systems months. Estimates follow analysis.",
            "Q: Will it work with our stack? A: Yes — integrating with existing systems is a core focus.",
            "Q: Is data secure? A: Security and confidentiality are designed in, with access control and data boundaries.",
            "Q: Do you offer support? A: Yes — from idea through deployment and ongoing development.",
            "Q: Do you only sell off-the-shelf software? A: No — solutions are tailored and implemented for each business.",
            "Q: Language support? A: Persian and English via the bilingual site.",
          ].join("\n"),
      tags: ["faq", "pricing", "security", "support", "timeline"],
    },
  ];
}
