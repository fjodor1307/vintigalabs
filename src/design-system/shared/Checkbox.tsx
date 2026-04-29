import type { ReactNode } from 'react'
import { ChevronDownIcon } from '@ds/icons/Icons'

// ─── Checkbox ─────────────────────────────────────────────────────────────────
// Vintiga checkbox — Figma-accurate.
//   Sizes:        sm (16 px) · md (20 px, default) · lg (24 px)
//   States:       default · hover · checked · indeterminate · disabled
//   Variants:     bare box · with label · with label + description · with dropdown indicator

export interface CheckboxProps {
  /** Controlled checked state. */
  checked?: boolean
  /** Indeterminate state — shows a dash instead of a check. */
  indeterminate?: boolean
  /** Change handler. Receives the next checked value. */
  onChange?: (checked: boolean) => void
  /** Disabled — non-interactive, faded appearance. */
  disabled?: boolean
  /** Box size. Default: md (20 px). */
  size?: 'sm' | 'md' | 'lg'
  /** Inline label rendered to the right of the box. */
  label?: ReactNode
  /** Description rendered below the label (smaller, slate-600). */
  description?: ReactNode
  /** @deprecated Use `description`. Kept for backwards compatibility. */
  subLabel?: ReactNode
  /** Show a chevron-down icon to the right of the box (table-header pattern). */
  dropdownIndicator?: boolean
  /** Click handler for the dropdown indicator (only used when `dropdownIndicator` is true). */
  onDropdownClick?: () => void
  /** Accessible name when no visible label is provided. */
  'aria-label'?: string
  className?: string
}

const SIZE = {
  sm: { box: 16, icon: 10, radius: 3 },
  md: { box: 20, icon: 12, radius: 4 },
  lg: { box: 24, icon: 14, radius: 5 },
}

// ─── Marks ────────────────────────────────────────────────────────────────────

function CheckMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6H9.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  subLabel,
  dropdownIndicator = false,
  onDropdownClick,
  className = '',
  ...rest
}: CheckboxProps) {
  const { box, icon, radius } = SIZE[size]
  const active = checked || indeterminate
  const desc = description ?? subLabel

  const handleClick = () => {
    if (!disabled && onChange) onChange(!checked)
  }

  const boxClasses = [
    'shrink-0 flex items-center justify-center transition-colors p-0 border',
    disabled
      ? 'cursor-not-allowed'
      : 'cursor-pointer',
    active
      ? disabled
        ? 'bg-vintiga-indigo-300 border-vintiga-indigo-300'
        : 'bg-vintiga-indigo-600 border-vintiga-indigo-600 hover:bg-vintiga-indigo-700 hover:border-vintiga-indigo-700'
      : disabled
        ? 'bg-vintiga-slate-50 border-vintiga-slate-200'
        : 'bg-vintiga-white border-vintiga-slate-300 hover:border-vintiga-slate-400',
  ].join(' ')

  const boxEl = (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={!label && rest['aria-label'] ? rest['aria-label'] : undefined}
      disabled={disabled}
      onClick={disabled ? undefined : handleClick}
      className={boxClasses}
      style={{ width: box, height: box, minWidth: box, borderRadius: radius }}
    >
      {checked && !indeterminate && <CheckMark size={icon} />}
      {indeterminate && <DashMark size={icon} />}
    </button>
  )

  // ── Bare box (no label, no description, no dropdown) ──────────────────────
  if (!label && !desc && !dropdownIndicator) {
    return <span className={className}>{boxEl}</span>
  }

  // ── Box + dropdown chevron (table-header pattern, no label) ───────────────
  if (dropdownIndicator && !label && !desc) {
    return (
      <span className={`inline-flex items-center gap-0 ${className}`}>
        {boxEl}
        <button
          type="button"
          onClick={onDropdownClick}
          aria-label="More options"
          className="shrink-0 w-3.5 h-3.5 flex items-center justify-center text-vintiga-slate-500 hover:text-vintiga-slate-700 transition-colors cursor-pointer p-0 bg-transparent border-0"
        >
          <ChevronDownIcon className="w-3.5 h-3.5" />
        </button>
      </span>
    )
  }

  // ── Box + label (and optionally description) ──────────────────────────────
  return (
    <label
      className={[
        'inline-flex gap-2 select-none',
        desc ? 'items-start' : 'items-center',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {boxEl}
      <span className="flex flex-col gap-0.5 min-w-0">
        {label && (
          <span className={[
            'typo-body-sm font-medium leading-5',
            disabled ? 'text-vintiga-slate-400' : 'text-vintiga-slate-900',
          ].join(' ')}>
            {label}
          </span>
        )}
        {desc && (
          <span className={[
            'typo-caption leading-4',
            disabled ? 'text-vintiga-slate-400' : 'text-vintiga-slate-600',
          ].join(' ')}>
            {desc}
          </span>
        )}
      </span>
      {dropdownIndicator && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onDropdownClick?.() }}
          aria-label="More options"
          className="shrink-0 w-3.5 h-3.5 flex items-center justify-center text-vintiga-slate-500 hover:text-vintiga-slate-700 transition-colors cursor-pointer p-0 bg-transparent border-0"
        >
          <ChevronDownIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </label>
  )
}
