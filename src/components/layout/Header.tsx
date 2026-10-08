"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { LogoMark } from "@/components/brand/LogoMark";
import { navHrefs, site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-4 sm:pt-3">
      <div
        className={cn(
          "relative mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-2 px-3 transition-all duration-500 sm:gap-4 sm:px-5",
          scrolled || open
            ? "h-14 rounded-2xl border border-card-border bg-[var(--header-bg)] shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:h-16"
            : "h-14 border border-transparent bg-transparent sm:h-[4.25rem]",
        )}
      >
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 sm:gap-3"
          onClick={closeMenu}
        >
          <LogoMark size="lg" priority />
          <span className="brand-monument truncate text-[0.7rem] tracking-wide text-foreground sm:text-sm lg:text-lg">
            Axyno<span className="text-accent">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-full border border-card-border/60 bg-background/30 p-1 backdrop-blur lg:flex">
          {navHrefs.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  active ? "text-btn-fg" : "text-muted hover:text-foreground",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{t(link.key)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="hidden lg:block">
            <Button href="/contact">{t("consult")}</Button>
          </div>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-card-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {scrolled && !open ? (
          <motion.div
            className="scroll-progress mx-4 rounded-full"
            style={{ scaleX: progress }}
            aria-hidden
          />
        ) : null}
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-h-[calc(100dvh-5rem)] max-w-7xl overflow-y-auto rounded-2xl border border-card-border bg-[var(--header-bg)] backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col p-3">
              {navHrefs.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={reduce ? false : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex min-h-12 items-center justify-between rounded-xl px-4 text-base font-semibold transition",
                        active
                          ? "bg-accent-soft text-accent"
                          : "text-foreground hover:bg-accent-soft",
                      )}
                    >
                      {t(link.key)}
                      <span className="font-mono-signal text-[10px] text-steel">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
              <Button href="/contact" className="mt-3 min-h-12 w-full" onClick={closeMenu}>
                {t("consultFull")}
              </Button>
              <a
                href={`tel:${site.phone}`}
                dir="ltr"
                className="mt-3 text-center font-mono-signal text-xs text-steel"
              >
                {site.phoneDisplay}
              </a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
