"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { LogoMark } from "@/components/brand/LogoMark";
import { navHrefs } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-card-border bg-[var(--header-bg)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={closeMenu}>
          <LogoMark size="lg" priority />
          <span className="brand-monument text-lg tracking-wide text-foreground">
            Axyno<span className="text-accent">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navHrefs.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition",
                  active ? "text-accent" : "text-muted hover:text-foreground",
                )}
              >
                {t(link.key)}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-px bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button href="/contact" className="hidden sm:inline-flex">
            {t("consult")}
          </Button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center border border-card-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-card-border bg-[var(--header-bg)] backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navHrefs.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-card-border px-2 py-3 text-sm text-foreground last:border-0"
              >
                {t(link.key)}
              </Link>
            ))}
            <Button href="/contact" className="mt-3 w-full" onClick={closeMenu}>
              {t("consultFull")}
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
