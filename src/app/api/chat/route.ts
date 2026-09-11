import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatRequestBody = {
  message?: unknown;
  locale?: unknown;
  sessionId?: unknown;
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Chat backend is not configured." },
      { status: 503 },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 2000) {
    return badRequest("message is required (max 2000 characters).");
  }

  const locale = body.locale === "en" ? "en" : "fa";
  const sessionId =
    typeof body.sessionId === "string" && body.sessionId.trim()
      ? body.sessionId.trim().slice(0, 120)
      : "anonymous";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const secret = process.env.CHAT_SECRET?.trim();
  if (secret) {
    headers["x-chat-secret"] = secret;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ message, locale, sessionId }),
      signal: controller.signal,
      cache: "no-store",
    });

    const raw = await response.text();
    let payload: unknown = null;
    if (raw) {
      try {
        payload = JSON.parse(raw) as unknown;
      } catch {
        payload = { reply: raw };
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Chat backend returned an error." },
        { status: 502 },
      );
    }

    const reply =
      payload &&
      typeof payload === "object" &&
      "reply" in payload &&
      typeof (payload as { reply: unknown }).reply === "string"
        ? (payload as { reply: string }).reply.trim()
        : "";

    if (!reply) {
      return NextResponse.json(
        { error: "Chat backend returned an empty reply." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const aborted =
      error instanceof Error &&
      (error.name === "AbortError" || error.message.includes("aborted"));
    return NextResponse.json(
      {
        error: aborted
          ? "Chat backend timed out."
          : "Unable to reach chat backend.",
      },
      { status: aborted ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
