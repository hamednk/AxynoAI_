"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}`;
}

export function ChatWidget() {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const titleId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [sessionId] = useState(createSessionId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, open, pending]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || pending) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: text,
          locale: locale === "en" ? "en" : "fa",
          sessionId,
        }),
      });

      const payload = (await response.json()) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok || !payload.reply) {
        const offline = response.status === 503;
        setMessages((current) => [
          ...current,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: offline ? t("offline") : t("error"),
          },
        ]);
        return;
      }

      const reply = payload.reply;
      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: t("error"),
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex justify-end p-4 sm:p-6">
      <div className="pointer-events-auto flex max-w-full flex-col items-end gap-3">
        {open ? (
          <section
            className="signal-panel flex h-[min(34rem,72svh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden border border-card-border bg-card/95 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md"
            aria-labelledby={titleId}
          >
            <header className="flex items-start justify-between gap-3 border-b border-card-border px-4 py-3">
              <div className="min-w-0">
                <p
                  id={titleId}
                  className="font-display text-sm font-semibold text-foreground"
                >
                  {t("title")}
                </p>
                <p className="mt-1 text-[10px] text-steel">
                  {t("subtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-md text-muted transition hover:bg-accent-soft hover:text-accent"
                aria-label={t("close")}
              >
                <X className="size-4" />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 ? (
                <p className="rounded-md border border-card-border/70 bg-background/50 px-3 py-2 text-sm leading-7 text-muted">
                  {t("welcome")}
                </p>
              ) : null}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[90%] rounded-md px-3 py-2 text-sm leading-7",
                    message.role === "user"
                      ? "ms-auto bg-accent text-btn-fg"
                      : "me-auto border border-card-border bg-background/70 text-foreground",
                  )}
                >
                  {message.content}
                </div>
              ))}
              {pending ? (
                <p className="me-auto text-[11px] text-steel">
                  {t("thinking")}
                </p>
              ) : null}
            </div>

            <form
              className="border-t border-card-border p-3"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
            >
              <div className="flex items-end gap-2">
                <label className="sr-only" htmlFor={`${titleId}-input`}>
                  {t("placeholder")}
                </label>
                <textarea
                  id={`${titleId}-input`}
                  rows={2}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder={t("placeholder")}
                  className="min-h-[2.75rem] flex-1 resize-none rounded-md border border-card-border bg-background/70 px-3 py-2 text-sm text-foreground outline-none ring-accent/40 placeholder:text-muted focus:ring-2"
                  disabled={pending}
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-btn-fg transition hover:bg-accent-bright disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={t("send")}
                >
                  <Send className="size-4 rtl:rotate-180" />
                </button>
              </div>
            </form>
          </section>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-14 items-center justify-center rounded-full bg-accent text-btn-fg shadow-[0_12px_40px_rgba(0,168,232,0.35)] transition hover:bg-accent-bright"
          aria-label={open ? t("close") : t("open")}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
        </button>
      </div>
    </div>
  );
}
