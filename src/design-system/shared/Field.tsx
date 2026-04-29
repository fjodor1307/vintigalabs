import type { ReactNode } from 'react'

// ─── Field ────────────────────────────────────────────────────────────────────
// Label + control + helper-text wrapper for forms. Pairs naturally with the
// inputs in `@ds/shared/TextField` etc., or any custom control passed as
// `children`. Use the optional `action` slot for an inline trailing control on
// the label row (e.g. a "Suggest with AI" chip).
//
// Usage:
//   <Field label="Title" required helper="Shown on the storefront.">
//     <TextField placeholder="Enter title" />
//   </Field>

export interface FieldProps {
  label: ReactNode
  /** Renders a red asterisk after the label. */
  required?: boolean
  /** Caption shown below the control. */
  helper?: ReactNode
  /** Trailing control on the label row (e.g. AI generate chip, link). */
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Field({ label, required, helper, action, children, className = '' }: FieldProps) {
  return (
    <div className={['flex flex-col gap-1.5', className].join(' ')}>
      <div className="flex items-center justify-between gap-2">
        <label className="typo-body-sm font-medium text-vintiga-slate-700">
          {label}
          {required && <span className="text-vintiga-red-500 ml-0.5">*</span>}
        </label>
        {action}
      </div>
      {children}
      {helper && <p className="typo-caption text-vintiga-slate-500">{helper}</p>}
    </div>
  )
}
