/**
 * Server-side AI coach proxy.
 *
 * The Gemini API key lives only in this server route (`process.env.GEMINI_API_KEY`,
 * never an `EXPO_PUBLIC_*` var), so the bundled app never sees it. The client calls
 * `POST /api/coach` with `{ question, context? }` and gets `{ text }` back.
 *
 * Endpoint: POST https://generativelanguage.googleapis.com/v1beta/interactions
 * Model:    gemini-3.8-flash
 * Docs:     https://ai.google.dev/gemini-api/docs/text-generation
 */

const MODEL = 'gemini-3.8-flash';
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/interactions';

const MAX_QUESTION_CHARS = 1000;
const MAX_CONTEXT_CHARS = 2000;
const UPSTREAM_TIMEOUT_MS = 15_000;

const SYSTEM_INSTRUCTION = [
  'You are Marcus, the in-app AI coach for SnapFit Athletic Telemetry.',
  'You are an evidence-based strength and conditioning coach.',
  'Answer the athlete’s question in 120 words or fewer.',
  'Use plain language and short sentences. No markdown, no code fences, no headings, no bullet symbols.',
  'Stay practical: give one clear recommendation the athlete can act on today.',
  'When extra context is supplied, use it to tailor the answer and mention it naturally.',
  'Never invent telemetry, numbers, or data that was not provided.',
  'Never diagnose medical conditions or injuries, and never suggest medication.',
  'If a question needs a medical professional, say so briefly and suggest they ask one.',
].join(' ');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

/** Preflight handler so the app (and web builds) can call the route cross-origin. */
export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Pull the assistant text out of a Gemini response body. The exact envelope has
 * shifted between API versions (`response.parts`, `response.candidates[].content.parts`,
 * top-level `output_text`), so walk the known shapes instead of hard-coding one.
 */
function textFromBlock(block: unknown, depth = 0): string | null {
  if (depth > 5 || typeof block !== 'object' || block === null) return null;
  const record = block as Record<string, unknown>;

  if (typeof record.output_text === 'string' && record.output_text.trim()) {
    return record.output_text;
  }

  const parts = record.parts;
  if (Array.isArray(parts)) {
    const chunks: string[] = [];
    for (const part of parts) {
      if (typeof part !== 'object' || part === null) continue;
      const p = part as Record<string, unknown>;
      if (p.thought === true) continue; // skip internal reasoning, never ship it
      if (typeof p.text === 'string' && p.text.trim()) chunks.push(p.text);
    }
    const joined = chunks.join('').trim();
    if (joined) return joined;
  }

  if (typeof record.text === 'string' && record.text.trim()) {
    return record.text.trim();
  }

  for (const key of ['content', 'response', 'output', 'candidates']) {
    const nested = record[key];
    if (Array.isArray(nested)) {
      for (const item of nested) {
        const found = textFromBlock(item, depth + 1);
        if (found) return found;
      }
    } else {
      const found = textFromBlock(nested, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Belt-and-braces cleanup: the system prompt already bans markdown, but never let
 * raw fences/emphasis leak into the chat bubble.
 */
function toPlainText(text: string): string {
  return text
    .replace(/```[a-zA-Z0-9+#._-]*\r?\n?/g, '') // drop fence markers, keep contents
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*\n]+)\*/g, '$1') // italic
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/^\s*[-*+]\s+/gm, '') // bullet markers
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> label
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function POST(request: Request): Promise<Response> {
  // --- validate Content-Type -------------------------------------------------
  const contentType = request.headers.get('content-type');
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    return json(415, { error: 'Content-Type must be application/json.' });
  }

  // --- parse body ------------------------------------------------------------
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Request body must be valid JSON.' });
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return json(400, { error: 'Request body must be a JSON object.' });
  }

  const { question, context } = body as { question?: unknown; context?: unknown };

  if (typeof question !== 'string') {
    return json(400, { error: '"question" must be a string.' });
  }
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) {
    return json(400, { error: '"question" must not be empty.' });
  }
  if (trimmedQuestion.length > MAX_QUESTION_CHARS) {
    return json(400, {
      error: `"question" must be ${MAX_QUESTION_CHARS} characters or fewer.`,
    });
  }

  let trimmedContext: string | null = null;
  if (context !== undefined && context !== null) {
    if (typeof context !== 'string') {
      return json(400, { error: '"context" must be a string when provided.' });
    }
    const trimmed = context.trim();
    if (trimmed.length > MAX_CONTEXT_CHARS) {
      return json(400, {
        error: `"context" must be ${MAX_CONTEXT_CHARS} characters or fewer.`,
      });
    }
    if (trimmed) trimmedContext = trimmed;
  }

  // --- server-only secret ----------------------------------------------------
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Never echo configuration details back to the client.
    return json(500, { error: 'The AI coach is not configured on this server.' });
  }

  const payload = {
    model: MODEL,
    system_instruction: SYSTEM_INSTRUCTION,
    input: trimmedContext
      ? `${trimmedContext}\n\nAthlete question: ${trimmedQuestion}`
      : trimmedQuestion,
    generation_config: {
      temperature: 0.5,
      max_output_tokens: 1024,
    },
  };

  // --- call Gemini with a timeout -------------------------------------------
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    return json(504, { error: 'The AI coach took too long to respond. Please try again.' });
  } finally {
    clearTimeout(timer);
  }

  if (!upstream.ok) {
    // Log status only — never the key, the payload, or upstream response bodies.
    console.error(`[coach] Gemini request failed with status ${upstream.status}`);
    return json(502, { error: 'The AI coach is unavailable right now. Please try again.' });
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    return json(502, { error: 'The AI coach returned an unreadable response.' });
  }

  const text = textFromBlock(data);
  if (!text) {
    return json(502, { error: 'The AI coach returned an empty response. Please try again.' });
  }

  return json(200, { text: toPlainText(text) });
}
