import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { XIcon } from '@ds/icons/Icons'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  width?: number
}

export function Modal({ open, onClose, title, children, footer, width = 512 }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 animate-[fadeUp_0.15s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative bg-vintiga-white rounded-vintiga-xl shadow-vintiga-lg flex flex-col max-h-[90vh]"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 px-6 py-5 border-b border-vintiga-slate-200 shrink-0">
          <h2 className="typo-title-subsection font-semibold text-vintiga-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Close"
          >
            <XIcon className="w-4 h-4 text-vintiga-slate-500" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <footer className="px-6 py-4 border-t border-vintiga-slate-200 flex items-center justify-between gap-3 shrink-0">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

// ── Common footer buttons ───────────────────────────────────────────────────

export function ModalButtonSecondary({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      type={rest.type ?? 'button'}
      className={[
        'px-4 py-2 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white',
        'typo-body-sm font-semibold text-vintiga-slate-700',
        'hover:bg-vintiga-slate-50 transition-colors cursor-pointer',
        rest.className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function ModalButtonPrimary({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      type={rest.type ?? 'button'}
      className={[
        'px-4 py-2 rounded-vintiga-md bg-vintiga-indigo-600 text-vintiga-white',
        'typo-body-sm font-semibold shadow-vintiga-sm',
        'hover:bg-vintiga-indigo-700 transition-colors border-none cursor-pointer',
        rest.className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function ModalButtonDestructive({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      type={rest.type ?? 'button'}
      className={[
        'px-4 py-2 rounded-vintiga-md border border-vintiga-red-200 bg-vintiga-white',
        'typo-body-sm font-semibold text-vintiga-red-600',
        'hover:bg-vintiga-red-50 transition-colors cursor-pointer',
        rest.className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

// ── Shared checkbox matching Figma (indigo, 16px) ───────────────────────────

export function CheckboxField({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  children: ReactNode
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded text-vintiga-indigo-600 accent-vintiga-indigo-600"
      />
      <span className="typo-body-sm text-vintiga-slate-900">{children}</span>
    </label>
  )
}
