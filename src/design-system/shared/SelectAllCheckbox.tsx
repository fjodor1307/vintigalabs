import { useEffect, useRef, useState } from 'react'
import { Checkbox } from '@ds/shared/Checkbox'
import { DropdownMenu, DropdownItem } from '@ds/shared/Dropdown'

// ─── SelectAllCheckbox ────────────────────────────────────────────────────────
// Header-row checkbox with a dropdown indicator that opens a menu offering
// "Select all on page", "Select all", and (when something's selected) "Clear
// selection". Used in any product table that supports paginated bulk actions.

export interface SelectAllCheckboxProps {
  selectedCount: number
  totalOnPage: number
  totalAll: number
  onSelectPage: () => void
  onSelectAll: () => void
  onClear: () => void
}

export function SelectAllCheckbox({
  selectedCount,
  totalOnPage,
  totalAll,
  onSelectPage,
  onSelectAll,
  onClear,
}: SelectAllCheckboxProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const allChecked    = selectedCount === totalOnPage && totalOnPage > 0
  const indeterminate = selectedCount > 0 && !allChecked

  return (
    <div className="relative" ref={ref}>
      <Checkbox
        size="sm"
        checked={allChecked}
        indeterminate={indeterminate}
        onChange={() => (allChecked || indeterminate ? onClear() : onSelectPage())}
        dropdownIndicator
        onDropdownClick={() => setOpen((o) => !o)}
        aria-label="Select rows"
      />
      {open && (
        <DropdownMenu className="absolute top-full mt-1.5 left-0 z-50 w-56">
          <DropdownItem onClick={() => { onSelectPage(); setOpen(false) }}>
            Select all on page
            <span className="ml-auto typo-caption text-vintiga-slate-500">{totalOnPage}</span>
          </DropdownItem>
          <DropdownItem onClick={() => { onSelectAll(); setOpen(false) }}>
            Select all
            <span className="ml-auto typo-caption text-vintiga-slate-500">{totalAll}</span>
          </DropdownItem>
          {selectedCount > 0 && (
            <DropdownItem onClick={() => { onClear(); setOpen(false) }}>
              Clear selection
            </DropdownItem>
          )}
        </DropdownMenu>
      )}
    </div>
  )
}
