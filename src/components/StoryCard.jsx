export default function StoryCard({ story, onEdit, onDelete, deleting }) {
  return (
    <li className="rounded-2xl bg-sand/50 p-8 border border-sand list-none">
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-xl text-navy">{story.name}</p>
        {story.isOwner && (
          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(story)}
              className="text-xs text-navy/60 hover:text-gold transition-colors"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(story.id)}
              disabled={deleting}
              className="text-xs text-navy/60 hover:text-rose-800 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {story.isOwner && <p className="text-xs text-sage mt-1">Your story</p>}
      {!story.isOwner && story.authorId && (
        <p className="text-xs text-navy/50 mt-1">Shared by someone in our community</p>
      )}

      <p className="mt-6 text-xs font-medium text-navy/50 uppercase tracking-wide">The struggle</p>
      <p className="mt-2 text-navy/80 leading-relaxed">{story.struggle}</p>

      <p className="mt-6 text-xs font-medium text-sage uppercase tracking-wide">What helped</p>
      <p className="mt-2 text-navy leading-relaxed">{story.helped}</p>

      {(story.verse || story.verseText) && (
        <blockquote className="mt-6 pt-6 border-t border-sand">
          {story.verseText && (
            <p className="font-display text-lg italic text-navy/80">{story.verseText}</p>
          )}
          {story.verse && (
            <cite className="block mt-2 text-sm text-gold not-italic">— {story.verse}</cite>
          )}
        </blockquote>
      )}
    </li>
  )
}
