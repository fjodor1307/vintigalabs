import { type ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { XIcon } from '@ds/icons/Icons'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = 'sm' | 'md' | 'lg'
export type ModalIconColor = 'red' | 'orange' | 'blue' | 'green' | 'indigo' | 'slate'

// ─── Icon pill ────────────────────────────────────────────────────────────────

const ICON_COLOR_MAP: Record<ModalIconColor, string> = {
  red:    'bg-vintiga-red-100 text-vintiga-red-600',
  orange: 'bg-vintiga-orange-100 text-vintiga-orange-600',
  blue:   'bg-vintiga-blue-100 text-vintiga-blue-600',
  green:  'bg-vintiga-green-100 text-vintiga-green-600',
  indigo: 'bg-vintiga-indigo-100 text-vintiga-indigo-600',
  slate:  'bg-vintiga-slate-100 text-vintiga-slate-600',
}

interface ModalIconProps {
  /** Coloured background tone */
  color?: ModalIconColor
  /** sm = 8px padding (inline alert), md = 12px padding (centred success) */
  size?: 'sm' | 'md'
  children: ReactNode
}

export function ModalIcon({ color = 'slate', size = 'sm', children }: ModalIconProps) {
  return (
    <div
      className={[
        'flex items-center justify-center rounded-full shrink-0',
        size === 'md' ? 'p-3' : 'p-2',
        ICON_COLOR_MAP[color],
        '[&>svg]:w-6 [&>svg]:h-6',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

// ─── Modal root ───────────────────────────────────────────────────────────────

const SIZE_MAP: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

interface ModalProps {
  open: boolean
  onClose: () => void
  /** Default: md (448px) */
  size?: ModalSize
  children: ReactNode
}

export function Modal({ open, onClose, size = 'md', children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Popup
          className={[
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'bg-vintiga-white rounded-vintiga-lg shadow-vintiga-xl',
            'w-[calc(100vw-2rem)]',
            SIZE_MAP[size],
            'flex flex-col overflow-hidden',
          ].join(' ')}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ─── Header (form variant) ────────────────────────────────────────────────────
// Large title (20 px / typo-title-section) + optional description + optional X

interface ModalHeaderProps {
  title: string
  description?: string
  /** Renders a close × button in the top-right corner */
  onClose?: () => void
}

export function ModalHeader({ title, description, onClose }: ModalHeaderProps) {
  return (
    <div className="flex gap-vintiga-md items-start px-vintiga-lg pt-vintiga-lg pb-vintiga-sm">
      <div className="flex flex-col gap-vintiga-xs flex-1 min-w-0">
        <Dialog.Title className="typo-title-section font-semibold text-vintiga-slate-900 leading-7">
          {title}
        </Dialog.Title>
        {description && (
          <Dialog.Description className="typo-body-sm text-vintiga-slate-500">
            {description}
          </Dialog.Description>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 w-6 h-6 flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-slate-700 transition-colors cursor-pointer"
        >
          <XIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

// ─── Alert header (icon + medium title + description in one row) ──────────────
// Used by danger / warning / info alert variants (16 px title, no close button)

interface ModalAlertHeaderProps {
  icon: ReactNode
  iconColor?: ModalIconColor
  title: string
  description: ReactNode
}

export function ModalAlertHeader({ icon, iconColor = 'slate', title, description }: ModalAlertHeaderProps) {
  return (
    <div className="flex gap-vintiga-md items-start px-vintiga-lg pt-vintiga-lg pb-vintiga-md">
      <ModalIcon color={iconColor} size="sm">
        {icon}
      </ModalIcon>
      <div className="flex flex-col gap-vintiga-xs flex-1 min-w-0">
        <Dialog.Title className="typo-body font-semibold text-vintiga-slate-900">
          {title}
        </Dialog.Title>
        <Dialog.Description className="typo-body-sm text-vintiga-slate-500">
          <span>{description}</span>
        </Dialog.Description>
      </div>
    </div>
  )
}

// ─── Centred header (icon above, text centred — success / status variant) ────

interface ModalCenteredHeaderProps {
  icon: ReactNode
  iconColor?: ModalIconColor
  title: string
  description?: string
}

export function ModalCenteredHeader({ icon, iconColor = 'green', title, description }: ModalCenteredHeaderProps) {
  return (
    <div className="flex flex-col gap-vintiga-md items-center text-center px-vintiga-lg pt-vintiga-lg pb-vintiga-sm">
      <ModalIcon color={iconColor} size="md">
        {icon}
      </ModalIcon>
      <div className="flex flex-col gap-vintiga-xs items-center">
        <Dialog.Title className="typo-body font-semibold text-vintiga-slate-900">
          {title}
        </Dialog.Title>
        {description && (
          <Dialog.Description className="typo-body-sm text-vintiga-slate-500">
            {description}
          </Dialog.Description>
        )}
      </div>
    </div>
  )
}

// ─── Body (form content area) ─────────────────────────────────────────────────

interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
  return (
    <div className={`flex flex-col gap-vintiga-md px-vintiga-lg pt-vintiga-lg pb-vintiga-md ${className}`}>
      {children}
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

interface ModalFooterProps {
  children: ReactNode
  /** Slate-50 background with top border — used by alert variants */
  shaded?: boolean
  /** Buttons expand to fill full width side-by-side — used by success variant */
  fullWidth?: boolean
}

export function ModalFooter({ children, shaded, fullWidth }: ModalFooterProps) {
  const childArray = Array.isArray(children) ? children : [children]
  return (
    <div
      className={[
        'flex items-center gap-vintiga-sm px-vintiga-lg pb-vintiga-lg',
        shaded
          ? 'bg-vintiga-slate-50 border-t border-vintiga-slate-100 pt-vintiga-lg'
          : 'pt-vintiga-sm',
        fullWidth ? 'flex-row' : 'justify-end',
      ].join(' ')}
    >
      {fullWidth
        ? childArray.map((child, i) => (
            <div key={i} className="flex-1">
              {child}
            </div>
          ))
        : children}
    </div>
  )
}
