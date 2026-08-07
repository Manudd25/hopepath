import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import JournalInfoCard from '../components/JournalInfoCard'
import JournalWriteForm from '../components/JournalWriteForm'
import JournalSaveToast from '../components/JournalSaveToast'
import VirtualNotebook, { NotebookLeftPage } from '../components/VirtualNotebook'
import JournalEntryPage, {
  JournalTodayPage,
  JournalWelcomeLeft,
} from '../components/JournalEntryPage'
import { useJournal } from '../hooks/useJournal'
import { getTimeGreeting, getFirstName, entryToForm, formatFullDate } from '../lib/journalUtils'
import { localDateKey } from '../services/journalLocalService'

const emptyEntry = { fear: '', gratitude: '', goal: '' }

function sortEntriesOldestFirst(entries) {
  return [...entries].sort((a, b) => {
    const da = a.entryDate || a.createdAt?.slice(0, 10) || ''
    const db = b.entryDate || b.createdAt?.slice(0, 10) || ''
    if (da !== db) return da.localeCompare(db)
    return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  })
}

export default function Journal() {
  const { user } = useAuth()
  const location = useLocation()
  const fromFeelings = location.state?.fromFeelings === true
  const {
    entries,
    loading,
    error,
    validationError,
    syncStatus,
    isAuthenticated,
    saveEntry,
    updateEntry,
    deleteEntry,
    clearValidationError,
  } = useJournal()

  const [notebookOpen, setNotebookOpen] = useState(false)
  const [spreadIndex, setSpreadIndex] = useState(0)
  const [sheetMode, setSheetMode] = useState('browse')
  const [editingEntry, setEditingEntry] = useState(null)
  const [form, setForm] = useState(emptyEntry)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [saveToastKey, setSaveToastKey] = useState(0)

  const sortedEntries = useMemo(() => sortEntriesOldestFirst(entries), [entries])
  const todayKey = localDateKey()
  const todayEntry = useMemo(() => {
    const todays = entries.filter((e) => e.entryDate === todayKey)
    if (todays.length === 0) return null
    return [...todays].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0]
  }, [entries, todayKey])
  const pastEntries = useMemo(
    () => sortedEntries.filter((e) => e.entryDate !== todayKey),
    [sortedEntries, todayKey]
  )
  const totalSpreads = pastEntries.length === 0 ? 1 : pastEntries.length + 1

  const firstName = getFirstName(user)
  const greeting = getTimeGreeting()
  const greetingLine = firstName ? `${greeting}, ${firstName}.` : `${greeting}.`
  const todayLabel = formatFullDate(localDateKey())

  useEffect(() => {
    if (spreadIndex >= totalSpreads) {
      setSpreadIndex(Math.max(0, totalSpreads - 1))
    }
  }, [spreadIndex, totalSpreads])

  const showSaveConfirmation = (result) => {
    if (!result.ok) return
    if (result.failed || result.offline) return
    setSaveToastKey((k) => k + 1)
  }

  const goBrowse = (index = 0) => {
    setSheetMode('browse')
    setSpreadIndex(index)
    setEditingEntry(null)
    setForm(emptyEntry)
    clearValidationError()
  }

  const beginEntry = () => {
    if (todayEntry) {
      openEdit(todayEntry)
      return
    }
    setForm(emptyEntry)
    setEditingEntry(null)
    clearValidationError()
    setSheetMode('write')
  }

  const openEdit = (entry) => {
    setEditingEntry(entry)
    setForm(entryToForm(entry))
    clearValidationError()
    setSheetMode('edit')
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const result = await saveEntry(form)
      if (result.ok) {
        showSaveConfirmation(result)
        goBrowse(0)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingEntry) return
    setSaving(true)
    try {
      const result = await updateEntry(editingEntry.id, form)
      if (result.ok) {
        showSaveConfirmation(result)
        if (editingEntry.entryDate === todayKey) {
          goBrowse(0)
        } else {
          const idx = pastEntries.findIndex((en) => en.id === editingEntry.id)
          goBrowse(idx >= 0 ? idx + 1 : 0)
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (entryId) => {
    if (!window.confirm('Delete this journal entry? This cannot be undone.')) return
    setDeletingId(entryId)
    try {
      await deleteEntry(entryId)
      if (entryId === todayEntry?.id) {
        goBrowse(0)
      } else {
        const idx = pastEntries.findIndex((en) => en.id === entryId)
        if (idx >= 0) {
          const nextSpread = Math.min(spreadIndex, Math.max(0, totalSpreads - 2))
          goBrowse(nextSpread)
        } else {
          goBrowse(0)
        }
      }
    } finally {
      setDeletingId(null)
    }
  }

  const buildBrowseRight = (index) => {
    if (index === 0) {
      return (
        <JournalTodayPage
          todayEntry={todayEntry}
          onBegin={beginEntry}
          onEdit={openEdit}
          onDelete={handleDelete}
          deleting={todayEntry ? deletingId === todayEntry.id : false}
          pastEntryCount={pastEntries.length}
          error={error}
          validationError={validationError}
        />
      )
    }

    const entry = pastEntries[index - 1]
    if (!entry) return null

    return (
      <JournalEntryPage
        entry={entry}
        onEdit={openEdit}
        onDelete={handleDelete}
        deleting={deletingId === entry.id}
      />
    )
  }

  const leftContent = useMemo(() => {
    if (sheetMode === 'write' || sheetMode === 'edit') {
      return <NotebookLeftPage dateLabel={todayLabel} greetingLine={greetingLine} />
    }
    if (spreadIndex === 0) {
      return <NotebookLeftPage dateLabel={todayLabel} greetingLine={greetingLine} />
    }
    if (spreadIndex === 1) {
      return <JournalWelcomeLeft />
    }
    const prev = pastEntries[spreadIndex - 2]
    return prev ? <JournalEntryPage entry={prev} compact /> : null
  }, [sheetMode, spreadIndex, pastEntries, todayLabel, greetingLine])

  const rightContent = useMemo(() => {
    if (sheetMode === 'write') {
      return (
        <JournalWriteForm
          form={form}
          onChange={setForm}
          onSubmit={handleCreate}
          onBack={() => goBrowse(0)}
          saving={saving}
          loading={loading}
          syncStatus={syncStatus}
          isAuthenticated={isAuthenticated}
          validationError={validationError}
        />
      )
    }

    if (sheetMode === 'edit' && editingEntry) {
      return (
        <JournalWriteForm
          form={form}
          onChange={setForm}
          onSubmit={handleUpdate}
          onBack={() => {
            if (editingEntry.entryDate === todayKey) {
              goBrowse(0)
              return
            }
            const idx = pastEntries.findIndex((en) => en.id === editingEntry.id)
            goBrowse(idx >= 0 ? idx + 1 : 0)
          }}
          saving={saving}
          loading={loading}
          syncStatus={syncStatus}
          isAuthenticated={isAuthenticated}
          isEditing
          validationError={validationError}
        />
      )
    }

    return buildBrowseRight(spreadIndex)
  }, [
    sheetMode,
    spreadIndex,
    sortedEntries,
    form,
    editingEntry,
    error,
    validationError,
    todayEntry,
    pastEntries,
    isAuthenticated,
    saving,
    loading,
    syncStatus,
    deletingId,
    todayKey,
  ])

  const prevRightContent = useMemo(() => {
    if (sheetMode !== 'browse' || spreadIndex === 0) return null
    return buildBrowseRight(spreadIndex - 1)
  }, [
    sheetMode,
    spreadIndex,
    sortedEntries,
    error,
    validationError,
    todayEntry,
    pastEntries,
    isAuthenticated,
    deletingId,
  ])

  const closeNotebook = () => {
    setNotebookOpen(false)
    goBrowse(0)
  }

  const browsing = sheetMode === 'browse' && notebookOpen

  return (
    <section className="max-w-6xl mx-auto min-h-[70vh] px-4 sm:px-6 py-10 md:py-16">
      {fromFeelings && (
        <p className="mb-6 text-center text-sm text-navy/60 max-w-md mx-auto leading-relaxed">
          Take your time. Write only what feels right — there is no wrong way to begin.
        </p>
      )}
      <VirtualNotebook
        loading={loading}
        isOpen={notebookOpen}
        onOpen={() => setNotebookOpen(true)}
        onClose={closeNotebook}
        spreadIndex={spreadIndex}
        totalSpreads={totalSpreads}
        onPrev={() => setSpreadIndex((i) => Math.max(0, i - 1))}
        onNext={() => setSpreadIndex((i) => Math.min(totalSpreads - 1, i + 1))}
        canPrev={browsing && spreadIndex > 0}
        canNext={browsing && spreadIndex < totalSpreads - 1}
        leftContent={notebookOpen ? leftContent : null}
        rightContent={notebookOpen ? rightContent : null}
        prevRightContent={prevRightContent}
      />

      {!isAuthenticated && notebookOpen && (
        <div className="mt-6">
          <JournalInfoCard />
        </div>
      )}

      <JournalSaveToast trigger={saveToastKey} />
    </section>
  )
}
