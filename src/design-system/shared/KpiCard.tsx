import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KpiCardProps {
  label: string
  value: string
  icon?: ReactNode
  /** Optional progress towards a goal. Pair `goalLabel` with `progressPercent` (0–100). */
  goalLabel?: string
  progressPercent?: number
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KpiCard({
  label,
  value,
  icon,
  goalLabel,
  progressPercent,
  className = '',
}: KpiCardProps) {
  const hasProgress = typeof progressPercent === 'number'
  const pct = hasProgress ? Math.max(0, Math.min(100, progressPercent!)) : 0

  return (
    <div
      className={[
        'bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-2xl p-vintiga-lg',
        'flex flex-col gap-vintiga-sm',
        className,
      ].join(' ')}
    >
      {/* Header row — label + icon */}
      <div className="flex items-start justify-between gap-vintiga-md">
        <span className="typo-body-sm font-medium text-vintiga-gray-900">{label}</span>
        {icon && (
          <div className="w-10 h-10 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <p
        className="font-semibold text-vintiga-gray-900"
        style={{ fontSize: 24, lineHeight: '32px' }}
      >
        {value}
      </p>

      {/* Optional progress */}
      {hasProgress && (
        <div className="flex flex-col gap-vintiga-sm mt-vintiga-sm">
          <div className="h-1.5 w-full rounded-full bg-vintiga-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-vintiga-indigo-500 transition-[width]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            {goalLabel && (
              <span className="typo-caption font-semibold text-vintiga-slate-500">
                {goalLabel}
              </span>
            )}
            <span className="typo-caption font-semibold text-vintiga-slate-500 ml-auto">
              {pct}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
