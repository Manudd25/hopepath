import { groupEntriesByMonth, formatShortDate, getEntryPreview } from '../lib/journalUtils'

export default function JournalEntryList({
  entries,
  onSelect,
  onEdit,
  onDelete,
  deletingId,
}) {
  if (!entries.length) return null

  const groups = groupEntriesByMonth(entries)

  return (
    <section aria-label="Previous entries" className="mt-14 pt-10 border-t border-transparent">
      <h2 className="font-display text-xl text-navy mb-8">Previous entries</h2>

      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className="text-xs font-medium uppercase tracking-widest text-navy/40 mb-4">
              {group.label}
            </h3>
            <ul className="space-y-1">
              {group.entries.map((entry) => (
                <li key={entry.id}>
                  <div className="group flex items-start gap-3 py-3 border-b border-sand/30 last:border-0">
                    <button
                      type="button"
                      onClick={() => onSelect(entry)}
                      className="flex-1 text-left min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-lg px-1 -mx-1"
                    >
                      <span className="font-display text-base text-navy block">
                        {formatShortDate(entry.entryDate)}
                      </span>
                      {getEntryPreview(entry) && (
                        <span className="text-sm text-navy/50 mt-0.5 block truncate">
                          {getEntryPreview(entry)}
                        </span>
                      )}
                      {entry.pendingSync && (
                        <span className="text-xs text-navy/35 mt-0.5 block">Pending sync</span>
                      )}
                    </button>

                    <div className="flex items-center gap-2 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onEdit(entry)}
                        className="text-xs text-navy/50 hover:text-navy px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                        aria-label={`Edit entry from ${formatShortDate(entry.entryDate)}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(entry.id)}
                        disabled={deletingId === entry.id}
                        className="text-xs text-navy/50 hover:text-rose-800 px-2 py-1 rounded disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                        aria-label={`Delete entry from ${formatShortDate(entry.entryDate)}`}
                      >
                        {deletingId === entry.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
