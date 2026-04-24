import { useState, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Visual state for a single OTP box.
 * Figma: 02. Core Components › node 2-19038
 *
 * default       — empty, grey border
 * active        — digit entered, green ring + green inner border
 * focus         — currently focused (empty), blue ring
 * error         — error state, empty, red border
 * error-active  — error state, digit present, red ring + red inner border
 */
export type OtpBoxState = 'default' | 'active' | 'focus' | 'error' | 'error-active'

// ─── Single box (visual only) ─────────────────────────────────────────────────

function OtpBox({ state, value }: { state: OtpBoxState; value: string }) {
  // Active states use outer shadow ring + inner bordered box
  if (state === 'active' || state === 'error-active') {
    const ringColor = state === 'error-active' ? '#f87171' : '#86efac'
    const borderCls = state === 'error-active' ? 'border-vintiga-error' : 'border-[#22c55e]'
    return (
      <div
        className="size-12 rounded-lg bg-vintiga-surface overflow-clip shrink-0"
        style={{ boxShadow: `0 0 0 2px ${ringColor}` }}
      >
        <div className={`size-full rounded-lg border ${borderCls} flex items-center justify-center`}>
          <span className="text-[14px] font-light text-vintiga-foreground leading-5 tracking-[0.14px]">
            {value}
          </span>
        </div>
      </div>
    )
  }

  // Default / focus / error — single bordered box
  const borderCls =
    state === 'error'
      ? 'border-vintiga-error'
      : state === 'focus'
      ? 'border-vintiga-slate-400 shadow-[0_0_0_2px_rgba(0,70,173,0.2)]'
      : 'border-vintiga-border'

  return (
    <div
      className={`size-12 rounded-lg bg-vintiga-surface border ${borderCls} flex items-center justify-center p-2.5 shrink-0 transition-all`}
    >
      <span className="text-[14px] font-light text-vintiga-foreground leading-5 tracking-[0.14px]">
        {value}
      </span>
    </div>
  )
}

// ─── Interactive group ────────────────────────────────────────────────────────

export interface OtpInputGroupProps {
  /** Array of 6 digit strings (empty string = empty box) */
  value: string[]
  onChange: (next: string[]) => void
  /** Show error state on all boxes */
  error?: boolean
  /** Ref array to allow parent to programmatically focus boxes */
  inputRefs?: React.MutableRefObject<(HTMLInputElement | null)[]>
  autoFocus?: boolean
}

/**
 * OtpInputGroup — six interactive OTP boxes.
 * Figma: 02. Core Components › node 40002076-2133
 *
 * Each box overlays a transparent <input> over the visual OtpBox so the
 * browser handles focus, keyboard navigation, and mobile keyboards natively.
 */
export function OtpInputGroup({
  value,
  onChange,
  error = false,
  inputRefs: externalRefs,
  autoFocus = false,
}: OtpInputGroupProps) {
  const localRefs = useRef<(HTMLInputElement | null)[]>([])
  const refs = externalRefs ?? localRefs

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return
    const next = [...value]
    next[index] = inputValue.slice(-1)
    onChange(next)
    if (inputValue && index < 5) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const getState = (index: number): OtpBoxState => {
    const hasValue = value[index] !== ''
    const isFocused = focusedIndex === index
    if (error) return hasValue ? 'error-active' : 'error'
    if (hasValue) return 'active'
    if (isFocused) return 'focus'
    return 'default'
  }

  return (
    <div className="flex gap-2 items-center">
      {value.map((digit, i) => (
        <div key={i} className="relative size-12 shrink-0">
          <OtpBox state={getState(i)} value={digit} />
          <input
            ref={(el) => { refs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            autoFocus={autoFocus && i === 0}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(null)}
            className="absolute inset-0 opacity-0 cursor-text"
            aria-label={`Digit ${i + 1}`}
          />
        </div>
      ))}
    </div>
  )
}
