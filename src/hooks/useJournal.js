import { useState, useEffect, useCallback } from 'react'
import { useFirebase } from '../context/FirebaseContext'
import {
  fetchJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
} from '../services/journalService'

export function useJournal() {
  const { user, firebaseReady, loading: authLoading } = useFirebase()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadEntries = useCallback(async () => {
    if (!firebaseReady || !user) {
      if (!authLoading) {
        setLoading(false)
      }
      return
    }

    setLoading(true)
    setError(null)
    try {
      setEntries(await fetchJournalEntries(user.uid))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [firebaseReady, user, authLoading])

  useEffect(() => {
    if (authLoading) return
    loadEntries()
  }, [authLoading, loadEntries])

  const saveEntry = async (entry) => {
    if (!user) throw new Error('Sign in required to save journal entries.')

    await saveJournalEntry(user.uid, {
      ...entry,
      createdAt: new Date().toISOString(),
    })
    await loadEntries()
  }

  const deleteEntry = async (entryId) => {
    if (!user) throw new Error('Sign in required to delete journal entries.')

    await deleteJournalEntry(user.uid, entryId?.toString())
    await loadEntries()
  }

  return {
    entries,
    loading: loading || authLoading,
    error,
    saveEntry,
    deleteEntry,
  }
}
