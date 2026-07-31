import { useState, useEffect, useCallback } from 'react'
import {
  fetchStories,
  createStory,
  updateStory,
  deleteStory,
  getBuiltInStoriesOnly,
} from '../services/storiesService'
import { isFirebaseConfigured } from '../lib/firebase'
import { useFirebase } from '../context/FirebaseContext'
export function useStories() {
  const { user, firebaseReady, loading: authLoading } = useFirebase()
  const [stories, setStories] = useState(getBuiltInStoriesOnly)
  const [loading, setLoading] = useState(isFirebaseConfigured())
  const [error, setError] = useState(null)

  const loadStories = useCallback(async () => {
    if (!isFirebaseConfigured()) {
      setStories(getBuiltInStoriesOnly())
      setLoading(false)
      return
    }

    if (!firebaseReady || !user) {
      setLoading(authLoading)
      return
    }

    setLoading(true)
    setError(null)
    try {
      setStories(await fetchStories(user.uid))
    } catch (err) {
      setError(err.message)
      setStories(getBuiltInStoriesOnly())
    } finally {
      setLoading(false)
    }
  }, [firebaseReady, user, authLoading])

  useEffect(() => {
    if (authLoading) return
    loadStories()
  }, [authLoading, loadStories])

  const saveStory = async (story, storyId = null) => {
    if (!user) throw new Error('Sign in required to share stories.')

    if (storyId) {
      await updateStory(storyId, story)
    } else {
      await createStory(user.uid, story)
    }
    await loadStories()
  }

  const removeStory = async (storyId) => {
    if (!user) throw new Error('Sign in required to delete stories.')

    await deleteStory(storyId)
    await loadStories()
  }

  return {
    stories,
    loading: loading || authLoading,
    error,
    saveStory,
    removeStory,
    refresh: loadStories,
    canSubmit: isFirebaseConfigured() && firebaseReady,
  }
}
