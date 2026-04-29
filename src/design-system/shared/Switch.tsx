import type { ReactNode } from 'react'

// ─── Switch ───────────────────────────────────────────────────────────────────
// Vintiga toggle — Figma-accurate, mirrors Checkbox / Radio structure.
//   Sizes:    sm (32 × 18) · md (46 × 24, default — matches Figma) · lg (52 × 28)
//   States:   off · on · disabled
//   Layouts:  bare · label-right (toggle | label) · between (label | toggle, full row)

export interface SwitchProps {
  /** Controlled on state. */
  checked: boolean
  /** Change handler. Receives the next checked value. */
  onChange?: (checked: boolean) => void
  /** Disabled — non-interactive, faded appearance. */
  disabled?: boolean
  /** Track size. Default: md (46 × 24). */
  size?: 'sm' | 'md' | 'lg'
  /** Inline label. */
  label?: ReactNode
  /** Description rendered below the label. */
  description?: ReactNode
  /**
   * Layout for label + switch.
   *   - `right` (default): toggle on the left, label/description to its right
   *   - `between`: label/description on the left filling the row, toggle pinned to the right
   */
  labelPosition?: 'right' | 'between'
  className?: string
  id?: string
  'aria-label'?: string
}

const SIZE = {
  sm: { trackW: 32, trackH: 18, thumb: 14, offset: 2, travel: 14 },
  md: { trackW: 46, trackH: 24, thumb: 20, offset: 2, travel: 22 }, // Figma spec
  lg: { trackW: 52, trackH: 28, thumb: 24, offset: 2, travel: 24 },
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  labelPosition = 'right',
  className = '',
  id,
  ...rest
}: SwitchProps) {
  const { trackW, trackH, thumb, offset, travel } = SIZE[size]

  const toggle = (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={!label && rest['aria-label'] ? rest['aria-label'] : undefined}
      disabled={disabled}
      onClick={disabled ? undefined : () => onChange?.(!checked)}
      className={[
        'relative shrink-0 rounded-full p-0 transition-colors duration-200 focus:outline-none',
        'focus-visible:ring-2 focus-visible:ring-vintiga-indigo-100 focus-visible:ring-offset-2',
        'border border-transparent',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer',
        checked
          ? 'bg-vintiga-indigo-500 hover:bg-vintiga-indigo-600'
          : 'bg-vintiga-slate-200 hover:bg-vintiga-slate-300',
      ].join(' ')}
      style={{ width: trackW, height: trackH }}
    >
      <span
        className="absolute top-1/2 rounded-full bg-vintiga-white shadow-vintiga transition-transform duration-200"
        style={{
          width: thumb,
          height: thumb,
          marginTop: -(thumb / 2),
          left: offset,
          transform: checked ? `translateX(${travel}px)` : 'translateX(0)',
        }}
      />
    </button>
  )

  // ── Bare (no label) ───────────────────────────────────────────────────────
  if (!label && !description) {
    return <span className={className}>{toggle}</span>
  }

  // ── Between layout (settings-row pattern: label fills, toggle on right) ───
  if (labelPosition === 'between') {
    return (
      <label
        htmlFor={id}
        className={[
          'flex items-start justify-between gap-vintiga-sm w-full',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          className,
        ].join(' ')}
      >
        <span className="flex flex-col gap-1 min-w-0 flex-1">
          {label && (
            <span className={`typo-body-sm font-medium leading-5 select-none ${disabled ? 'text-vintiga-slate-400' : 'text-vintiga-slate-900'}`}>
              {label}
            </span>
          )}
          {description && (
            <span className={`typo-caption leading-4 select-none ${disabled ? 'text-vintiga-slate-400' : 'text-vintiga-slate-500'}`}>
              {description}
            </span>
          )}
        </span>
        {toggle}
      </label>
    )
  }

  // ── Right layout (toggle on left, label to the right) ─────────────────────
  return (
    <label
      htmlFor={id}
      className={[
        'inline-flex gap-vintiga-sm',
        description ? 'items-start' : 'items-center',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {toggle}
      <span className="flex flex-col gap-0.5 min-w-0">
        {label && (
          <span className={`typo-body-sm font-medium leading-5 select-none ${disabled ? 'text-vintiga-slate-400' : 'text-vintiga-slate-900'}`}>
            {label}
          </span>
        )}
        {description && (
          <span className={`typo-caption leading-4 select-none ${disabled ? 'text-vintiga-slate-400' : 'text-vintiga-slate-500'}`}>
            {description}
          </span>
        )}
      </span>
    </label>
  )
}
