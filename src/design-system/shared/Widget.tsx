import type { ReactNode } from 'react'

// ─── Widget ───────────────────────────────────────────────────────────────────
// Vintiga widget container — Figma-accurate (133:7475).
// Use for dashboard cards, chart panels, anywhere you need:
//   • title + description
//   • header actions (filter dropdown · export icon · etc.)
//   • a flexible body slot
//
// Two ways to use:
//
// 1. Convenience — pass title / description / actions as props:
//      <Widget title="Sales" description="Last 30 days" actions={<Button …/>}>
//        <Chart />
//      </Widget>
//
// 2. Composable — drop in the building blocks:
//      <Widget>
//        <WidgetHeader title="Sales" description="Last 30 days" actions={…} />
//        <WidgetBody>
//          <Chart />
//        </WidgetBody>
//      </Widget>

// ─── Header ───────────────────────────────────────────────────────────────────

export interface WidgetHeaderProps {
  /** Required title — 24 px / `font-semibold` / slate-900. */
  title: ReactNode
  /** Optional description below the title — 14 px slate-500. */
  description?: ReactNode
  /** Optional right-side action cluster (buttons, dropdowns, icon buttons). */
  actions?: ReactNode
}

export function WidgetHeader({ title, description, actions }: WidgetHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-vintiga-sm gap-y-vintiga-md w-full shrink-0">
      <div className="flex flex-col gap-vintiga-sm flex-1 min-w-[247px]">
        <h3 className="text-2xl leading-8 font-semibold text-vintiga-slate-900">
          {title}
        </h3>
        {description && (
          <p className="typo-body-sm text-vintiga-slate-500">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-vintiga-sm shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

// ─── Body ─────────────────────────────────────────────────────────────────────

export interface WidgetBodyProps {
  children: ReactNode
  className?: string
}

export function WidgetBody({ children, className = '' }: WidgetBodyProps) {
  return (
    <div className={`flex-1 min-h-0 w-full flex flex-col gap-vintiga-md ${className}`}>
      {children}
    </div>
  )
}

// ─── Footer (optional — divider + actions row) ────────────────────────────────

export interface WidgetFooterProps {
  children: ReactNode
  /** Adds a top border. Default: true. */
  bordered?: boolean
}

export function WidgetFooter({ children, bordered = true }: WidgetFooterProps) {
  return (
    <div
      className={[
        'w-full flex items-center justify-end gap-vintiga-sm shrink-0',
        bordered ? 'pt-vintiga-md border-t border-vintiga-slate-200' : '',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface WidgetProps {
  /** Convenience — auto-renders a <WidgetHeader>. Omit and use <WidgetHeader> directly for full control. */
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  /** Body content. */
  children: ReactNode
  /** Card padding. Default: lg (24 px) — matches Figma. */
  padding?: 'md' | 'lg'
  className?: string
}

export function Widget({
  title,
  description,
  actions,
  children,
  padding = 'lg',
  className = '',
}: WidgetProps) {
  return (
    <section
      className={[
        'flex flex-col gap-vintiga-lg w-full bg-vintiga-white border border-vintiga-slate-200 rounded-2xl',
        padding === 'lg' ? 'p-vintiga-lg' : 'p-vintiga-md',
        className,
      ].join(' ')}
    >
      {(title || description || actions) && (
        <WidgetHeader title={title ?? ''} description={description} actions={actions} />
      )}
      {children}
    </section>
  )
}
