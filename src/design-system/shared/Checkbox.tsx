// ─── Checkbox ─────────────────────────────────────────────────────────────────
// Shared Vintiga checkbox.
// Sizes: sm (16px) · md (20px) · lg (24px)
// States: default · checked · indeterminate · disabled

export interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  subLabel?: string
  className?: string
}

const SIZE = {
  sm: { box: 16, icon: 10, radius: 3  },
  md: { box: 20, icon: 12, radius: 4  },
  lg: { box: 24, icon: 14, radius: 5  },
}

// ─── Checkmark SVG ────────────────────────────────────────────────────────────
function CheckMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Dash SVG (indeterminate) ─────────────────────────────────────────────────
function DashMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M2.5 6H9.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  subLabel,
  className = '',
}: CheckboxProps) {
  const { box, icon, radius } = SIZE[size]
  const active = checked || indeterminate

  const handleClick = () => {
    if (!disabled && onChange) onChange(!checked)
  }

  return (
    <label
      className={[
        'inline-flex items-start gap-2.5',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        disabled={disabled}
        onClick={disabled ? undefined : handleClick}
        className="shrink-0 flex items-center justify-center transition-colors border-none p-0 cursor-pointer disabled:cursor-not-allowed"
        style={{
          width: box,
          height: box,
          minWidth: box,
          borderRadius: radius,
          border: `1.5px solid ${active ? '#0046ad' : '#94a3b8'}`,
          background: active ? '#0046ad' : 'white',
          boxShadow: active ? '0 1px 2px rgba(100,116,139,0.2)' : 'none',
        }}
      >
        {checked && !indeterminate && <CheckMark size={icon} />}
        {indeterminate && <DashMark size={icon} />}
      </button>

      {(label || subLabel) && (
        <span className="flex flex-col gap-0.5 select-none">
          {label    && <span className="typo-body text-vintiga-foreground leading-5">{label}</span>}
          {subLabel && <span className="typo-body-sm text-vintiga-foreground-muted leading-4">{subLabel}</span>}
        </span>
      )}
    </label>
  )
}
