import { AlertTriangleIcon } from '@ds/icons/Icons'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-vintiga-md py-vintiga-2xl">
      <div className="w-12 h-12 rounded-full bg-vintiga-error-soft flex items-center justify-center text-vintiga-error">
        <AlertTriangleIcon className="w-5 h-5" />
      </div>
      <div className="flex flex-col items-center gap-vintiga-sm">
        <h3 className="typo-title-subsection font-semibold text-vintiga-foreground">{title}</h3>
        {description && (
          <p className="typo-body-sm text-vintiga-foreground-muted">{description}</p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-vintiga-accent text-white rounded-vintiga-button px-6 py-2.5 typo-body-sm font-semibold hover:opacity-90 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
