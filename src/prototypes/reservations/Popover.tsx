import { useEffect, useRef, useState, type ReactNode } from 'react'

// ─── Popover ──────────────────────────────────────────────────────────────────
// Lightweight content popover: a trigger + a click-outside-aware panel that
// renders arbitrary content (not just menu rows like PopoverMenu). Used for the
// reservations header's date picker, tasks, and notes panels. `children` is a
// render-prop receiving a `close` fn so panels can dismiss themselves (e.g. on
// date select).

export function Popover({
  trigger,
  children,
  align = 'left',
  width = 'w-80',
}: {
  trigger: (open: boolean, toggle: () => void) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  width?: string
}) {
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

  return (
    <span ref={ref} className="relative inline-flex">
      {trigger(open, () => setOpen((o) => !o))}
      {open && (
        <div
          className={[
            'absolute z-50 top-full mt-1.5',
            align === 'right' ? 'right-0' : 'left-0',
            width,
            'bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-md shadow-vintiga-lg p-vintiga-lg',
          ].join(' ')}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </span>
  )
}
