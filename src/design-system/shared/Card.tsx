import type { ReactNode } from 'react'

// ─── Card state utilities ─────────────────────────────────────────────────────
// Use these in any screen that needs card-like interactive elements but can't
// use the Card component directly (e.g. custom layout, <a> tags, etc.).
// These are the canonical values — never hardcode card colours elsewhere.
//
//   Default  → bg-vintiga-surface, border-vintiga-border
//   Hover    → border-vintiga-slate-400  (slate-400, NEVER blue on hover)
//   Selected → bg-vintiga-primary-soft, border-vintiga-primary
//
// eslint-disable-next-line react-refresh/only-export-components
export const cardCls = {
  base:        'rounded-2xl border overflow-hidden transition-colors',
  default:     'bg-vintiga-surface border-vintiga-border',
  interactive: 'bg-vintiga-surface border-vintiga-border hover:border-vintiga-slate-400 cursor-pointer transition-colors',
  selected:    'bg-vintiga-primary-soft border-vintiga-primary',
} as const

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardProps {
  /**
   * Content for the header slot (top zone, sits above content).
   * Receives 16px padding on all sides.
   */
  header?: ReactNode
  /**
   * Main body content. Receives 16px horizontal padding.
   * Vertical padding only applied when no header/footer surrounds it —
   * use pt/pb utilities inside to control spacing relative to adjacent slots.
   */
  children?: ReactNode
  /**
   * Content for the footer slot (bottom zone, sits below content).
   * Receives 16px padding on all sides.
   */
  footer?: ReactNode
  /** Renders the card in the selected state (blue border + soft blue bg). */
  selected?: boolean
  /** Makes the card interactive — adds hover state and cursor-pointer. */
  onClick?: () => void
  /** Optional divider lines between header/content/footer. */
  showDividers?: boolean
  className?: string
  style?: React.CSSProperties
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Card({
  header,
  children,
  footer,
  selected = false,
  onClick,
  showDividers = false,
  className,
  style,
}: CardProps) {
  const isInteractive = !!onClick

  const shellBase = 'rounded-2xl border overflow-hidden transition-colors'

  const shellState = selected
    ? 'bg-vintiga-primary-soft border-vintiga-primary'
    : isInteractive
    ? 'bg-vintiga-surface border-vintiga-border hover:border-vintiga-slate-400 cursor-pointer'
    : 'bg-vintiga-surface border-vintiga-border'

  const divider = showDividers ? 'border-t border-vintiga-border' : ''

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${shellBase} ${shellState} w-full text-left ${className ?? ''}`}
        style={style}
      >
        {header != null && <div className="px-4 py-4">{header}</div>}
        {children != null && <div className={`px-4 py-4 ${header != null ? divider : ''}`}>{children}</div>}
        {footer != null && <div className={`px-4 py-4 ${(header != null || children != null) ? divider : ''}`}>{footer}</div>}
      </button>
    )
  }

  return (
    <div
      className={`${shellBase} ${shellState} w-full ${className ?? ''}`}
      style={style}
    >
      {header != null && (
        <div className="px-4 py-4">
          {header}
        </div>
      )}
      {children != null && (
        <div className={`px-4 py-4 ${header != null ? divider : ''}`}>
          {children}
        </div>
      )}
      {footer != null && (
        <div className={`px-4 py-4 ${(header != null || children != null) ? divider : ''}`}>
          {footer}
        </div>
      )}
    </div>
  )
}
