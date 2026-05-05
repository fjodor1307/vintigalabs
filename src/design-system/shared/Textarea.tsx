import type { TextareaHTMLAttributes } from 'react'

// ─── Textarea ─────────────────────────────────────────────────────────────────
// Vintiga multi-line input — chrome matches `TextField` so dropdown / text /
// textarea all share the same border, hover, focus ring and disabled state.
// Use inside a <Field> for label + helper.
//
//   default  border-slate-200
//   hover    border-slate-300
//   focus    border-indigo-600 + ring-indigo-100
//   disabled bg-slate-100, faded
//
// Override `min-h-[…]` via `className` when a taller body is needed.

export type TextareaState = 'default' | 'success' | 'destructive' | 'disabled'

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** Force a visual state. Disabled also flips state regardless of this prop. */
  state?: TextareaState
}

const STATE: Record<TextareaState, string> = {
  default:
    'border-vintiga-slate-200 hover:border-vintiga-slate-300 focus:border-vintiga-indigo-600 focus:ring-2 focus:ring-vintiga-indigo-100',
  success:
    'border-vintiga-green-500 focus:ring-2 focus:ring-vintiga-green-100',
  destructive:
    'border-vintiga-red-500 focus:ring-2 focus:ring-vintiga-red-100',
  disabled:
    'border-vintiga-slate-200 bg-vintiga-slate-100 cursor-not-allowed',
}

export function Textarea({ state, disabled, className = '', ...rest }: TextareaProps) {
  const resolved: TextareaState = disabled ? 'disabled' : state ?? 'default'
  return (
    <textarea
      {...rest}
      disabled={disabled}
      className={[
        'w-full px-3 py-2.5 rounded-vintiga-md border bg-vintiga-white',
        'typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400',
        'focus:outline-none transition-colors',
        'min-h-[72px] resize-y',
        STATE[resolved],
        className,
      ].join(' ')}
    />
  )
}
