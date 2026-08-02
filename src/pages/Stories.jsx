import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import StoryForm from '../components/StoryForm'
import StoryCard from '../components/StoryCard'
import { useStories } from '../hooks/useStories'
import { useAuth } from '../context/AuthContext'

export default function Stories() {
  const { stories, loading, error, saveStory, removeStory, canSubmit } = useStories()
  const { authError, openAuthModal, authLoading } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editingStory, setEditingStory] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const handleCreate = async (form) => {
    await saveStory(form)
    setShowForm(false)
  }

  const handleUpdate = async (form) => {
    await saveStory(form, editingStory.id)
    setEditingStory(null)
  }

  const handleDelete = async (storyId) => {
    if (!window.confirm('Delete your story? This cannot be undone.')) return
    setDeletingId(storyId)
    try {
      await removeStory(storyId)
      if (editingStory?.id === storyId) setEditingStory(null)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <SectionTitle subtitle="Read stories from others walking similar paths — and share your own when you're ready.">
        Stories from people still walking through the storm.
      </SectionTitle>

      {(authError || error) && (
        <p className="mb-6 text-sm text-rose-800 bg-rose/30 rounded-xl p-4 border border-rose text-center">
          {authError || error}
        </p>
      )}

      <div className="mb-12">
        {editingStory ? (
          <StoryForm
            initial={{
              name: editingStory.name === 'Anonymous' ? '' : editingStory.name,
              struggle: editingStory.struggle,
              helped: editingStory.helped,
              verse: editingStory.verse,
              verseText: editingStory.verseText,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingStory(null)}
            submitLabel="Save changes"
          />
        ) : showForm ? (
          <StoryForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        ) : (
          <div className="text-center">
            {canSubmit ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                disabled={authLoading}
                className="px-8 py-3 rounded-full bg-gold text-navy font-medium hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                Share your story
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                disabled={authLoading}
                className="px-8 py-3 rounded-full bg-gold text-navy font-medium hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                Sign in to share your story
              </button>
            )}
            <p className="mt-3 text-xs text-navy/50">
              Only you can edit or delete stories you submit.
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-center text-navy/50">Loading stories…</p>
      ) : (
        <ul className="space-y-6">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onEdit={setEditingStory}
              onDelete={handleDelete}
              deleting={deletingId === story.id}
            />
          ))}
        </ul>
      )}

      {!loading && stories.length === 0 && (
        <p className="text-center text-navy/50">No stories yet. Be the first to share hope.</p>
      )}
    </section>
  )
}
