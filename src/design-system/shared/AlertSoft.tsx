import type { ReactNode } from 'react'
import { InfoIcon, CheckCircleIcon, WarningIcon, CircleAlertIcon, CircleXIcon, XIcon } from '@ds/icons/Icons'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertSoftVariant = 'default' | 'info' | 'success' | 'warning' | 'error'

export interface AlertSoftProps {
  /** Visual variant. Default: 'info' */
  variant?: AlertSoftVariant
  /** Bold title line */
  title?: string
  /** Muted subtitle line */
  subtitle?: string
  /** Override the default left icon */
  icon?: ReactNode
  /** Show a small outlined action button */
  actionLabel?: string
  onAction?: () => void
  /** Show the close (×) button */
  onClose?: () => void
  className?: string
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CONFIG: Record<AlertSoftVariant, {
  bg: string
  iconColor: string
  DefaultIcon: React.ComponentType<{ className?: string }>
}> = {
  default: {
    bg: 'bg-vintiga-surface-element',
    iconColor: 'text-vintiga-foreground-muted',
    DefaultIcon: CircleAlertIcon,
  },
  info: {
    bg: 'bg-vintiga-primary-soft',
    iconColor: 'text-vintiga-primary',
    DefaultIcon: InfoIcon,
  },
  success: {
    bg: 'bg-vintiga-success-soft',
    iconColor: 'text-vintiga-success',
    DefaultIcon: CheckCircleIcon,
  },
  warning: {
    bg: 'bg-vintiga-warning-soft',
    iconColor: 'text-vintiga-amber-600',
    DefaultIcon: WarningIcon,
  },
  error: {
    bg: 'bg-vintiga-error-soft',
    iconColor: 'text-vintiga-error',
    DefaultIcon: CircleXIcon,
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AlertSoft({
  variant = 'info',
  title,
  subtitle,
  icon,
  actionLabel,
  onAction,
  onClose,
  className,
}: AlertSoftProps) {
  const { bg, iconColor, DefaultIcon } = CONFIG[variant]

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-[14px] rounded-2xl
        ${bg} ${className ?? ''}
      `.trim().replace(/\s+/g, ' ')}
    >
      {/* Left icon */}
      <span className={`shrink-0 mt-px ${iconColor}`}>
        {icon ?? <DefaultIcon className="w-5 h-5" />}
      </span>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        {title && (
          <p className="text-[14px] font-semibold text-vintiga-foreground leading-5 tracking-[0.14px]">
            {title}
          </p>
        )}
        {subtitle && (
          <p className="text-[14px] font-light text-vintiga-foreground opacity-80 leading-5 tracking-[0.14px]">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action button (optional) */}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-[12px] font-semibold text-vintiga-primary leading-4 tracking-[0.24px] border border-vintiga-primary rounded-full px-2 py-1 bg-transparent hover:bg-vintiga-primary-soft transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}

      {/* Close button (optional) */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <XIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
