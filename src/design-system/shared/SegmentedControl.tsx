import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SegmentOption<V extends string = string> {
  value: V
  label?: ReactNode
  icon?: ReactNode
  /** If set, the segment renders as an `<a>` link (uncontrolled URL mode). */
  href?: string
  disabled?: boolean
}

export type SegmentedControlSize = 'sm' | 'md'

export interface SegmentedControlProps<V extends string = string> {
  options: SegmentOption<V>[]
  /** The currently selected value. */
  value: V
  /** Fires on segment select. Optional when all segments use `href` (link mode). */
  onChange?: (value: V) => void
  size?: SegmentedControlSize
  className?: string
  /**
   * When true, inactive segments show only their icon (no label).
   * The active segment always shows both icon + label.
   * Useful for dense filter bars with many options.
   */
  collapseInactive?: boolean
  /** Accessible label for screen readers. */
  'aria-label'?: string
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const SIZE: Record<SegmentedControlSize, { container: string; segment: string; iconOnly: string }> = {
  sm: {
    container: 'p-0.5 gap-0.5',
    segment:   'px-2.5 py-1 typo-caption font-medium gap-1',
    iconOnly:  'px-2 py-1',
  },
  md: {
    container: 'p-1 gap-1',
    segment:   'px-3 py-1.5 typo-body-sm font-medium gap-1.5',
    iconOnly:  'px-2.5 py-1.5',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SegmentedControl<V extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  collapseInactive = false,
  className = '',
  'aria-label': ariaLabel,
}: SegmentedControlProps<V>) {
  const sz = SIZE[size]
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={[
        'inline-flex bg-vintiga-slate-100 rounded-vintiga-md',
        sz.container,
        className,
      ].join(' ')}
    >
      {options.map((opt) => {
        const isActive = opt.value === value
        const showLabel = !collapseInactive || isActive

        const segmentCls = [
          'inline-flex items-center justify-center rounded-[4px] whitespace-nowrap transition-colors no-underline',
          // Use icon-only padding when label is hidden
          showLabel ? sz.segment : sz.iconOnly,
          isActive
            ? 'bg-vintiga-white text-vintiga-gray-900 shadow-vintiga-sm'
            : 'bg-transparent text-vintiga-gray-600 hover:text-vintiga-gray-900',
          opt.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].filter(Boolean).join(' ')

        const inner = (
          <>
            {opt.icon && <span className="shrink-0 inline-flex items-center">{opt.icon}</span>}
            {showLabel && opt.label && <span>{opt.label}</span>}
          </>
        )

        if (opt.href) {
          return (
            <a
              key={opt.value}
              href={opt.href}
              role="tab"
              aria-selected={isActive}
              aria-label={!showLabel && typeof opt.label === 'string' ? opt.label : undefined}
              title={!showLabel && typeof opt.label === 'string' ? opt.label : undefined}
              className={segmentCls}
              onClick={(e) => {
                if (opt.disabled) {
                  e.preventDefault()
                  return
                }
                onChange?.(opt.value)
              }}
            >
              {inner}
            </a>
          )
        }

        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={!showLabel && typeof opt.label === 'string' ? opt.label : undefined}
            title={!showLabel && typeof opt.label === 'string' ? opt.label : undefined}
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onChange?.(opt.value)}
            className={['border-none', segmentCls].join(' ')}
          >
            {inner}
          </button>
        )
      })}
    </div>
  )
}
