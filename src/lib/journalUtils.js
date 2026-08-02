export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getFirstName(user) {
  const name = user?.displayName?.trim()
  if (name) return name.split(/\s+/)[0]
  return null
}

export function formatShortDate(entryDate) {
  if (!entryDate) return ''
  const [year, month, day] = entryDate.split('-').map(Number)
  if (!year || !month || !day) return entryDate
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  })
}

export function formatFullDate(entryDate) {
  if (!entryDate) return ''
  const [year, month, day] = entryDate.split('-').map(Number)
  if (!year || !month || !day) return entryDate
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function groupEntriesByMonth(entries) {
  const groups = []
  let current = null

  for (const entry of entries) {
    const [year, month] = (entry.entryDate || '0000-01-01').split('-').map(Number)
    const label = new Date(year, month - 1, 1).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    })

    if (!current || current.label !== label) {
      current = { label, entries: [] }
      groups.push(current)
    }
    current.entries.push(entry)
  }

  return groups
}

export function getEntryPreview(entry) {
  const text =
    entry.fear || entry.gratitude || entry.tomorrowGoal || entry.goal || ''
  if (!text) return ''
  if (text.length <= 72) return text
  return `${text.slice(0, 72).trim()}…`
}

export function entryToForm(entry) {
  return {
    fear: entry.fear || '',
    gratitude: entry.gratitude || '',
    goal: entry.tomorrowGoal || entry.goal || '',
  }
}
