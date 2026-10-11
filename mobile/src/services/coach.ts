import Constants from 'expo-constants';

import { getLocalCoachReply } from '@/data/coach-fallback';

export interface CoachRequest {
  question: string;
  /** Optional snapshot string (goal, last session, recovery score). */
  context?: string;
}

export interface CoachReply {
  text: string;
  source: 'gemini' | 'fallback';
}

const TIMEOUT_MS = 12_000;

/**
 * Absolute origin of the Expo Router API route.
 *
 * Production: set `EXPO_PUBLIC_API_URL` (e.g. https://snapfit.example.com).
 * Development: derive the LAN host from `expoConfig.hostUri` so the phone can
 * reach the dev machine's server routes.
 * Returns null when no server is reachable — callers fall back locally.
 */
function serverOrigin(): string | null {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/+$/, '');

  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const host = hostUri.split(':')[0];
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        return `http://${host}:8081`;
      }
    }
  }

  return null;
}

/**
 * Ask the AI coach. Never throws — always resolves with either a Gemini
 * answer or a local fallback so the UI can render offline.
 */
export async function askCoach(req: CoachRequest): Promise<CoachReply> {
  const origin = serverOrigin();

  if (origin) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(`${origin}/api/coach`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
          signal: controller.signal,
        });
        if (res.ok) {
          const data = (await res.json()) as { text?: string };
          if (typeof data.text === 'string' && data.text.trim()) {
            return { text: data.text.trim(), source: 'gemini' };
          }
        }
      } finally {
        clearTimeout(timer);
      }
    } catch {
      // Offline, server down, or timed out — fall through to the local pool.
    }
  }

  return { text: getLocalCoachReply(req).text, source: 'fallback' };
}
