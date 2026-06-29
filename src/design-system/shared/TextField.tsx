import type { ReactNode } from 'react'
import { CheckIcon, XIcon } from '@ds/icons/Icons'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TextFieldState = 'default' | 'focus' | 'success' | 'destructive' | 'disabled'

export interface TextFieldProps {
  /** Label rendered above the input */
  label?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Force a visual state. Default is reactive to :hover / :focus / disabled. */
  state?: TextFieldState
  /** Helper / hint text below the input */
  helperText?: string
  /** Error or character-count text on the right below the input */
  hintText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  type?: string
  id?: string
  name?: string
  autoFocus?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
}

// ─── Style maps (Figma-accurate) ─────────────────────────────────────────────

const WRAPPER_BASE =
  'flex items-center gap-2 h-10 px-3 rounded-vintiga-md border transition-colors bg-vintiga-white dark:bg-vintiga-surface-element'

const WRAPPER_STATE: Record<TextFieldState, string> = {
  default:
    'border-vintiga-slate-200 hover:border-vintiga-slate-300 focus-within:border-vintiga-indigo-600 focus-within:ring-2 focus-within:ring-vintiga-indigo-100 ' +
    'dark:border-transparent dark:hover:border-vintiga-surface-muted dark:focus-within:border-vintiga-primary dark:focus-within:ring-0',
  focus:
    'border-vintiga-indigo-600 ring-2 ring-vintiga-indigo-100',
  success:
    'border-vintiga-green-500 focus-within:ring-2 focus-within:ring-vintiga-green-100',
  destructive:
    'border-vintiga-red-500 focus-within:ring-2 focus-within:ring-vintiga-red-100',
  disabled:
    'border-vintiga-slate-200 bg-vintiga-slate-100 cursor-not-allowed',
}

const LABEL_STATE: Record<TextFieldState, string> = {
  default:     'text-vintiga-slate-900',
  focus:       'text-vintiga-slate-900',
  success:     'text-vintiga-slate-900',
  destructive: 'text-vintiga-slate-900',
  disabled:    'text-vintiga-slate-400',
}

const ICON_COLOR: Record<TextFieldState, string> = {
  default:     'text-vintiga-slate-400 dark:text-vintiga-foreground-muted',
  focus:       'text-vintiga-slate-500',
  success:     'text-vintiga-green-600',
  destructive: 'text-vintiga-red-600',
  disabled:    'text-vintiga-slate-400',
}

const HELPER_COLOR: Record<TextFieldState, string> = {
  default:     'text-vintiga-slate-500',
  focus:       'text-vintiga-slate-500',
  success:     'text-vintiga-green-600',
  destructive: 'text-vintiga-red-600',
  disabled:    'text-vintiga-slate-400',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TextField({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  state,
  helperText,
  hintText,
  leftIcon,
  rightIcon,
  type = 'text',
  id,
  name,
  autoFocus,
  disabled,
  required,
  className,
}: TextFieldProps) {
  const resolvedState: TextFieldState = disabled ? 'disabled' : state ?? 'default'

  // Auto icon for success / destructive states
  const resolvedRightIcon =
    rightIcon !== undefined
      ? rightIcon
      : resolvedState === 'success'
      ? <CheckIcon className="w-4 h-4" />
      : resolvedState === 'destructive'
      ? <XIcon className="w-4 h-4" />
      : null

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className ?? ''}`}>
      {label && (
        <label htmlFor={id} className={`typo-body-sm font-medium ${LABEL_STATE[resolvedState]}`}>
          {label}
          {required && <span className="text-vintiga-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className={[WRAPPER_BASE, WRAPPER_STATE[resolvedState]].join(' ')}>
        {leftIcon && <span className={`shrink-0 ${ICON_COLOR[resolvedState]}`}>{leftIcon}</span>}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          disabled={resolvedState === 'disabled'}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 dark:text-vintiga-foreground dark:placeholder:text-vintiga-foreground-muted focus:outline-none disabled:cursor-not-allowed disabled:text-vintiga-slate-400 min-w-0 border-none"
        />

        {resolvedRightIcon && (
          <span className={`shrink-0 ${ICON_COLOR[resolvedState]}`}>{resolvedRightIcon}</span>
        )}
      </div>

      {(helperText || hintText) && (
        <div className="flex items-center justify-between gap-2">
          {helperText && (
            <p className={`typo-caption ${HELPER_COLOR[resolvedState]}`}>{helperText}</p>
          )}
          {hintText && (
            <p className="typo-caption text-vintiga-slate-500 ml-auto">{hintText}</p>
          )}
        </div>
      )}
    </div>
  )
}
