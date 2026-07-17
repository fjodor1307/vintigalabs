import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@ds/icons/Icons'

// ─── MiniCalendar ─────────────────────────────────────────────────────────────
// Month-grid date picker for the reservations header. Prev/next month, a 6-week
// day grid (leading/trailing days muted), and an indigo selected day. Vintiga
// tokens throughout.

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export function MiniCalendar({ selected, onSelect }: { selected: Date; onSelect: (d: Date) => void }) {
  const [view, setView] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1))

  // 42 cells starting on the Sunday on/before the 1st of the month.
  const start = new Date(view)
  start.setDate(1 - view.getDay())
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })

  const shiftMonth = (delta: number) =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1))

  return (
    <div className="w-full">
      {/* Month header */}
      <div className="flex items-center justify-between mb-vintiga-sm">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-500 hover:bg-vintiga-slate-100 transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <span className="typo-body-sm font-semibold text-vintiga-slate-900">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-500 hover:bg-vintiga-slate-100 transition-colors"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday row */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-center typo-caption font-semibold text-vintiga-slate-500 py-1">{w}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d) => {
          const inMonth = d.getMonth() === view.getMonth()
          const isSelected = sameDay(d, selected)
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => onSelect(d)}
              className={[
                'h-8 inline-flex items-center justify-center rounded-vintiga-md typo-body-sm transition-colors',
                isSelected
                  ? 'bg-vintiga-primary text-white font-semibold'
                  : inMonth
                    ? 'text-vintiga-slate-900 hover:bg-vintiga-slate-100'
                    : 'text-vintiga-slate-400 hover:bg-vintiga-slate-50',
              ].join(' ')}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
