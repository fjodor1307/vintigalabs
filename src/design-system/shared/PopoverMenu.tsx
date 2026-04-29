import { useEffect, useRef, useState, type ReactNode } from 'react'
import { DropdownMenu, DropdownItem } from '@ds/shared/Dropdown'

// ─── PopoverMenu ──────────────────────────────────────────────────────────────
// Generic "trigger + dropdown menu" helper. Wraps any trigger element with a
// click-outside-aware popover that renders DS DropdownItem rows.
//
// Usage:
//   <PopoverMenu
//     trigger={(_open, toggle) => (
//       <IconButton variant="outline" icon={<EllipsisIcon />} onClick={toggle} aria-label="More" />
//     )}
//     items={[
//       { label: 'View',      onClick: () => {} },
//       { label: 'Duplicate', onClick: () => {} },
//       { label: 'Archive',   onClick: () => {}, danger: true },
//     ]}
//   />

export interface PopoverMenuItem {
  label: ReactNode
  /** Click handler. Menu closes automatically before firing. */
  onClick?: () => void
  /** Render in red (destructive). */
  danger?: boolean
  /** Disable the row. */
  disabled?: boolean
  /** Optional leading icon (16 px). */
  icon?: ReactNode
}

export interface PopoverMenuProps {
  trigger: (open: boolean, toggle: () => void) => ReactNode
  items: PopoverMenuItem[]
  /** Horizontal alignment of the popup relative to the trigger. */
  align?: 'left' | 'right'
  /** Vertical placement. */
  placement?: 'bottom' | 'top'
  /** Fixed width of the popup. Default: w-44 (176 px). */
  width?: string
  /** Override className on the popup container. */
  className?: string
}

export function PopoverMenu({
  trigger,
  items,
  align = 'right',
  placement = 'bottom',
  width = 'w-44',
  className = '',
}: PopoverMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const popupClasses = [
    'absolute z-50',
    placement === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
    align === 'right' ? 'right-0' : 'left-0',
    width,
    className,
  ].join(' ')

  return (
    <span ref={ref} className="relative inline-flex">
      {trigger(open, () => setOpen((o) => !o))}
      {open && (
        <DropdownMenu className={popupClasses}>
          {items.map((it, i) => (
            <DropdownItem
              key={i}
              disabled={it.disabled}
              leftIcon={it.icon}
              onClick={() => {
                setOpen(false)
                it.onClick?.()
              }}
              className={it.danger ? '!text-vintiga-red-600 hover:!bg-vintiga-red-50' : ''}
            >
              {it.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </span>
  )
}
