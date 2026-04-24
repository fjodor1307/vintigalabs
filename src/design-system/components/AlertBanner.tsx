import { Button } from '@base-ui/react/button'
import { InfoIcon, AlertTriangleIcon, XIcon } from '../icons/Icons'

interface AlertBannerProps {
  variant: 'warning' | 'error'
  title: string
  description: string
  action?: { label: string }
  onDismiss?: () => void
}

export function AlertBanner({ variant, title, description, action, onDismiss }: AlertBannerProps) {
  const styles = {
    warning: {
      bg: 'bg-vintiga-amber-50',
      icon: 'text-vintiga-warning',
      border: 'border-vintiga-amber-200',
    },
    error: {
      bg: 'bg-vintiga-red-50',
      icon: 'text-vintiga-error',
      border: 'border-vintiga-red-200',
    },
  }

  const s = styles[variant]
  const Icon = variant === 'warning' ? InfoIcon : AlertTriangleIcon

  return (
    <div className={`${s.bg} ${s.border} border rounded-vintiga-input px-vintiga-lg py-vintiga-md flex items-center gap-vintiga-md`}>
      <Icon className={`w-4 h-4 ${s.icon} shrink-0`} />
      <div className="flex-1 min-w-0">
        <span className="text-vintiga-sm font-semibold text-vintiga-foreground">{title}</span>
        <span className="text-vintiga-sm text-vintiga-foreground-muted ml-vintiga-sm">{description}</span>
      </div>
      {action && (
        <Button className="shrink-0 px-vintiga-md py-1.5 bg-vintiga-accent text-white text-vintiga-xs font-semibold rounded-vintiga-button border-none cursor-pointer hover:opacity-90 transition-opacity">
          {action.label}
        </Button>
      )}
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 p-1 text-vintiga-foreground-muted hover:text-vintiga-foreground cursor-pointer bg-transparent border-none transition-colors">
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
