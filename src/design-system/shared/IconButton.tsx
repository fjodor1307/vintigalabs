import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type IconButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost'
export type IconButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type IconButtonTone    = 'primary' | 'destructive' | 'neutral'

export interface IconButtonProps {
  /** The icon to render inside the button */
  icon: ReactNode
  /** Visual style of the button. Default: 'soft' */
  variant?: IconButtonVariant
  /** Size of the button. Default: 'md' */
  size?: IconButtonSize
  /** Colour tone. Default: 'primary' */
  tone?: IconButtonTone
  disabled?: boolean
  onClick?: () => void
  /** Required for accessibility */
  'aria-label': string
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

// ─── Size config ──────────────────────────────────────────────────────────────

const SIZE_CONFIG: Record<IconButtonSize, { padding: string; iconSize: string }> = {
  xs: { padding: 'p-1',    iconSize: 'w-4 h-4' },
  sm: { padding: 'p-2',    iconSize: 'w-4 h-4' },
  md: { padding: 'p-2.5',  iconSize: 'w-5 h-5' },
  lg: { padding: 'p-3',    iconSize: 'w-5 h-5' },
  xl: { padding: 'p-3.5',  iconSize: 'w-5 h-5' },
}

// ─── Variant + tone → class strings ──────────────────────────────────────────

function getVariantClasses(variant: IconButtonVariant, tone: IconButtonTone): string {
  if (tone === 'neutral') {
    if (variant === 'solid')   return 'bg-vintiga-slate-700 text-white hover:bg-vintiga-slate-800 active:bg-vintiga-slate-700 disabled:opacity-50'
    if (variant === 'soft')    return 'bg-vintiga-surface-element text-vintiga-foreground hover:bg-vintiga-border active:bg-vintiga-surface-element disabled:opacity-50'
    if (variant === 'outline') return 'border border-vintiga-border text-vintiga-foreground bg-transparent hover:bg-vintiga-slate-50 active:bg-transparent disabled:opacity-50'
    /* ghost */                return 'bg-transparent text-vintiga-foreground hover:bg-vintiga-surface-element active:bg-transparent disabled:opacity-50'
  }
  if (variant === 'solid') {
    return tone === 'primary'
      ? 'bg-vintiga-primary text-white hover:bg-vintiga-primary-hover active:bg-vintiga-primary disabled:bg-vintiga-slate-300 disabled:opacity-50'
      : 'bg-vintiga-error text-white hover:opacity-90 active:opacity-100 disabled:opacity-50'
  }
  if (variant === 'soft') {
    return tone === 'primary'
      ? 'bg-vintiga-primary-soft text-vintiga-primary hover:bg-vintiga-blue-300 active:bg-vintiga-primary-soft disabled:bg-vintiga-slate-300 disabled:opacity-50'
      : 'bg-vintiga-error-soft text-vintiga-error hover:bg-vintiga-red-200 active:bg-vintiga-error-soft disabled:opacity-50'
  }
  if (variant === 'outline') {
    return tone === 'primary'
      ? 'border border-vintiga-primary text-vintiga-primary bg-transparent hover:bg-vintiga-blue-300 hover:border-vintiga-primary-hover active:bg-transparent disabled:border-vintiga-foreground-muted disabled:text-vintiga-foreground-muted disabled:opacity-50'
      : 'border border-vintiga-error text-vintiga-error bg-transparent hover:bg-vintiga-red-200 active:bg-transparent disabled:opacity-50'
  }
  // ghost
  return tone === 'primary'
    ? 'bg-transparent text-vintiga-primary hover:bg-vintiga-blue-300 active:bg-transparent disabled:opacity-50'
    : 'bg-transparent text-vintiga-error hover:bg-vintiga-red-200 active:bg-transparent disabled:opacity-50'
}

// ─── Component ────────────────────────────────────────────────────────────────

export function IconButton({
  icon,
  variant = 'soft',
  size = 'md',
  tone = 'primary',
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  className,
  type = 'button',
}: IconButtonProps) {
  const { padding, iconSize } = SIZE_CONFIG[size]
  const variantClasses = getVariantClasses(variant, tone)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center rounded-full
        transition-colors cursor-pointer border-none
        disabled:cursor-not-allowed
        ${padding} ${variantClasses} ${className ?? ''}
      `.trim().replace(/\s+/g, ' ')}
    >
      <span className={`${iconSize} flex items-center justify-center`}>
        {icon}
      </span>
    </button>
  )
}
