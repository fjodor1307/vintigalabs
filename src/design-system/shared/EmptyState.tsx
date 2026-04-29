import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  /** Icon shown inside the slate-50 pill at the top — typically 20×20 px (`w-5 h-5`). */
  icon?: ReactNode
  /** Primary headline. Required. */
  title: string
  /** Supporting description below the title. */
  description?: string
  /** Primary action — pass a `<Button>` (or any ReactNode). */
  action?: ReactNode
  /** Optional secondary action — sits to the right of the primary. */
  secondaryAction?: ReactNode
  /** Show the white-card border + rounded corners. Default: true. */
  bordered?: boolean
  /** Extra classes on the root container. */
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  bordered = true,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-vintiga-md p-vintiga-xl text-center',
        bordered ? 'bg-vintiga-white border border-vintiga-slate-200 rounded-2xl' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Icon pill */}
      {icon && (
        <div className="w-10 h-10 rounded-full bg-vintiga-slate-50 flex items-center justify-center text-vintiga-slate-600 shrink-0 [&>svg]:w-5 [&>svg]:h-5">
          {icon}
        </div>
      )}

      {/* Text */}
      <div className="flex flex-col items-center gap-0.5 w-full">
        <p className="text-lg leading-7 font-semibold text-vintiga-slate-900">{title}</p>
        {description && (
          <p className="typo-body-sm text-vintiga-slate-500">{description}</p>
        )}
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-vintiga-sm">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}
