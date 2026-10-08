import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat/prompt";
import { getChatModel } from "@/lib/chat/provider";
import { checkRateLimit, getClientIp } from "@/lib/chat/rate-limit";
import { n8nFallbackResponse } from "@/lib/chat/n8n-fallback";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGES = 12;
const MAX_CHARS = 2000;

type ChatBody = {
  messages?: unknown;
  locale?: unknown;
  id?: unknown;
};

function asUiMessages(input: unknown): UIMessage[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((item): item is UIMessage => {
      if (!item || typeof item !== "object") return false;
      const role = (item as UIMessage).role;
      return role === "user" || role === "assistant" || role === "system";
    })
    .slice(-MAX_MESSAGES)
    .map((message) => {
      if (!Array.isArray(message.parts)) {
        return { ...message, parts: [] };
      }
      const parts = message.parts.map((part) => {
        if (
          part &&
          typeof part === "object" &&
          "type" in part &&
          part.type === "text" &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return { ...part, text: part.text.slice(0, MAX_CHARS) };
        }
        return part;
      });
      return { ...message, parts };
    });
}

export async function POST(request: Request) {
  const model = getChatModel();
  const n8nUrl = process.env.N8N_WEBHOOK_URL?.trim();
  if (!model && !n8nUrl) {
    return NextResponse.json(
      {
        error:
          "Chat backend is not configured. Set NARAROUTER_API_KEY.",
      },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      },
    );
  }

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const locale = body.locale === "en" ? "en" : "fa";
  const messages = asUiMessages(body.messages);

  if (messages.length === 0) {
    return NextResponse.json(
      { error: "messages are required." },
      { status: 400 },
    );
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastText =
    lastUser?.parts
      ?.filter(
        (part): part is { type: "text"; text: string } =>
          part.type === "text" && typeof part.text === "string",
      )
      .map((part) => part.text)
      .join("")
      .trim() ?? "";

  if (!lastText) {
    return NextResponse.json(
      { error: "A non-empty user message is required." },
      { status: 400 },
    );
  }

  if (!model) {
    try {
      return await n8nFallbackResponse({
        webhookUrl: n8nUrl!,
        message: lastText.slice(0, MAX_CHARS),
        locale,
        sessionId:
          typeof body.id === "string" ? body.id.slice(0, 120) : "anonymous",
      });
    } catch (error) {
      console.error("[chat] n8n fallback failed:", error);
      return NextResponse.json(
        { error: "Unable to reach chat backend." },
        { status: 502 },
      );
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const result = streamText({
      model,
      system: buildSystemPrompt(locale),
      messages: await convertToModelMessages(messages),
      temperature: 0.35,
      abortSignal: controller.signal,
    });

    return result.toUIMessageStreamResponse({
      onFinish: async () => {
        clearTimeout(timeout);
      },
    });
  } catch (error: unknown) {
    clearTimeout(timeout);
    const aborted =
      error instanceof Error &&
      (error.name === "AbortError" || error.message.includes("aborted"));

    return NextResponse.json(
      {
        error: aborted
          ? "Chat backend timed out."
          : "Unable to generate a reply.",
      },
      { status: aborted ? 504 : 502 },
    );
  }
}
