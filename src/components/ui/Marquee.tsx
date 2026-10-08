import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Marquee({
  children,
  reverse = false,
  duration = 40,
  gap = "1rem",
  className,
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  gap?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("marquee", className)}
      data-reverse={reverse ? "true" : "false"}
      style={{ "--duration": `${duration}s`, "--gap": gap } as CSSProperties}
    >
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden>
        {children}
      </div>
    </div>
  );
}
