import type { ReactNode } from 'react'
import { ExternalLinkIcon } from '@ds/icons/Icons'

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// Vintiga app sidebar — Figma-accurate (132:55 / 258:2747).
//
// Composable building blocks:
//   <Sidebar collapsed={false}>
//     <SidebarHeader logo={…} title="Vintiga Labs, LLC" />
//     <SidebarBody>
//       <SidebarItem icon={…} label="Dashboard" selected />
//       <SidebarItem icon={…} label="Website" external />
//       <SidebarDivider />
//       <SidebarItem icon={…} label="Customers" />
//       <SidebarFooter>
//         <SidebarItem icon={…} label="Settings" />
//       </SidebarFooter>
//     </SidebarBody>
//   </Sidebar>

// ─── Context — passes `collapsed` down without prop drilling ──────────────────

import { createContext, useContext } from 'react'

const SidebarContext = createContext<{ collapsed: boolean }>({ collapsed: false })

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface SidebarProps {
  /** When true, hides labels and shows icon-only mode. */
  collapsed?: boolean
  /** Optional click on the whole sidebar (rare — prefer per-item). */
  onClick?: () => void
  children: ReactNode
  className?: string
}

export function Sidebar({ collapsed = false, children, className = '', ...rest }: SidebarProps) {
  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <aside
        className={[
          'flex flex-col gap-vintiga-sm h-full bg-vintiga-white border-r border-vintiga-slate-200 overflow-hidden',
          collapsed ? 'w-[72px]' : 'w-72',
          className,
        ].join(' ')}
        {...rest}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  )
}

// ─── Header (logo + workspace name) ───────────────────────────────────────────

export interface SidebarHeaderProps {
  /** Brand mark (40 × 40). Pass a `<VintigaIconIndigo />` or any node. */
  logo: ReactNode
  /** Workspace / company name shown next to the logo. Hidden when collapsed. */
  title?: ReactNode
  /** Optional click — for opening a workspace switcher. */
  onClick?: () => void
}

export function SidebarHeader({ logo, title, onClick }: SidebarHeaderProps) {
  const { collapsed } = useContext(SidebarContext)
  return (
    <div
      className={[
        'flex items-center h-16 w-full border-b border-vintiga-slate-200 shrink-0',
        collapsed ? 'justify-center px-vintiga-md' : 'px-3.5',
        onClick ? 'cursor-pointer hover:bg-vintiga-slate-50 transition-colors' : '',
      ].join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={`flex items-center gap-2 ${collapsed ? 'shrink-0' : 'flex-1 min-w-0'}`}>
        <div className="shrink-0 size-10 flex items-center justify-center">
          {logo}
        </div>
        {!collapsed && title && (
          <p className="flex-1 min-w-0 text-base leading-5 font-medium text-vintiga-slate-700 truncate">
            {title}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Body (scrollable nav region) ─────────────────────────────────────────────

export function SidebarBody({ children }: { children: ReactNode }) {
  const { collapsed } = useContext(SidebarContext)
  return (
    <div
      className={[
        'flex-1 flex flex-col gap-1 px-vintiga-md min-h-0 overflow-y-auto',
        collapsed ? 'items-center' : 'items-start w-full',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export interface SidebarItemProps {
  /** Icon (20 × 20 recommended). */
  icon: ReactNode
  /** Label — hidden when collapsed. */
  label: string
  /** Currently selected route. */
  selected?: boolean
  /** Disabled — non-interactive, faded. */
  disabled?: boolean
  /** Renders an external-link arrow on the right (open layout only). */
  external?: boolean
  /** Optional pill on the right (e.g. "Coming Soon"). */
  badge?: ReactNode
  /** Click handler. */
  onClick?: () => void
  /** Render as an anchor instead of a button. */
  href?: string
  /** Accessible label override (defaults to `label`). */
  'aria-label'?: string
}

export function SidebarItem({
  icon,
  label,
  selected,
  disabled,
  external,
  badge,
  onClick,
  href,
  ...rest
}: SidebarItemProps) {
  const { collapsed } = useContext(SidebarContext)

  const baseClasses = [
    'flex gap-2 p-2.5 rounded-vintiga-md transition-colors shrink-0',
    'border-0 bg-transparent text-left',
    collapsed
      ? 'items-center justify-center w-11 h-10'
      : 'items-center w-full',
    disabled
      ? 'cursor-not-allowed'
      : 'cursor-pointer',
    selected
      ? 'bg-vintiga-slate-100'
      : disabled
        ? ''
        : 'hover:bg-vintiga-slate-100',
  ].join(' ')

  const labelClasses = [
    'typo-body-sm font-semibold leading-5 whitespace-nowrap',
    selected
      ? 'text-vintiga-indigo-600'
      : disabled
        ? 'text-vintiga-slate-300'
        : 'text-vintiga-slate-700',
  ].join(' ')

  const iconClasses = [
    'shrink-0 w-5 h-5 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5',
    selected
      ? 'text-vintiga-indigo-600'
      : disabled
        ? 'text-vintiga-slate-300'
        : 'text-vintiga-slate-700',
  ].join(' ')

  const inner = (
    <>
      <div className={`flex items-center gap-3 ${collapsed ? 'shrink-0' : 'flex-1 min-w-0'}`}>
        <span className={iconClasses}>{icon}</span>
        {!collapsed && <span className={labelClasses}>{label}</span>}
      </div>
      {!collapsed && badge}
      {!collapsed && external && (
        <ExternalLinkIcon className={`w-5 h-5 shrink-0 ${selected ? 'text-vintiga-indigo-600' : 'text-vintiga-slate-500'}`} />
      )}
    </>
  )

  if (href && !disabled) {
    return (
      <a
        href={href}
        aria-label={rest['aria-label'] ?? label}
        title={collapsed ? label : undefined}
        className={`${baseClasses} no-underline`}
        onClick={onClick}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      aria-label={rest['aria-label'] ?? label}
      title={collapsed ? label : undefined}
      aria-current={selected ? 'page' : undefined}
      className={baseClasses}
    >
      {inner}
    </button>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function SidebarDivider() {
  const { collapsed } = useContext(SidebarContext)
  return (
    <div
      className={collapsed ? 'h-5 w-8 flex items-center justify-center shrink-0' : 'h-5 w-full flex items-center shrink-0'}
      aria-hidden="true"
    >
      <div className="h-px w-full bg-vintiga-slate-200" />
    </div>
  )
}

// ─── Footer (sticky bottom — POS Profiles, Settings, etc) ─────────────────────

export function SidebarFooter({ children }: { children: ReactNode }) {
  const { collapsed } = useContext(SidebarContext)
  return (
    <div
      className={[
        'flex flex-col gap-2 pb-vintiga-md mt-auto w-full',
        collapsed ? 'items-center' : 'items-start',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

// ─── Badge (small pill — "Coming Soon", etc) ─────────────────────────────────

export interface SidebarBadgeProps {
  children: ReactNode
  /** Tone. Default: indigo (matches Figma "Coming Soon" pill). */
  tone?: 'indigo' | 'slate'
}

export function SidebarBadge({ children, tone = 'indigo' }: SidebarBadgeProps) {
  const tones = {
    indigo: 'bg-vintiga-indigo-100 border-vintiga-indigo-200 text-vintiga-indigo-700',
    slate:  'bg-vintiga-slate-100 border-vintiga-slate-200 text-vintiga-slate-700',
  } as const
  return (
    <span
      className={[
        'inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] leading-[15px] font-medium border',
        tones[tone],
      ].join(' ')}
    >
      {children}
    </span>
  )
}
