import SectionTitle from '../components/SectionTitle'
import CategoryIcon from '../components/CategoryIcon'
import { smallStepsCategories } from '../data/smallSteps'

export default function SmallSteps() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <SectionTitle
        subtitle="You don't have to do everything. Pick one — or simply rest."
      >
        Small Steps
      </SectionTitle>

      <div className="grid md:grid-cols-3 gap-6">
        {smallStepsCategories.map((category) => (
          <div
            key={category.title}
            className={`rounded-2xl ${category.color} p-8 border border-sand/60`}
          >
            <h2 className="font-display text-2xl text-navy font-semibold flex items-center gap-3">
              <CategoryIcon
                name={category.icon}
                className={`w-8 h-8 shrink-0 ${
                  category.icon === 'emotional'
                    ? 'text-sage'
                    : category.icon === 'practical'
                      ? 'text-navy/50'
                      : 'text-gold'
                }`}
              />
              {category.title}
            </h2>
            <ul className="mt-6 space-y-4">
              {category.steps.map((step) => (
                <li
                  key={step}
                  className="flex items-start gap-3 text-navy"
                >
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center mt-12 text-sm text-navy/60 max-w-md mx-auto">
        Progress is not measured by how much you accomplish — but by showing up for yourself, even in small ways.
      </p>
    </section>
  )
}
