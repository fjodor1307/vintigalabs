// ─── Radio ────────────────────────────────────────────────────────────────────
// Shared Vintiga radio button.
// Sizes: sm (16px) · md (20px) · lg (24px)
// States: default · checked · disabled

export interface RadioProps {
  checked: boolean
  onChange?: () => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  subLabel?: string
  className?: string
}

const SIZE = {
  sm: { outer: 16, dot: 6,  border: 1.5 },
  md: { outer: 20, dot: 8,  border: 2   },
  lg: { outer: 24, dot: 10, border: 2   },
}

export function Radio({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  subLabel,
  className = '',
}: RadioProps) {
  const { outer, dot, border } = SIZE[size]

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
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={disabled ? undefined : onChange}
        className="shrink-0 rounded-full flex items-center justify-center transition-colors border-none p-0 bg-transparent cursor-pointer disabled:cursor-not-allowed"
        style={{
          width: outer,
          height: outer,
          minWidth: outer,
          border: `${border}px solid ${checked ? '#0046ad' : '#94a3b8'}`,
          background: checked ? '#0046ad' : 'white',
        }}
      >
        {checked && (
          <span
            className="rounded-full bg-white"
            style={{ width: dot, height: dot, display: 'block' }}
          />
        )}
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
