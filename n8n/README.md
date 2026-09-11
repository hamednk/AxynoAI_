# AxynoAI RAG Chatbot — n8n + NaraRouter

Self-hosted n8n workflows that answer site chat via NaraRouter.

> **Note:** Your NaraRouter plan does not expose embedding models (`text-embedding-3-small` → 404).  
> These workflows use **keyword RAG** over AxynoAI knowledge + chat model `agnes-2.5-flash`.

## Files

| File | Purpose |
|------|---------|
| `axynoai-rag-index.json` | Optional: write knowledge JSON to disk |
| `axynoai-rag-chat.json` | Webhook chat: retrieve + answer |
| `knowledge/axynoai-fa.md` | Persian knowledge (readable) |
| `knowledge/axynoai-en.md` | English knowledge (readable) |
| `knowledge/axynoai-chunks.json` | Structured chunks (also embedded in workflows) |

## 1) NaraRouter credential in n8n

1. Credentials → **Header Auth**
2. Name: `NaraRouter`
3. Header name: `Authorization`
4. Header value: `Bearer sk-nry-YOUR_KEY`

Optional env vars on the n8n host:

```bash
NARAROUTER_BASE_URL=https://router.bynara.id/v1
AXYNOAI_KNOWLEDGE_PATH=/home/node/.n8n/axynoai-knowledge.json
```

Chat completions body style:

```text
={{ JSON.stringify({ model: 'agnes-2.5-flash', response_format: { type: 'json_object' }, messages: [ { role: 'system', content: '...' }, { role: 'user', content: JSON.stringify($json) } ], temperature: 0.3 }) }}
```

## 2) Import & run

1. Import `axynoai-rag-index.json` and `axynoai-rag-chat.json`
2. On **Chat Completion (NaraRouter)** select credential **NaraRouter**
3. (Optional) Run Index once to write knowledge file on disk  
   Chat also has built-in fallback chunks, so Index is not required.
4. Activate **AxynoAI RAG Chat (NaraRouter)**
5. Copy Production webhook URL, e.g.  
   `https://YOUR-N8N-HOST/webhook/axynoai-chat`

## 3) Wire the Next.js site

In `.env.local`:

```bash
N8N_WEBHOOK_URL=https://YOUR-N8N-HOST/webhook/axynoai-chat
CHAT_SECRET=
```

Restart `npm run dev`.

## 4) Webhook contract

`POST` JSON body:

```json
{
  "message": "خدمات چت‌بات شما چیست؟",
  "locale": "fa",
  "sessionId": "optional-client-id"
}
```

Response:

```json
{
  "reply": "..."
}
```

## Notes

- Retrieval filters by `locale` (`fa` / `en`) then keyword score top chunks.
- Answers are grounded on CONTEXT only; unknown questions redirect to contact.
- If later your NaraRouter plan includes embeddings, we can switch back to vector RAG.
