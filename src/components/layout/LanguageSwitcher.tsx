"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LanguageSwitcher() {
  const t = useTranslations("Lang");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className="inline-flex items-center border border-card-border text-[11px] font-semibold"
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          className={cn(
            "px-2.5 py-1.5 transition",
            locale === loc
              ? "bg-accent text-btn-fg"
              : "text-muted hover:text-foreground",
          )}
        >
          {t(loc)}
        </button>
      ))}
    </div>
  );
}
