export const aboutFeatures = [
  {
    title: "تخصص",
    description: "تسلط بر فناوری‌ها و ابزارهای نوین هوش مصنوعی",
  },
  {
    title: "تجربه",
    description: "تجربه در طراحی و پیاده‌سازی راهکارهای واقعی کسب‌وکار",
  },
  {
    title: "تیم حرفه‌ای",
    description: "ترکیبی از متخصصان فنی، محصول و هوش مصنوعی",
  },
] as const;

export const whyUs = [
  {
    title: "راهکار متناسب با کسب‌وکار",
    description:
      "راهکارهای AI را متناسب با نیاز واقعی هر کسب‌وکار طراحی می‌کنیم.",
  },
  {
    title: "فناوری‌های روز",
    description:
      "از جدیدترین ابزارها و تکنولوژی‌های هوش مصنوعی استفاده می‌کنیم.",
  },
  {
    title: "تمرکز بر نتیجه",
    description:
      "هدف ما صرفاً استفاده از AI نیست؛ بلکه ایجاد نتیجه قابل اندازه‌گیری برای کسب‌وکار است.",
  },
  {
    title: "قابلیت توسعه",
    description:
      "راهکارها به شکلی طراحی می‌شوند که در آینده قابلیت توسعه و ارتقا داشته باشند.",
  },
  {
    title: "امنیت و محرمانگی",
    description:
      "امنیت اطلاعات و محرمانگی داده‌های کسب‌وکار در طراحی راهکارها مورد توجه قرار می‌گیرد.",
  },
  {
    title: "پشتیبانی و همراهی",
    description:
      "از مرحله ایده تا پیاده‌سازی و توسعه در کنار مشتری هستیم.",
  },
] as const;

export const processSteps = [
  {
    step: "01",
    title: "شناخت",
    description: "شناخت کسب‌وکار، چالش‌ها و نیازها",
  },
  {
    step: "02",
    title: "تحلیل",
    description: "تحلیل فرآیندها و شناسایی فرصت‌های استفاده از AI",
  },
  {
    step: "03",
    title: "طراحی راهکار",
    description: "طراحی معماری و راهکار متناسب با نیاز",
  },
  {
    step: "04",
    title: "توسعه",
    description: "پیاده‌سازی و اتصال راهکار به سیستم‌های موجود",
  },
  {
    step: "05",
    title: "تست و بهینه‌سازی",
    description: "ارزیابی عملکرد و بهینه‌سازی سیستم",
  },
  {
    step: "06",
    title: "استقرار و پشتیبانی",
    description: "استقرار نهایی و پشتیبانی و توسعه مستمر",
  },
] as const;

export const industries = [
  "پزشکی",
  "آموزش",
  "املاک",
  "فروش و بازاریابی",
  "فروشگاه‌ها",
  "CRM",
  "خدمات سازمانی",
  "حقوقی",
  "امنیت",
  "تولید محتوا",
  "اتوماسیون",
  "خدمات مشتریان",
] as const;

export type Solution = {
  slug: string;
  title: string;
  description: string;
  icon: string;
};

export const solutions: Solution[] = [
  {
    slug: "enterprise-assistant",
    title: "دستیار هوش مصنوعی سازمانی",
    description:
      "دستیار داخلی برای پاسخ به سوالات سازمانی، دسترسی به دانش شرکت و تسریع کارهای روزمره.",
    icon: "Bot",
  },
  {
    slug: "smart-chatbot",
    title: "چت‌بات هوشمند",
    description:
      "تعامل ۲۴ ساعته با مشتریان روی کانال‌های مختلف با درک زمینه و دانش برند شما.",
    icon: "MessagesSquare",
  },
  {
    slug: "doc-extraction",
    title: "سیستم استخراج اطلاعات از اسناد",
    description:
      "تبدیل اسناد و فایل‌های غیرساختاریافته به داده قابل استفاده در سیستم‌های سازمانی.",
    icon: "ScanText",
  },
  {
    slug: "smart-recommend",
    title: "سیستم پیشنهاد هوشمند",
    description:
      "پیشنهاد محصول، محتوا یا اقدام بعدی بر اساس رفتار و نیاز کاربر.",
    icon: "Sparkles",
  },
  {
    slug: "ai-crm",
    title: "AI CRM",
    description:
      "تحلیل مشتریان، پیش‌بینی رفتار و هوشمندسازی پیگیری فروش و پشتیبانی.",
    icon: "Contact",
  },
  {
    slug: "process-automation",
    title: "اتوماسیون فرآیندهای سازمانی",
    description:
      "حذف کارهای تکراری و اتصال سیستم‌ها با جریان‌های هوشمند و قابل کنترل.",
    icon: "Workflow",
  },
  {
    slug: "data-analytics",
    title: "سیستم تحلیل داده",
    description:
      "تبدیل داده خام به بینش قابل اقدام برای مدیران و تیم‌های عملیاتی.",
    icon: "BarChart3",
  },
  {
    slug: "sales-assistant",
    title: "دستیار هوشمند فروش",
    description:
      "کمک به تیم فروش در پیگیری سرنخ، پیشنهاد پاسخ و اولویت‌بندی فرصت‌ها.",
    icon: "TrendingUp",
  },
  {
    slug: "support-assistant",
    title: "دستیار هوشمند پشتیبانی",
    description:
      "پاسخ سریع‌تر به تیکت‌ها، پیشنهاد راه‌حل و کاهش بار تیم پشتیبانی.",
    icon: "Headset",
  },
];
