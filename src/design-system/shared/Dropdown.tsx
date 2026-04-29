import type { ReactNode } from 'react'
import { CheckIcon } from '@ds/icons/Icons'

/**
 * Dropdown — context menus, action menus, account menus.
 *
 * Anatomy:
 *   <DropdownMenu>
 *     <DropdownSection label="My Account">       ← optional group label
 *       <DropdownItem sublabel="Current Tenant"> ← optional top micro-label
 *         Vintiga Labs
 *       </DropdownItem>
 *     </DropdownSection>
 *     <DropdownSeparator />
 *     <DropdownSection>
 *       <DropdownItem onClick={…}>Profile</DropdownItem>
 *       <DropdownItem selected>Settings</DropdownItem>
 *       <DropdownItem leftIcon={<Icon />}>Sign Out</DropdownItem>
 *     </DropdownSection>
 *   </DropdownMenu>
 */

// ─── Menu container ────────────────────────────────────────────────────────────

export function DropdownMenu({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="menu"
      className={[
        'flex flex-col p-1',
        'bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-md shadow-vintiga-md',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

// ─── Section (optional group label + items) ────────────────────────────────────

export function DropdownSection({
  label,
  children,
}: {
  label?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col">
      {label && (
        <p className="px-3 pt-2 pb-1 typo-caption font-semibold text-vintiga-slate-900">
          {label}
        </p>
      )}
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

// ─── Separator ────────────────────────────────────────────────────────────────

export function DropdownSeparator() {
  return <div className="h-px bg-vintiga-slate-200 my-1 mx-1" />
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export interface DropdownItemProps {
  children: ReactNode
  /** Small secondary label rendered above the main label (e.g. "Current Tenant"). */
  sublabel?: ReactNode
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  /** When true the item renders as a plain div (non-interactive info row). */
  readOnly?: boolean
  className?: string
}

export function DropdownItem({
  children,
  sublabel,
  onClick,
  selected,
  disabled,
  leftIcon,
  rightIcon,
  readOnly = false,
  className = '',
}: DropdownItemProps) {
  const base = [
    'flex items-center gap-2 w-full px-2 py-1.5 rounded-[4px] text-left border-none transition-colors',
    sublabel ? 'items-start' : 'items-center',
    className,
  ]

  const stateClasses = disabled
    ? 'text-vintiga-slate-400 cursor-not-allowed bg-transparent'
    : selected
    ? 'text-vintiga-slate-900 bg-vintiga-slate-100 cursor-pointer'
    : readOnly
    ? 'text-vintiga-slate-900 bg-transparent cursor-default'
    : 'text-vintiga-slate-900 bg-transparent hover:bg-vintiga-slate-100 cursor-pointer'

  const inner = (
    <>
      {leftIcon && (
        <span className="shrink-0 inline-flex items-center text-vintiga-slate-500 mt-px">
          {leftIcon}
        </span>
      )}
      <span className="flex-1 min-w-0 flex flex-col">
        {sublabel && (
          <span className="typo-caption font-normal text-vintiga-slate-500 leading-4 truncate">
            {sublabel}
          </span>
        )}
        <span className="typo-body-sm font-medium text-vintiga-slate-900 truncate">{children}</span>
      </span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      {selected && !rightIcon && (
        <CheckIcon className="w-4 h-4 text-vintiga-slate-700 shrink-0" />
      )}
    </>
  )

  if (readOnly) {
    return (
      <div role="presentation" className={[...base, stateClasses].join(' ')}>
        {inner}
      </div>
    )
  }

  return (
    <button
      type="button"
      role="menuitem"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[...base, stateClasses].join(' ')}
    >
      {inner}
    </button>
  )
}

// ─── Legacy aliases (keep old names working) ───────────────────────────────────

/** @deprecated Use DropdownMenu */
export const Dropdown = DropdownMenu

/** @deprecated Use DropdownSection with label prop */
export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pt-2 pb-1 typo-caption font-semibold text-vintiga-slate-900">
      {children}
    </p>
  )
}
