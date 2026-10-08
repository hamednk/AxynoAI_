"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

export function OpenChatButton({
  label,
  prompt,
  className,
}: {
  label: string;
  prompt?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("axyno:open-chat", { detail: { prompt } }),
        )
      }
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition",
        className,
      )}
    >
      <Sparkles className="size-4" />
      {label}
    </button>
  );
}
