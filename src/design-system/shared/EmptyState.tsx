import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  /** Icon to display — rendered in vintiga-primary colour at 32 × 32 px. */
  icon?: ReactNode
  /** Primary message. Required. */
  title: string
  /** Supporting copy below the title. */
  description?: string
  /** Label for the optional CTA button. Requires onAction. */
  actionLabel?: string
  /** Handler for the optional CTA button. Requires actionLabel. */
  onAction?: () => void
  /** Extra classes on the root container (e.g. min-height overrides). */
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`border border-vintiga-border rounded-2xl flex flex-col items-center justify-center gap-vintiga-md px-vintiga-lg py-vintiga-2xl w-full text-center ${className ?? ''}`}
    >
      {/* Icon */}
      {icon != null && (
        <div className="text-vintiga-primary">{icon}</div>
      )}

      {/* Text */}
      <div className="flex flex-col items-center gap-1">
        <p className="typo-body font-semibold text-vintiga-foreground">{title}</p>
        {description != null && (
          <p className="typo-body font-light text-vintiga-foreground-muted">{description}</p>
        )}
      </div>

      {/* Optional CTA */}
      {actionLabel != null && onAction != null && (
        <button
          type="button"
          onClick={onAction}
          className="mt-vintiga-sm bg-vintiga-primary text-vintiga-primary-foreground rounded-vintiga-button px-6 py-2.5 typo-body-sm font-semibold hover:bg-vintiga-primary-hover transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
