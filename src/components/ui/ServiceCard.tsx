import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Service } from "@/lib/services";
import { AppIcon } from "@/lib/icons";

export function ServiceCard({ service }: { service: Service }) {
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
      <h3 className="mb-2 text-lg font-bold leading-7">{service.title}</h3>
      <p className="mb-5 flex-1 text-sm leading-7 text-muted">{service.short}</p>
      <Link
        href={`/services/${service.slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-accent transition hover:gap-3 hover:text-accent-bright"
      >
        مشاهده راهکار
        <ArrowLeft className="size-4" />
      </Link>
    </article>
  );
}
