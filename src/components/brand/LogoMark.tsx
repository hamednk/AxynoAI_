import Image from "next/image";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

type LogoMarkProps = {
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
  priority?: boolean;
};

const sizes = {
  sm: { px: 36, className: "size-9" },
  md: { px: 48, className: "size-12" },
  lg: { px: 56, className: "size-14" },
  hero: { px: 128, className: "size-24 sm:size-28 md:size-32" },
} as const;

export function LogoMark({ size = "md", className, priority }: LogoMarkProps) {
  const s = sizes[size];
  return (
    <span
      className={cn(
        "logo-glow relative inline-flex shrink-0 overflow-hidden rounded-md bg-navy-deep",
        s.className,
        className,
      )}
    >
      <Image
        src={site.logo}
        alt={site.name}
        width={s.px}
        height={s.px}
        className="size-full object-cover"
        priority={priority}
      />
    </span>
  );
}
