import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ServiceMeta } from "@/lib/services";
import { AppIcon } from "@/lib/icons";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/cn";

export function ServiceCard({
  service,
  title,
  short,
  viewLabel,
  index,
  featured = false,
  className,
}: {
  service: ServiceMeta;
  title: string;
  short: string;
  viewLabel: string;
  index?: number;
  featured?: boolean;
  className?: string;
}) {
  return (
    <SpotlightCard
      className={cn("group h-full rounded-2xl", featured && "gradient-border", className)}
    >
      <Link
        href={`/services/${service.slug}`}
        className="relative flex h-full min-w-0 flex-col p-5 outline-none sm:p-6"
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex items-center justify-center rounded-xl border border-card-border bg-accent-soft text-accent transition duration-500 group-hover:scale-110 group-hover:border-accent/50 group-hover:shadow-[0_0_24px_-6px_var(--glow)]",
              featured ? "size-14" : "size-11",
            )}
          >
            <AppIcon
              name={service.icon}
              className={featured ? "size-7" : "size-5"}
              strokeWidth={1.6}
            />
          </div>
          {typeof index === "number" ? (
            <span className="font-mono-signal text-[10px] text-steel">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
        </div>
        <h3
          className={cn(
            "mb-2 font-bold leading-7 text-pretty",
            featured ? "text-xl sm:text-2xl sm:leading-10" : "text-base sm:text-lg",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mb-6 flex-1 text-muted",
            featured ? "text-sm leading-8 sm:text-base" : "text-sm leading-7",
          )}
        >
          {short}
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all group-hover:gap-3 group-hover:text-accent-bright">
          {viewLabel}
          <ArrowLeft className="hidden size-4 rtl:inline" />
          <ArrowRight className="size-4 rtl:hidden" />
        </span>
      </Link>
    </SpotlightCard>
  );
}
