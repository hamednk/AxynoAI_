"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  ArrowUp,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Square,
  SquarePen,
  X,
} from "lucide-react";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export const OPEN_CHAT_EVENT = "axyno:open-chat";

const STORAGE_PREFIX = "axyno-chat-v2";
const suggestionKeys = ["services", "chatbot", "process", "contact"] as const;
const followUpKeys = ["pricing", "timeline", "consult"] as const;

function messageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
}

function MarkdownLink({
  href = "",
  children,
  ...rest
}: ComponentPropsWithoutRef<"a">) {
  const internal = href.startsWith("/") && !href.startsWith("//");
  const className =
    "font-medium text-accent underline decoration-accent/40 underline-offset-4 transition hover:text-accent-bright hover:decoration-accent";

  if (internal) {
    return (
      <NextLink href={href} className={className}>
        {children}
      </NextLink>
    );
  }

  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

function AssistantMarkdown({ text }: { text: string }) {
  return (
    <div className="chat-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ a: MarkdownLink }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

export function ChatWidget() {
  const t = useTranslations("Chat");
  const locale = useLocale() === "en" ? "en" : "fa";
  const reduce = useReducedMotion();
  const titleId = useId();
  const inputId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const restoredRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const storageKey = `${STORAGE_PREFIX}-${locale}`;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages, id }) => ({
          body: { id, messages, locale },
        }),
      }),
    [locale],
  );

  const { messages, sendMessage, status, stop, error, regenerate, setMessages, clearError } =
    useChat({
      id: `axyno-${locale}`,
      transport,
      throttle: 40,
    });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as UIMessage[];
        if (Array.isArray(parsed)) {
          const trimmed = [...parsed];
          while (trimmed.length && trimmed[trimmed.length - 1].role === "user") {
            trimmed.pop();
          }
          setMessages(trimmed);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, [setMessages, storageKey]);

  useEffect(() => {
    if (!restoredRef.current || busy) return;
    try {
      if (messages.length === 0) {
        window.localStorage.removeItem(storageKey);
      } else {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify(messages.slice(-30)),
        );
      }
    } catch {
      /* storage full or unavailable */
    }
  }, [messages, busy, storageKey]);

  useEffect(() => {
    const onOpen = (event: Event) => {
      setOpen(true);
      const detail = (event as CustomEvent<{ prompt?: string }>).detail;
      if (detail?.prompt) setInput(detail.prompt);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, open, status, reduce]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 180);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const mobile = window.matchMedia("(max-width: 639px)").matches;
    const prev = document.body.style.overflow;
    if (mobile) document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const submit = useCallback(
    (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text || busy) return;
      if (error) clearError();
      setInput("");
      void sendMessage({ text });
    },
    [input, busy, error, clearError, sendMessage],
  );

  const resetChat = () => {
    stop();
    setMessages([]);
    clearError();
    setInput("");
  };

  const errorText = error
    ? /NARAROUTER|not configured|503/i.test(error.message)
      ? t("offline")
      : t("error")
    : null;

  const last = messages[messages.length - 1];
  const showFollowUps = !busy && !error && last?.role === "assistant";

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] flex items-end justify-end sm:inset-auto sm:bottom-0 sm:end-0 sm:p-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="backdrop"
            className="pointer-events-auto fixed inset-0 bg-navy-deep/60 backdrop-blur-sm sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none relative flex w-full flex-col items-end gap-3 sm:w-auto">
        <AnimatePresence>
          {open ? (
            <motion.section
              key="panel"
              role="dialog"
              aria-modal="false"
              aria-labelledby={titleId}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="chat-panel pointer-events-auto flex h-[min(88dvh,100dvh)] w-full flex-col overflow-hidden rounded-t-3xl sm:h-[min(40rem,80dvh)] sm:w-[26rem] sm:rounded-2xl"
            >
              <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-foreground/20 sm:hidden" aria-hidden />
              <header className="relative flex items-center gap-3 border-b border-card-border px-4 py-3">
                <div className="chat-avatar relative flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <Sparkles className="size-5 text-accent-bright" />
                  <span className="absolute -bottom-0.5 -end-0.5 size-3 rounded-full border-2 border-card bg-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p id={titleId} className="truncate font-display text-sm font-bold text-foreground">
                    {t("title")}
                  </p>
                  <p className="flex items-center gap-1.5 truncate text-[11px] text-steel">
                    <span className="font-mono-signal text-emerald-500">{t("online")}</span>
                    <span aria-hidden>·</span>
                    <span className="truncate">{t("subtitle")}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetChat}
                  className="inline-flex size-10 items-center justify-center rounded-lg text-muted transition hover:bg-accent-soft hover:text-accent"
                  aria-label={t("newChat")}
                  title={t("newChat")}
                >
                  <SquarePen className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex size-10 items-center justify-center rounded-lg text-muted transition hover:bg-accent-soft hover:text-accent"
                  aria-label={t("close")}
                >
                  <X className="size-4" />
                </button>
              </header>

              <div
                ref={listRef}
                className="chat-scroll flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
                aria-live="polite"
              >
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <div className="chat-bubble-assistant max-w-[92%] rounded-2xl rounded-ss-sm px-4 py-3 text-sm leading-7">
                      {t("welcome")}
                    </div>
                    <div className="grid gap-2">
                      {suggestionKeys.map((key, i) => (
                        <motion.button
                          key={key}
                          type="button"
                          initial={reduce ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 * i }}
                          onClick={() => submit(t(`suggestions.${key}`))}
                          className="chat-chip min-h-11 rounded-xl px-3.5 py-2.5 text-start text-sm"
                        >
                          {t(`suggestions.${key}`)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {messages.map((message) => {
                  const text = messageText(message);
                  if (!text && message.role === "assistant") return null;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[92%] px-4 py-3 text-sm leading-7",
                          message.role === "user"
                            ? "chat-bubble-user rounded-2xl rounded-se-sm whitespace-pre-wrap"
                            : "chat-bubble-assistant rounded-2xl rounded-ss-sm",
                        )}
                        dir="auto"
                      >
                        {message.role === "assistant" ? (
                          <AssistantMarkdown text={text} />
                        ) : (
                          text
                        )}
                      </div>
                    </div>
                  );
                })}

                {status === "submitted" ? (
                  <div className="chat-bubble-assistant inline-flex items-center gap-1.5 rounded-2xl rounded-ss-sm px-4 py-3" aria-label={t("thinking")}>
                    <span className="chat-dot" />
                    <span className="chat-dot [animation-delay:0.15s]" />
                    <span className="chat-dot [animation-delay:0.3s]" />
                  </div>
                ) : null}

                {errorText ? (
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-foreground">
                    <span className="flex-1">{errorText}</span>
                    <button
                      type="button"
                      onClick={() => {
                        clearError();
                        void regenerate();
                      }}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-card-border px-3 text-xs font-semibold transition hover:border-accent hover:text-accent"
                    >
                      <RotateCcw className="size-3.5" />
                      {t("retry")}
                    </button>
                  </div>
                ) : null}

                {showFollowUps ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {followUpKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => submit(t(`followUps.${key}`))}
                        className="chat-chip min-h-9 rounded-full px-3 py-1.5 text-xs"
                      >
                        {t(`followUps.${key}`)}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <form
                className="border-t border-card-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
              >
                <div className="chat-input-shell flex items-end gap-2 rounded-2xl p-1.5">
                  <label className="sr-only" htmlFor={inputId}>
                    {t("placeholder")}
                  </label>
                  <textarea
                    ref={inputRef}
                    id={inputId}
                    rows={1}
                    dir={input ? "auto" : locale === "fa" ? "rtl" : "ltr"}
                    value={input}
                    maxLength={2000}
                    onChange={(event) => {
                      setInput(event.target.value);
                      const el = event.target;
                      el.style.height = "auto";
                      el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                        event.preventDefault();
                        submit();
                      }
                    }}
                    placeholder={t("placeholder")}
                    className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted sm:text-sm"
                  />
                  {busy ? (
                    <button
                      type="button"
                      onClick={() => stop()}
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-card-border text-foreground transition hover:border-accent hover:text-accent"
                      aria-label={t("stop")}
                    >
                      <Square className="size-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="chat-send inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-btn-fg transition disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={t("send")}
                    >
                      <ArrowUp className="size-5" />
                    </button>
                  )}
                </div>
              </form>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "chat-fab pointer-events-auto m-4 inline-flex size-14 items-center justify-center rounded-full text-btn-fg sm:m-0",
            open && "max-sm:hidden",
          )}
          aria-label={open ? t("close") : t("open")}
          aria-expanded={open}
        >
          <span className="chat-fab-ring" aria-hidden />
          {open ? <X className="relative size-5" /> : <MessageCircle className="relative size-6" />}
        </button>
      </div>
    </div>
  );
}
