import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useFirebase } from '../context/FirebaseContext'
import { smallStepsCategories, REST_STEP } from '../data/smallSteps'
import { pickDailySteps, sortStepsByDateDesc, validateCustomStepText, createCustomStepId, isCustomStep } from '../lib/smallStepsUtils'
import {
  localDateKey,
  getLocalSmallStep,
  saveLocalSmallStep,
  deleteLocalSmallStep,
  getAllLocalSmallSteps,
  getDailyRefreshMeta,
  incrementDailyRefresh,
  savePendingSyncSmallStep,
  getPendingSyncSmallSteps,
  removePendingSyncSmallStep,
} from '../services/smallStepsLocalService'
import {
  fetchSmallSteps,
  saveSmallStep,
  deleteSmallStep,
} from '../services/smallStepsFirestoreService'
import { syncPendingSmallSteps } from '../services/smallStepsMigrationService'

export function useSmallSteps() {
  const { isAuthenticated, user, authLoading } = useAuth()
  const { firebaseReady } = useFirebase()
  const [todayStep, setTodayStep] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState('idle')
  const [refreshMeta, setRefreshMeta] = useState(() => getDailyRefreshMeta())
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  const todayKey = localDateKey()

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

  const dailySuggestions = useMemo(() => {
    const result = {}
    for (const category of smallStepsCategories) {
      result[category.id] = pickDailySteps(
        category.id,
        todayKey,
        refreshMeta[category.id] || 0
      )
    }
    return result
  }, [todayKey, refreshMeta])

  const loadGuestData = useCallback(() => {
    const step = getLocalSmallStep(todayKey)
    const all = getAllLocalSmallSteps()
    setTodayStep(step)
    setHistory(sortStepsByDateDesc(all.filter((s) => s.date !== todayKey)).slice(0, 7))
    setLoading(false)
  }, [todayKey])

  const loadAuthData = useCallback(async () => {
    if (!user?.uid) return

    setLoading(true)
    try {
      await syncPendingSmallSteps(user.uid)
      const cloudSteps = await fetchSmallSteps(user.uid)
      const pending = getPendingSyncSmallSteps()
      const pendingToday = pending.find((p) => p.date === todayKey)

      const today =
        pendingToday || cloudSteps.find((s) => s.date === todayKey) || getLocalSmallStep(todayKey)

      setTodayStep(today || null)
      setHistory(
        sortStepsByDateDesc(cloudSteps.filter((s) => s.date !== todayKey)).slice(0, 7)
      )
      setSyncStatus(pendingToday ? 'failed' : 'synced')
    } catch {
      loadGuestData()
      setSyncStatus('failed')
    } finally {
      setLoading(false)
    }
  }, [user?.uid, todayKey, loadGuestData])

  useEffect(() => {
    if (authLoading) return

    if (isAuthenticated && user?.uid && firebaseReady) {
      loadAuthData()
    } else {
      loadGuestData()
    }
  }, [authLoading, isAuthenticated, user?.uid, firebaseReady, loadAuthData, loadGuestData])

  useEffect(() => {
    if (!isAuthenticated || !user?.uid || !isOnline || !firebaseReady) return
    syncPendingSmallSteps(user.uid)
      .then(({ synced }) => {
        if (synced > 0) loadAuthData()
      })
      .catch(() => {})
  }, [isOnline, isAuthenticated, user?.uid, firebaseReady, loadAuthData])

  const persistStep = async (record) => {
    setSyncStatus('saving')

    if (isAuthenticated && user?.uid && firebaseReady) {
      if (!isOnline) {
        const saved = savePendingSyncSmallStep(record)
        saveLocalSmallStep(saved)
        setTodayStep(saved)
        setSyncStatus('offline')
        return { ok: true, offline: true }
      }

      try {
        saveLocalSmallStep(record)
        await saveSmallStep(user.uid, record)
        setTodayStep(record)
        setSyncStatus('synced')
        return { ok: true }
      } catch {
        const pending = savePendingSyncSmallStep(record)
        saveLocalSmallStep(pending)
        setTodayStep(pending)
        setSyncStatus('failed')
        return { ok: true, failed: true }
      }
    }

    const saved = saveLocalSmallStep(record)
    setTodayStep(saved)
    setSyncStatus('local')
    return { ok: true }
  }

  const selectStep = async ({ stepId, text, category }) => {
    if (todayStep?.completed) return { ok: false }

    const now = new Date().toISOString()
    const record = {
      stepId,
      text,
      category,
      date: todayKey,
      completed: false,
      createdAt: todayStep?.createdAt || now,
      completedAt: null,
    }

    return persistStep(record)
  }

  const selectRest = () =>
    selectStep({
      stepId: REST_STEP.stepId,
      text: REST_STEP.text,
      category: REST_STEP.category,
    })

  const completeStep = async () => {
    if (!todayStep || todayStep.completed) return { ok: false }

    const record = {
      ...todayStep,
      completed: true,
      completedAt: new Date().toISOString(),
    }

    return persistStep(record)
  }

  const clearTodayStep = async () => {
    if (!todayStep || todayStep.completed) return { ok: false }

    setSyncStatus('saving')
    deleteLocalSmallStep(todayKey)
    removePendingSyncSmallStep(todayKey)

    if (isAuthenticated && user?.uid && firebaseReady) {
      if (isOnline) {
        try {
          await deleteSmallStep(user.uid, todayKey)
          setSyncStatus('synced')
        } catch {
          setSyncStatus('failed')
        }
      } else {
        setSyncStatus('offline')
      }
    } else {
      setSyncStatus('local')
    }

    setTodayStep(null)
    return { ok: true }
  }

  const saveCustomStep = async (category, text) => {
    if (todayStep?.completed) return { ok: false }

    const validation = validateCustomStepText(text)
    if (!validation.valid) {
      return { ok: false, message: validation.message }
    }

    const stepId =
      todayStep && isCustomStep(todayStep.stepId) && todayStep.category === category
        ? todayStep.stepId
        : createCustomStepId()

    return selectStep({
      stepId,
      text: validation.text,
      category,
    })
  }

  const updateCustomStep = async (text) => {
    if (!todayStep || todayStep.completed || !isCustomStep(todayStep.stepId)) {
      return { ok: false }
    }

    const validation = validateCustomStepText(text)
    if (!validation.valid) {
      return { ok: false, message: validation.message }
    }

    const record = {
      ...todayStep,
      text: validation.text,
      completed: false,
      completedAt: null,
    }

    await persistStep(record)
    return { ok: true }
  }

  const refreshCategory = (categoryId) => {
    incrementDailyRefresh(categoryId, todayKey)
    setRefreshMeta(getDailyRefreshMeta(todayKey))
  }

  return {
    todayKey,
    todayStep,
    history,
    loading: loading || authLoading,
    syncStatus,
    isAuthenticated,
    dailySuggestions,
    selectStep,
    selectRest,
    completeStep,
    clearTodayStep,
    saveCustomStep,
    updateCustomStep,
    refreshCategory,
  }
}
