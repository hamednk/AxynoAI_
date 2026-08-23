"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <span
        className="inline-flex size-10 items-center justify-center border border-card-border"
        aria-hidden
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-10 items-center justify-center border border-card-border bg-card text-foreground transition hover:border-accent/40 hover:text-accent"
      aria-label={isDark ? "فعال‌سازی حالت روشن" : "فعال‌سازی حالت تاریک"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
