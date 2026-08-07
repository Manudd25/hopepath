import { formatShortDate } from '../lib/smallStepsUtils'

export default function RecentSmallSteps({ history }) {
  if (!history?.length) return null

  return (
    <section className="mt-12 max-w-lg mx-auto">
      <h2 className="text-sm font-medium text-navy/55 text-center mb-4">Recent small steps</h2>
      <ul className="space-y-2">
        {history.map((record) => (
          <li
            key={record.date}
            className="flex items-center justify-between text-sm text-navy/65 px-4 py-2 rounded-xl bg-sand/25 border border-sand/40"
          >
            <span>
              {formatShortDate(record.date)} — {record.text}
            </span>
            {record.completed && (
              <span className="text-sage shrink-0 ml-2" aria-label="Completed">
                ✓
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
