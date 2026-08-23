"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Header() {
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={closeMenu}>
          <Image
            src={site.logo}
            alt={site.name}
            width={36}
            height={36}
            className="size-9 object-cover"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
            }}
            priority
          />
          <span className="brand-monument text-lg tracking-tight text-foreground">
            Axyno<span className="text-accent">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
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
                {link.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-px bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button href="/contact" className="hidden sm:inline-flex">
            مشاوره
          </Button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center border border-card-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "بستن منو" : "باز کردن منو"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-card-border bg-[var(--header-bg)] backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-card-border px-2 py-3 text-sm text-foreground last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/contact" className="mt-3 w-full" onClick={closeMenu}>
              دریافت مشاوره
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
