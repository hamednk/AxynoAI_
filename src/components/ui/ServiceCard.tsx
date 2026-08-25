import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ServiceMeta } from "@/lib/services";
import { AppIcon } from "@/lib/icons";

export function ServiceCard({
  service,
  title,
  short,
  viewLabel,
}: {
  service: ServiceMeta;
  title: string;
  short: string;
  viewLabel: string;
}) {
  return (
    <article className="signal-panel group flex h-full flex-col p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex size-11 items-center justify-center border border-card-border bg-accent-soft text-accent transition group-hover:border-accent/40">
          <AppIcon name={service.icon} className="size-5" strokeWidth={1.6} />
        </div>
        <span className="font-mono-signal text-[10px] text-muted opacity-0 transition group-hover:opacity-100">
          OPEN
        </span>
      </div>
      <h3 className="mb-2 text-lg font-bold leading-7">{title}</h3>
      <p className="mb-5 flex-1 text-sm leading-7 text-muted">{short}</p>
      <Link
        href={`/services/${service.slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-accent transition hover:gap-3 hover:text-accent-bright"
      >
        {viewLabel}
        <ArrowLeft className="hidden size-4 rtl:inline" />
        <ArrowRight className="size-4 rtl:hidden" />
      </Link>
    </article>
  );
}
