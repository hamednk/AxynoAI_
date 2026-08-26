import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 max-w-3xl sm:mb-12",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="font-mono-signal mb-3 text-[10px] tracking-[0.22em] text-steel uppercase">
          {eyebrow}
        </p>
      ) : null}
      <div className={cn("flex gap-4", align === "center" && "justify-center")}>
        {align === "start" ? (
          <span className="mt-2 hidden h-10 w-px shrink-0 bg-accent sm:block" aria-hidden />
        ) : null}
        <div className="min-w-0">
          <Tag className="font-display text-[1.35rem] font-extrabold text-balance sm:text-3xl lg:text-[2.15rem]">
            {title}
          </Tag>
          {subtitle ? (
            <p className="mt-4 text-[0.95rem] leading-8 text-muted sm:text-base sm:leading-8">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
