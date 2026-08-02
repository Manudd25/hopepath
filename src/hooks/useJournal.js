import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useFirebase } from '../context/FirebaseContext'
import {
  getGuestEntries,
  saveGuestEntry,
  updateGuestEntry,
  deleteGuestEntry,
  validateJournalFields,
  localDateKey,
  formatEntryDisplayDate,
  savePendingSyncEntry,
  getPendingSyncEntries,
  removePendingSyncEntry,
} from '../services/journalLocalService'
import {
  fetchJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
  migrateLegacyFirestoreEntries,
} from '../services/journalFirestoreService'
import { syncPendingEntries } from '../services/journalMigrationService'

function sortByNewest(a, b) {
  return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
}

export function useJournal() {
  const { isAuthenticated, user, authLoading } = useAuth()
  const { firebaseReady } = useFirebase()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [syncStatus, setSyncStatus] = useState('idle')
  const [validationError, setValidationError] = useState(null)
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  const loadGuestEntries = useCallback(() => {
    setError(null)
    setEntries(getGuestEntries().sort(sortByNewest))
    setLoading(false)
  }, [])

  const mergePendingIntoEntries = useCallback((baseEntries = []) => {
    const pending = getPendingSyncEntries()
    const byId = new Map()

    for (const entry of baseEntries) {
      if (!entry.id?.startsWith('local-')) {
        byId.set(entry.id, entry)
      }
    }
    for (const entry of pending) {
      byId.set(entry.id, { ...entry, pendingSync: true })
    }

    return [...byId.values()].sort(sortByNewest)
  }, [])

  const loadAuthEntries = useCallback(async () => {
    if (!user?.uid || user.isAnonymous) return

    setLoading(true)
    setError(null)
    try {
      let cloudEntries = await fetchJournalEntries(user.uid)
      cloudEntries = await migrateLegacyFirestoreEntries(user.uid, cloudEntries)
      await syncPendingEntries(user.uid)
      cloudEntries = await fetchJournalEntries(user.uid)

      const pending = getPendingSyncEntries()
      const merged = mergePendingIntoEntries([...pending, ...cloudEntries])
      setEntries(merged)
    } catch {
      setEntries((prev) => mergePendingIntoEntries(prev))
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [user?.uid, user?.isAnonymous, mergePendingIntoEntries])

  useEffect(() => {
    if (authLoading) return

    if (isAuthenticated && user?.uid && firebaseReady) {
      loadAuthEntries()
    } else {
      loadGuestEntries()
    }
  }, [authLoading, isAuthenticated, user?.uid, firebaseReady, loadAuthEntries, loadGuestEntries])

  useEffect(() => {
    if (!isAuthenticated || !user?.uid || !isOnline || !firebaseReady) return
    syncPendingEntries(user.uid)
      .then(({ synced }) => {
        if (synced > 0) loadAuthEntries()
      })
      .catch(() => {})
  }, [isOnline, isAuthenticated, user?.uid, firebaseReady, loadAuthEntries])

  const saveEntry = async (fields) => {
    setValidationError(null)
    setError(null)

    const validation = validateJournalFields({
      fear: fields.fear,
      gratitude: fields.gratitude,
      tomorrowGoal: fields.goal ?? fields.tomorrowGoal,
    })

    if (!validation.valid) {
      setValidationError(validation.message)
      return { ok: false }
    }

    const entryDate = localDateKey()
    const payload = {
      ...validation.fields,
      entryDate,
    }

    setSyncStatus('saving')

    if (isAuthenticated && user?.uid && firebaseReady) {
      if (!isOnline) {
        const localId = `local-${Date.now()}`
        const entry = savePendingSyncEntry({
          id: localId,
          ...payload,
        })
        setEntries((prev) => mergePendingIntoEntries([entry, ...prev]))
        setSyncStatus('offline')
        return { ok: true, offline: true }
      }

      const localId = `local-${Date.now()}`
      try {
        const firestoreId = await saveJournalEntry(user.uid, {
          ...payload,
          localEntryId: localId,
        })
        await loadAuthEntries()
        setSyncStatus('synced')
        return { ok: true, id: firestoreId }
      } catch {
        const entry = savePendingSyncEntry({
          id: localId,
          ...payload,
        })
        setEntries((prev) => mergePendingIntoEntries([entry, ...prev]))
        setSyncStatus('failed')
        return { ok: true, failed: true }
      }
    }

    try {
      saveGuestEntry(payload)
      loadGuestEntries()
      setSyncStatus('local')
      return { ok: true }
    } catch (err) {
      setValidationError(err.message)
      setSyncStatus('idle')
      return { ok: false }
    }
  }

  const deleteEntry = async (entryId) => {
    setError(null)

    if (entryId.startsWith('local-')) {
      removePendingSyncEntry(entryId)
      deleteGuestEntry(entryId)
      if (isAuthenticated && user?.uid && firebaseReady) {
        await loadAuthEntries()
      } else {
        loadGuestEntries()
      }
      return
    }

    if (isAuthenticated && user?.uid && firebaseReady) {
      try {
        await deleteJournalEntry(user.uid, entryId)
        await loadAuthEntries()
      } catch {
        setError('Could not delete this entry. Please try again.')
      }
      return
    }

    deleteGuestEntry(entryId)
    loadGuestEntries()
  }

  const updateEntry = async (entryId, fields) => {
    setValidationError(null)
    setError(null)

    const validation = validateJournalFields({
      fear: fields.fear,
      gratitude: fields.gratitude,
      tomorrowGoal: fields.goal ?? fields.tomorrowGoal,
    })

    if (!validation.valid) {
      setValidationError(validation.message)
      return { ok: false }
    }

    const existing = entries.find((e) => e.id === entryId)
    if (!existing) {
      setError('Entry not found.')
      return { ok: false }
    }

    const payload = {
      ...validation.fields,
      entryDate: existing.entryDate,
    }

    setSyncStatus('saving')

    if (isAuthenticated && user?.uid && firebaseReady) {
      if (!isOnline) {
        const updated = savePendingSyncEntry({ ...existing, ...payload, id: entryId, pendingSync: true })
        setEntries((prev) => mergePendingIntoEntries([updated, ...prev]))
        setSyncStatus('offline')
        return { ok: true, offline: true }
      }

      try {
        await saveJournalEntry(user.uid, {
          ...existing,
          ...payload,
          firestoreId: existing.firestoreId || (entryId.startsWith('local-') ? null : entryId),
          localEntryId: entryId.startsWith('local-') ? entryId : existing.localEntryId,
        })
        await loadAuthEntries()
        setSyncStatus('synced')
        return { ok: true }
      } catch {
        const updated = savePendingSyncEntry({ ...existing, ...payload, id: entryId, pendingSync: true })
        setEntries((prev) => mergePendingIntoEntries([updated, ...prev]))
        setSyncStatus('failed')
        return { ok: true, failed: true }
      }
    }

    try {
      if (entryId.startsWith('local-')) {
        const pending = getPendingSyncEntries()
        if (pending.some((e) => e.id === entryId)) {
          savePendingSyncEntry({
            ...existing,
            ...payload,
            id: entryId,
            pendingSync: true,
          })
        } else {
          updateGuestEntry(entryId, payload)
        }
      } else {
        updateGuestEntry(entryId, payload)
      }
      loadGuestEntries()
      setSyncStatus('local')
      return { ok: true }
    } catch (err) {
      setValidationError(err.message)
      setSyncStatus('idle')
      return { ok: false }
    }
  }

  return {
    entries,
    loading: loading || authLoading,
    error,
    validationError,
    syncStatus,
    isAuthenticated,
    isGuest: !isAuthenticated,
    saveEntry,
    updateEntry,
    deleteEntry,
    formatEntryDisplayDate,
    clearValidationError: () => setValidationError(null),
  }
}
