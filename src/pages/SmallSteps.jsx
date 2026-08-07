import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import SmallStepCard from '../components/SmallStepCard'
import TodayStep from '../components/TodayStep'
import RecentSmallSteps from '../components/RecentSmallSteps'
import { smallStepsCategories } from '../data/smallSteps'
import { useSmallSteps } from '../hooks/useSmallSteps'

export default function SmallSteps() {
  const {
    todayStep,
    history,
    loading,
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
  } = useSmallSteps()

  const [completing, setCompleting] = useState(false)
  const [savingCustom, setSavingCustom] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [removing, setRemoving] = useState(false)

  const selectionLocked = Boolean(todayStep?.completed)

  const handleSelect = async (step, categoryId) => {
    if (selectionLocked) return
    await selectStep({ stepId: step.stepId, text: step.text, category: categoryId })
  }

  const handleSaveCustom = async (text, categoryId) => {
    setSavingCustom(true)
    try {
      return await saveCustomStep(categoryId, text)
    } finally {
      setSavingCustom(false)
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await completeStep()
    } finally {
      setCompleting(false)
    }
  }

  const handleRemove = async () => {
    if (!window.confirm('Remove today\u2019s step? You can choose a different one.')) return
    setRemoving(true)
    try {
      await clearTodayStep()
    } finally {
      setRemoving(false)
    }
  }

  const handleEdit = async (text) => {
    setSavingEdit(true)
    try {
      return await updateCustomStep(text)
    } finally {
      setSavingEdit(false)
    }
  }

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <SectionTitle subtitle="You don't have to do everything. Pick one — or simply rest.">
          Small Steps
        </SectionTitle>
        <p className="text-center text-sm text-navy/50 mt-8">Loading today&apos;s steps…</p>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <SectionTitle subtitle="You don't have to do everything. Pick one — or simply rest.">
        Small Steps
      </SectionTitle>

      <div className="grid md:grid-cols-3 gap-6">
        {smallStepsCategories.map((category) => (
          <SmallStepCard
            key={category.id}
            category={category}
            steps={dailySuggestions[category.id] || []}
            selectedStep={todayStep}
            onSelect={(step) => handleSelect(step, category.id)}
            onRefresh={refreshCategory}
            onSaveCustom={(text) => handleSaveCustom(text, category.id)}
            selectionLocked={selectionLocked}
            savingCustom={savingCustom}
          />
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-navy/60">Nothing feels manageable today?</p>
        <p className="text-sm text-navy/55 mt-1 italic">Rest can be a small step too.</p>
        <button
          type="button"
          onClick={selectRest}
          disabled={selectionLocked || todayStep?.stepId === 'rest'}
          className="mt-4 px-6 py-2.5 rounded-full border border-sand text-sm text-navy/70 hover:text-navy hover:border-gold/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-40"
        >
          Choose rest for today
        </button>
      </div>

      {todayStep && (
        <div className="mt-10 max-w-xl mx-auto">
          <TodayStep
            step={todayStep}
            onComplete={handleComplete}
            onEdit={handleEdit}
            onRemove={handleRemove}
            completing={completing}
            savingEdit={savingEdit}
            removing={removing}
            syncStatus={syncStatus}
            isAuthenticated={isAuthenticated}
          />
        </div>
      )}

      <RecentSmallSteps history={history} />

      <p className="text-center mt-12 text-sm text-navy/60 max-w-md mx-auto">
        Progress is not measured by how much you accomplish — but by showing up for yourself, even
        in small ways.
      </p>
    </section>
  )
}
