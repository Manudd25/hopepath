export default function SectionTitle({ children, subtitle, className = '' }) {
  return (
    <div className={`text-center mb-10 ${className}`}>
      <h2 className="font-display text-3xl md:text-4xl text-navy font-semibold text-balance">
        {children}
      </h2>
      {subtitle && (
        <p className="mt-3 text-navy/70 max-w-xl mx-auto text-sm md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  )
}
