import { useState, useRef, useEffect } from 'react'
import SectionTitle from '../components/SectionTitle'
import { sendHopeMessage } from '../services/hopeAssistant'

const STARTER = {
  role: 'assistant',
  content:
    "I'm here with you. Share what's on your heart — and I can offer a prayer, a Bible verse, or one small step for today.",
}

export default function HopeAssistant() {
  const [messages, setMessages] = useState([STARTER])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const history = messages.slice(1).slice(-10)
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const reply = await sendHopeMessage(text, history)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col min-h-[70vh]">
      <SectionTitle subtitle="Gentle encouragement — never judgment.">
        Hope Assistant
      </SectionTitle>

      <ul className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[50vh] pr-1">
        {messages.map((msg, i) => (
          <li
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <p
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gold/30 text-navy'
                  : 'bg-sand/60 text-navy border border-sand'
              }`}
            >
              {msg.content}
            </p>
          </li>
        ))}
        {loading && (
          <li className="text-sm text-navy/50 italic">Thinking gently…</li>
        )}
        <li ref={bottomRef} />
      </ul>

      {error && (
        <p className="mb-3 text-sm text-rose-800 bg-rose/30 rounded-lg px-3 py-2">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="I'm scared about my future…"
          className="flex-1 rounded-full border border-sand bg-cream px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-full bg-gold text-navy text-sm font-medium hover:bg-gold/90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  )
}
