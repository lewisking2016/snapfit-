import type { CoachRequest } from '@/services/coach';

/**
 * Local, dependency-free answers used when the Gemini proxy is unreachable
 * (airplane mode, dev server down, quota exceeded). Ordered from most to
 * least specific so keyword matching stays predictable.
 */
const RULES: Array<{ test: RegExp; reply: string }> = [
  {
    test: /rest|recovery|sleep|sore|tired|fatigue|overtrain/i,
    reply:
      'Recovery is where the adaptation happens. Keep today easy: 8 hours in bed, 10 minutes of mobility, and cap your session at RPE 6 if your legs still feel flat.',
  },
  {
    test: /form|technique|injur|hurt|pain|knee|shoulder|back/i,
    reply:
      'Stop the set if pain is sharp or joint-based. For technique, film one working set from the side — bar path, brace, and knee track usually tell the whole story.',
  },
  {
    test: /weight|load|kg|lbs|heavy|pr|plateau|stronger/i,
    reply:
      'Add load only when you finish every prescribed set with two reps left in reserve. Two and a half kilos a week compounds faster than chasing a max you cannot repeat.',
  },
  {
    test: /cardio|zone|vo2|conditioning|run|bike/i,
    reply:
      'Keep easy days genuinely easy — nose breathing, conversational pace. One hard conditioning block a week moves the needle more than four gray-zone sessions.',
  },
  {
    test: /diet|protein|calorie|eat|nutrition|macro|fuel/i,
    reply:
      'Anchor the day around protein: roughly 1.6 to 2.2 grams per kilo of bodyweight, spread across meals. Then size your carbs around training so the hard sets feel strong.',
  },
  {
    test: /plan|routine|program|next|today|start|workout/i,
    reply:
      'Open Routines, pick the block that matches your goal, and hit start. I will count your sets, hold the rest timer, and cue you when your heart rate drifts.',
  },
  {
    test: /hi|hello|hey|marcus|who are you/i,
    reply:
      'Marcus here. I read your telemetry — heart rate, sleep, completed sets — and adjust the plan around it. What are we training today?',
  },
];

const DEFAULT_REPLY =
  'I am running offline right now, so I am working from the last plan we agreed on: train the weak point, keep the rest honest, and stop each set with reps left in the tank. Reconnect for a sharper answer.';

export function getLocalCoachReply(req: CoachRequest): { text: string } {
  const question = req.question?.trim() ?? '';
  for (const rule of RULES) {
    if (rule.test.test(question)) return { text: rule.reply };
  }
  return { text: DEFAULT_REPLY };
}
