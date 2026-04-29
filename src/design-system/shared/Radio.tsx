import type { ReactNode } from 'react'

// ─── Radio ────────────────────────────────────────────────────────────────────
// Vintiga radio button — Figma-accurate, mirrors Checkbox structure.
//   Sizes:    sm (16 px) · md (20 px, default) · lg (24 px)
//   States:   default · hover · checked · disabled
//   Variants: bare circle · with label · with label + description

export interface RadioProps {
  /** Controlled checked state. */
  checked: boolean
  /** Change handler. */
  onChange?: () => void
  /** Disabled — non-interactive, faded appearance. */
  disabled?: boolean
  /** Outer circle size. Default: md (20 px). */
  size?: 'sm' | 'md' | 'lg'
  /** Inline label rendered to the right of the circle. */
  label?: ReactNode
  /** Description rendered below the label (smaller, slate-600). */
  description?: ReactNode
  /** @deprecated Use `description`. Kept for backwards compatibility. */
  subLabel?: ReactNode
  /** Accessible name when no visible label is provided. */
  'aria-label'?: string
  /** Form name (for native form integration). */
  name?: string
  /** Form value. */
  value?: string
  className?: string
}

const SIZE = {
  sm: { outer: 16, dot: 6,  border: 1.5 },
  md: { outer: 20, dot: 8,  border: 1.5 },
  lg: { outer: 24, dot: 10, border: 1.5 },
}

export function Radio({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  subLabel,
  className = '',
  name,
  value,
  ...rest
}: RadioProps) {
  const { outer, dot, border } = SIZE[size]
  const desc = description ?? subLabel

  const circleClasses = [
    'shrink-0 rounded-full flex items-center justify-center transition-colors p-0',
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    checked
      ? disabled
        ? 'bg-vintiga-white border-vintiga-indigo-300'
        : 'bg-vintiga-white border-vintiga-indigo-600 hover:border-vintiga-indigo-700'
      : disabled
        ? 'bg-vintiga-slate-50 border-vintiga-slate-200'
        : 'bg-vintiga-white border-vintiga-slate-300 hover:border-vintiga-slate-400',
  ].join(' ')

  const circleEl = (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={!label && rest['aria-label'] ? rest['aria-label'] : undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onChange}
      name={name}
      value={value}
      className={circleClasses}
      style={{
        width: outer,
        height: outer,
        minWidth: outer,
        borderWidth: border,
        borderStyle: 'solid',
      }}
    >
      {checked && (
        <span
          className={`rounded-full block ${disabled ? 'bg-vintiga-indigo-300' : 'bg-vintiga-indigo-600'}`}
          style={{ width: dot, height: dot }}
        />
      )}
    </button>
  )

  // ── Bare circle (no label, no description) ────────────────────────────────
  if (!label && !desc) {
    return <span className={className}>{circleEl}</span>
  }

  // ── Circle + label (and optionally description) ───────────────────────────
  return (
    <label
      className={[
        'inline-flex gap-2 select-none',
        desc ? 'items-start' : 'items-center',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {circleEl}
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
    </label>
  )
}
