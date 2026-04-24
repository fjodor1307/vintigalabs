import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-vintiga-md py-vintiga-2xl">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-vintiga-surface-element flex items-center justify-center text-vintiga-foreground-muted">
          {icon}
        </div>
      )}
      <div className="flex flex-col items-center gap-vintiga-sm">
        <h3 className="typo-title-subsection font-semibold text-vintiga-foreground">{title}</h3>
        {description && (
          <p className="typo-body-sm text-vintiga-foreground-muted">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
