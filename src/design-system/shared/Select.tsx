import type { ReactNode, SelectHTMLAttributes } from 'react'
import { ChevronDownIcon } from '@ds/icons/Icons'

// ─── Select ───────────────────────────────────────────────────────────────────
// Native <select> styled to match Vintiga `TextField` chrome — h-10, slate-200
// border, rounded-md, indigo focus ring. Use inside a <Field> for label/helper.
//
// Pass either:
//   • `options` — array of strings; value === label
//   • `options` — array of {label, value} pairs
//   • `children` — raw <option> elements (full control, optgroups etc.)
//
// Usage:
//   <Field label="Status">
//     <Select
//       value={status}
//       onChange={(e) => setStatus(e.target.value as Status)}
//       options={[
//         { value: 'active',   label: 'Active' },
//         { value: 'inactive', label: 'Inactive' },
//       ]}
//     />
//   </Field>

type Option = string | { value: string; label: ReactNode }

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options?: Option[]
  children?: ReactNode
}

export function Select({ options, children, className = '', ...rest }: SelectProps) {
  return (
    <div className="relative">
      <select
        {...rest}
        className={[
          'h-10 w-full px-3 pr-9 rounded-vintiga-md',
          'border border-vintiga-slate-200 bg-vintiga-white transition-colors',
          'typo-body-sm text-vintiga-slate-900 appearance-none cursor-pointer',
          // Match the TextField + Textarea chrome — slate-200 default,
          // slate-300 on hover, indigo-600 focus + indigo-100 ring.
          'hover:border-vintiga-slate-300 focus:outline-none focus:border-vintiga-indigo-600 focus:ring-2 focus:ring-vintiga-indigo-100',
          rest.disabled ? 'opacity-60 cursor-not-allowed bg-vintiga-slate-100 hover:border-vintiga-slate-200' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children
          ? children
          : options?.map((o) =>
              typeof o === 'string' ? (
                <option key={o} value={o}>
                  {o}
                </option>
              ) : (
                <option key={o.value} value={o.value}>
                  {o.label as string}
                </option>
              ),
            )}
      </select>
      <ChevronDownIcon className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-vintiga-slate-400 pointer-events-none" />
    </div>
  )
}
