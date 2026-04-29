import { CheckCircleIcon, InfoIcon, WarningIcon, CircleXIcon, XIcon } from '@ds/icons/Icons'

export type ToastVariant = 'success' | 'info' | 'warning' | 'error'

export interface ToastProps {
  title: string
  description?: string
  variant?: ToastVariant
  onClose?: () => void
  className?: string
}

const VARIANT: Record<ToastVariant, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  success: { icon: CheckCircleIcon, color: 'text-vintiga-green-500' },
  info:    { icon: InfoIcon,        color: 'text-vintiga-indigo-600' },
  warning: { icon: WarningIcon,     color: 'text-vintiga-amber-500' },
  error:   { icon: CircleXIcon,     color: 'text-vintiga-red-600' },
}

export function Toast({
  title,
  description,
  variant = 'success',
  onClose,
  className = '',
}: ToastProps) {
  const { icon: Icon, color } = VARIANT[variant]

  return (
    <div
      role="status"
      className={[
        'flex items-start gap-3 p-vintiga-md',
        'bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-lg shadow-vintiga-lg',
        'max-w-md',
        className,
      ].join(' ')}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${color}`} />

      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <p className="typo-body font-semibold text-vintiga-gray-900">{title}</p>
        {description && (
          <p className="typo-body-sm text-vintiga-gray-500">{description}</p>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="w-6 h-6 rounded-vintiga-md inline-flex items-center justify-center text-vintiga-slate-500 hover:text-vintiga-slate-900 hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer shrink-0 -mr-1"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
