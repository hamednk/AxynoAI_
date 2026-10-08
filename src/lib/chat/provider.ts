import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function getChatModel() {
  const apiKey = process.env.NARAROUTER_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const baseURL =
    process.env.NARAROUTER_BASE_URL?.trim() || "https://router.bynara.id/v1";
  const modelId = process.env.CHAT_MODEL?.trim() || "agnes-2.5-flash";

  const provider = createOpenAICompatible({
    name: "nararouter",
    baseURL,
    apiKey,
  });

  return provider(modelId);
}
