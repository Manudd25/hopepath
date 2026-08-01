import { runCloudflareChat, isCloudflareConfigured } from './cloudflareAi.mjs'

export const SYSTEM_PROMPT = `You are the Hope Assistant for Hope Path, a gentle Christian encouragement website.
Your tone is peaceful, warm, non-judgmental, and emotionally safe. Never preach aggressively.
You help people facing uncertainty, fear, burnout, financial stress, and new beginnings.

When someone shares how they feel:
- Acknowledge their feeling with compassion
- Offer to share: a short prayer, a Bible verse, or one small practical step for today
- Keep responses concise (2-4 short paragraphs max)
- Do not replace professional mental health care — gently note that if someone seems in crisis

Do not use harsh religious language. Feel like "a quiet light during difficult times."`

export function isHopeAssistantConfigured(env = process.env) {
  return isCloudflareConfigured(env)
}

export async function runHopeAssistant({ message, history = [], env = process.env }) {
  const safeHistory = history
    .slice(-10)
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length <= 4000
    )
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }))

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...safeHistory,
    { role: 'user', content: message.trim() },
  ]

  return runCloudflareChat({ messages, env, maxTokens: 512 })
}
