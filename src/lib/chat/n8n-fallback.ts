import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

/**
 * Legacy fallback: used only when NARAROUTER_API_KEY is not set but an n8n
 * webhook is configured. Wraps the single JSON reply into a UI message stream
 * so the widget keeps working during migration.
 */
export async function n8nFallbackResponse({
  webhookUrl,
  message,
  locale,
  sessionId,
}: {
  webhookUrl: string;
  message: string;
  locale: "fa" | "en";
  sessionId: string;
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const secret = process.env.CHAT_SECRET?.trim();
  if (secret) headers["x-chat-secret"] = secret;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ message, locale, sessionId }),
    signal: AbortSignal.timeout(45_000),
    cache: "no-store",
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`n8n returned ${response.status}`);
  }

  let reply = raw;
  try {
    const parsed = JSON.parse(raw) as { reply?: unknown };
    if (typeof parsed.reply === "string") reply = parsed.reply;
  } catch {
    /* plain text body */
  }
  reply = reply.trim();
  if (!reply) throw new Error("n8n returned an empty reply");

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const id = "n8n-text";
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: reply });
      writer.write({ type: "text-end", id });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
