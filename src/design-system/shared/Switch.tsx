// ─── Switch ───────────────────────────────────────────────────────────────────
// Shared Vintiga toggle switch.
// Sizes: sm (32×18) · md (40×22) · lg (48×26)
// States: on · off · disabled

export interface SwitchProps {
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

const SIZE = {
  sm: { trackW: 32, trackH: 18, thumb: 14, offset: 2, travel: 14 },
  md: { trackW: 40, trackH: 22, thumb: 18, offset: 2, travel: 18 },
  lg: { trackW: 48, trackH: 26, thumb: 22, offset: 2, travel: 22 },
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  className = '',
}: SwitchProps) {
  const { trackW, trackH, thumb, offset, travel } = SIZE[size]

  return (
    <label
      className={[
        'inline-flex items-center gap-2.5',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={disabled ? undefined : () => onChange?.(!checked)}
        className="relative shrink-0 rounded-full border-none p-0 cursor-pointer disabled:cursor-not-allowed transition-colors duration-200"
        style={{
          width: trackW,
          height: trackH,
          background: checked ? '#0046ad' : '#e2e8f0',
        }}
      >
        <span
          className="absolute top-1/2 rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{
            width: thumb,
            height: thumb,
            marginTop: -(thumb / 2),
            left: offset,
            transform: checked ? `translateX(${travel}px)` : 'translateX(0)',
          }}
        />
      </button>

      {label && (
        <span className="typo-body text-vintiga-foreground select-none">{label}</span>
      )}
    </label>
  )
}
