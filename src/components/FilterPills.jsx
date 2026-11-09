export default function FilterPills({ label, options, active, onChange }) {
  const all = ['All', ...options]
  return (
    <div className="mb-3">
      {label && <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</div>}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {all.map((opt) => {
          const isActive = active === opt
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`shrink-0 text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-navy'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
