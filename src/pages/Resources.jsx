import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import { resourceCategories, disclaimer } from '../data/resources'

function ResourceItem({ item, categoryTitle }) {
  const [open, setOpen] = useState(false)
  const panelId = `${categoryTitle}-${item.name}`.replace(/\s+/g, '-').toLowerCase()

  return (
    <li className="rounded-xl bg-sand/40 border border-sand overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-sand/60 transition-colors"
      >
        <span className="min-w-0">
          <p className="font-medium text-navy">{item.name}</p>
          <p className="text-sm text-navy/70 mt-1">{item.description}</p>
        </span>
        <span
          className={`shrink-0 mt-0.5 text-gold transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open && (
        <div id={panelId} className="px-4 pb-4 pt-0 border-t border-sand/80">
          <p className="text-sm text-navy/75 leading-relaxed">{item.detail}</p>
        </div>
      )}
    </li>
  )
}

export default function Resources() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <SectionTitle subtitle="Curated encouragement for different seasons of life. Tap a topic to read more.">
        Resources
      </SectionTitle>

      <div className="space-y-10">
        {resourceCategories.map((category) => (
          <div key={category.title}>
            <h2 className="font-display text-2xl text-navy font-semibold flex items-center gap-2">
              <span className="text-gold">{category.icon}</span>
              {category.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {category.items.map((item) => (
                <ResourceItem
                  key={item.name}
                  item={item}
                  categoryTitle={category.title}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <aside className="mt-12 rounded-xl bg-rose/20 border border-rose/40 p-6">
        <p className="text-sm text-navy/80 leading-relaxed">{disclaimer}</p>
      </aside>
    </section>
  )
}
