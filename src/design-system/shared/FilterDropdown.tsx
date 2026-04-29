import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '@ds/shared/Button'
import { Checkbox } from '@ds/shared/Checkbox'
import { DropdownMenu, DropdownSeparator } from '@ds/shared/Dropdown'
import { ChevronDownIcon } from '@ds/icons/Icons'

// ─── FilterDropdown ───────────────────────────────────────────────────────────
// "Trigger button + checkbox list + Clear / Apply" pattern. Used for table
// filter rails (Status, Type, Channel, etc.). Trigger lights up indigo when
// any options are applied and shows a count badge.
//
// Usage:
//   <FilterDropdown
//     label="Status"
//     options={[
//       { value: 'active',   label: 'Active' },
//       { value: 'inactive', label: 'Inactive' },
//     ]}
//     value={status}
//     onChange={setStatus}
//   />

export interface FilterOption<T extends string> {
  value: T
  label: ReactNode
  /** Optional leading icon shown before the label. */
  icon?: ReactNode
}

export interface FilterDropdownProps<T extends string> {
  /** Trigger button text. */
  label: ReactNode
  /** Available options. */
  options: FilterOption<T>[]
  /** Currently applied set. */
  value: Set<T>
  /** Called when the user clicks Apply. */
  onChange: (next: Set<T>) => void
  /** Heading shown above the checkbox list. Defaults to `Filter by {label}`. */
  heading?: ReactNode
  /** Width of the popup. Default: w-60 (240 px). */
  width?: string
  /** Horizontal alignment. */
  align?: 'left' | 'right'
}

export function FilterDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
  heading,
  width = 'w-60',
  align = 'right',
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Set<T>>(new Set(value))
  const ref = useRef<HTMLDivElement>(null)

  // Sync draft when popup opens (or external value changes while closed)
  useEffect(() => {
    if (!open) setDraft(new Set(value))
  }, [open, value])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const toggle = (v: T) => {
    setDraft((prev) => {
      const next = new Set(prev)
      if (next.has(v)) next.delete(v)
      else next.add(v)
      return next
    })
  }

  const apply = () => { onChange(new Set(draft)); setOpen(false) }
  const clear = () => { setDraft(new Set()); onChange(new Set()); setOpen(false) }

  const hasFilter = value.size > 0

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="md"
        rightIcon={<ChevronDownIcon />}
        onClick={() => { setDraft(new Set(value)); setOpen((o) => !o) }}
        className={hasFilter ? '!bg-vintiga-indigo-50 !border-vintiga-indigo-200 !text-vintiga-indigo-700 hover:!bg-vintiga-indigo-100' : ''}
      >
        {label}
        {hasFilter && (
          <span className="ml-1 w-4 h-4 rounded-full bg-vintiga-indigo-600 text-vintiga-white text-[10px] font-semibold flex items-center justify-center">
            {value.size}
          </span>
        )}
      </Button>

      {open && (
        <DropdownMenu className={`absolute top-full mt-1.5 ${align === 'right' ? 'right-0' : 'left-0'} z-50 ${width} gap-1 p-3`}>
          <p className="typo-body-sm font-medium text-vintiga-slate-900 px-1 pb-1">
            {heading ?? <>Filter by {label}</>}
          </p>
          <div className="max-h-64 overflow-y-auto flex flex-col gap-0.5 -mx-1 px-1">
            {options.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-vintiga-md hover:bg-vintiga-slate-50">
                <Checkbox size="sm" checked={draft.has(opt.value)} onChange={() => toggle(opt.value)} />
                {opt.icon && <span className="shrink-0 inline-flex items-center text-vintiga-slate-500 [&>svg]:w-4 [&>svg]:h-4">{opt.icon}</span>}
                <span className="typo-body-sm font-medium text-vintiga-slate-900">{opt.label}</span>
              </label>
            ))}
          </div>
          <DropdownSeparator />
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={clear}
              className="flex-1 px-2.5 py-1.5 rounded-[4px] border border-vintiga-slate-300 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={apply}
              className="flex-1 px-2.5 py-1.5 rounded-[4px] border border-vintiga-slate-300 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Apply
            </button>
          </div>
        </DropdownMenu>
      )}
    </div>
  )
}
