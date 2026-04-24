import type { ReactNode } from 'react'
import { CheckIcon, XIcon } from '@ds/icons/Icons'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TextFieldState = 'default' | 'focus' | 'success' | 'destructive' | 'disabled'

export interface TextFieldProps {
  /** Floating label rendered above the input */
  label?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Controls border colour, ring, and auto icon. Default: 'default' */
  state?: TextFieldState
  /** Helper / hint text below the input (bottom-left) */
  helperText?: string
  /** Error or character-count text below the input (bottom-right) */
  hintText?: string
  /** Icon rendered on the left inside the field */
  leftIcon?: ReactNode
  /**
   * Icon rendered on the right inside the field.
   * If omitted, success/destructive states auto-show CheckIcon / XIcon.
   */
  rightIcon?: ReactNode
  type?: string
  id?: string
  name?: string
  autoFocus?: boolean
  className?: string
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const WRAPPER: Record<TextFieldState, string> = {
  default:
    'border-vintiga-border bg-vintiga-surface focus-within:border-vintiga-slate-400 focus-within:shadow-[0_0_0_2px_rgba(0,70,173,0.2)]',
  focus:
    'border-vintiga-slate-400 bg-vintiga-surface shadow-[0_0_0_2px_rgba(0,70,173,0.2)]',
  success:
    'border-vintiga-green-500 bg-vintiga-surface shadow-[0_0_0_2px_var(--color-vintiga-green-300)]',
  destructive:
    'border-vintiga-error bg-vintiga-surface shadow-[0_0_0_2px_var(--color-vintiga-red-300)]',
  disabled:
    'border-vintiga-border bg-vintiga-surface opacity-50 cursor-not-allowed',
}

const ICON_COLOR: Record<TextFieldState, string> = {
  default:     'text-vintiga-foreground-muted',
  focus:       'text-vintiga-foreground-muted',
  success:     'text-vintiga-success',
  destructive: 'text-vintiga-error',
  disabled:    'text-vintiga-foreground-muted',
}

const HELPER_COLOR: Record<TextFieldState, string> = {
  default:     'text-vintiga-foreground-muted',
  focus:       'text-vintiga-foreground-muted',
  success:     'text-vintiga-success',
  destructive: 'text-vintiga-error',
  disabled:    'text-vintiga-foreground-muted',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TextField({
  label,
  placeholder = 'Type here',
  value,
  defaultValue,
  onChange,
  state = 'default',
  helperText,
  hintText,
  leftIcon,
  rightIcon,
  type = 'text',
  id,
  name,
  autoFocus,
  className,
}: TextFieldProps) {
  const isDisabled = state === 'disabled'

  // Auto right icon for success / destructive if none provided
  const resolvedRightIcon =
    rightIcon !== undefined
      ? rightIcon
      : state === 'success'
      ? <CheckIcon className="w-4 h-4" />
      : state === 'destructive'
      ? <XIcon className="w-4 h-4" />
      : null

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className ?? ''}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="text-[16px] font-light text-vintiga-foreground leading-6 tracking-[0.08px]"
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div
        className={`
          flex items-center gap-2 px-4 py-3 rounded-lg border transition-all
          shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]
          ${WRAPPER[state]}
        `.trim().replace(/\s+/g, ' ')}
      >
        {leftIcon && (
          <span className={`shrink-0 flex items-center ${ICON_COLOR[state]}`}>
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isDisabled}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent text-[16px] font-light text-vintiga-foreground leading-6 tracking-[0.08px] placeholder:text-vintiga-foreground-muted placeholder:opacity-80 focus:outline-none disabled:cursor-not-allowed min-w-0"
        />

        {resolvedRightIcon && (
          <span className={`shrink-0 flex items-center ${ICON_COLOR[state]}`}>
            {resolvedRightIcon}
          </span>
        )}
      </div>

      {/* Bottom row */}
      {(helperText || hintText) && (
        <div className="flex items-center justify-between gap-2">
          {helperText && (
            <p className={`text-[12px] leading-4 tracking-[0.24px] ${HELPER_COLOR[state]}`}>
              {helperText}
            </p>
          )}
          {hintText && (
            <p className="text-[12px] leading-4 tracking-[0.24px] text-vintiga-foreground-muted ml-auto">
              {hintText}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
