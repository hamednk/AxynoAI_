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
            "قیمت‌گذاری و زمان‌بندی دقیق بدون شناخت نیاز اعلام نمی‌شود؛ بعد از مشاوره برآورد ارائه می‌شود.",
            "ادغام با سیستم‌های موجود (CRM، وب‌سایت، تلگرام، پایگاه دانش، فروشگاه) بخشی از طراحی راهکار است.",
          ].join("\n")
        : [
            "Engagement usually starts with a short free consultation.",
            "Users can fill the contact form (name, email or phone, message) or reach out by phone/email.",
            `Phone: ${site.phoneDisplay} (${site.phone})`,
            `Email: ${site.email}`,
            `Contact page: ${pathFor(locale, "/contact")}`,
            "After understanding the need, the team reviews processes, identifies AI opportunities, and proposes a design-to-deployment path.",
            "Exact pricing and timelines are not given without discovery; estimates follow consultation.",
            "Integration with existing systems (CRM, website, Telegram, knowledge base, store) is part of solution design.",
          ].join("\n"),
      tags: ["consultation", "pricing", "onboarding", "contact"],
    },
    {
      id: `${locale}-faq-extended`,
      locale,
      type: "faq",
      title: isFa ? "سوالات متداول تکمیلی" : "Extended FAQ",
      text: isFa
        ? [
            "س: از کجا شروع کنیم؟ ج: مشاوره رایگان از صفحه تماس یا تماس تلفنی/ایمیل؛ سپس شناخت و تحلیل فرآیند.",
            "س: قیمت چقدر است؟ ج: وابسته به دامنه، داده، یکپارچه‌سازی و سطح اتوماسیون است؛ بدون کشف نیاز رقم دقیق اعلام نمی‌شود.",
            "س: چقدر طول می‌کشد؟ ج: پروژه‌های کوچک ممکن است چند هفته باشند؛ سامانه‌های پیچیده‌تر چند ماه. پس از تحلیل برآورد داده می‌شود.",
            "س: با سیستم فعلی ما کار می‌کند؟ ج: بله، تمرکز ما اتصال به سیستم‌های موجود و اتوماسیون واقعی است.",
            "س: داده‌ها امن است؟ ج: امنیت و محرمانگی در طراحی لحاظ می‌شود؛ کنترل دسترسی و محدوده داده تعریف می‌شود.",
            "س: پشتیبانی دارید؟ ج: از ایده تا استقرار و توسعه مستمر همراهی می‌کنیم.",
            "س: فقط نرم‌افزار آماده می‌فروشید؟ ج: خیر؛ راهکار متناسب با کسب‌وکار طراحی و پیاده‌سازی می‌شود.",
            "س: زبان پشتیبانی؟ ج: ارتباط فارسی و انگلیسی از طریق سایت دوزبانه پشتیبانی می‌شود.",
            "اگر پاسخ در دانش نیست، صادقانه بگویید و به مشاوره هدایت کنید.",
          ].join("\n")
        : [
            "Q: How do we start? A: Free consultation via the contact page, phone, or email; then discovery and process analysis.",
            "Q: What does it cost? A: Depends on scope, data, integrations, and automation depth; no exact price without discovery.",
            "Q: How long does it take? A: Smaller projects may take weeks; complex systems months. Estimates follow analysis.",
            "Q: Will it work with our stack? A: Yes — integrating with existing systems is a core focus.",
            "Q: Is data secure? A: Security and confidentiality are designed in, with access control and data boundaries.",
            "Q: Do you offer support? A: Yes — from idea through deployment and ongoing development.",
            "Q: Do you only sell off-the-shelf software? A: No — solutions are tailored and implemented for each business.",
            "Q: Language support? A: Persian and English via the bilingual site.",
            "If the answer is missing from knowledge, say so honestly and guide to consultation.",
          ].join("\n"),
      tags: ["faq", "pricing", "security", "support", "timeline"],
    },
  ];
}
