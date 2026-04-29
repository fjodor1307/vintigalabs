import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type IconButtonVariant = 'solid' | 'outline'
export type IconButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type IconButtonTone    = 'primary' | 'destructive'

export interface IconButtonProps {
  /** The icon to render inside the button */
  icon: ReactNode
  /** Visual style. Default: 'solid' */
  variant?: IconButtonVariant
  /** Size. Default: 'md' */
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

// ─── Size map (matches Button padding so square buttons sit in-line) ─────────

const SIZE: Record<IconButtonSize, string> = {
  xs: 'p-1 [&>svg]:w-4 [&>svg]:h-4',           // 24×24
  sm: 'p-1.5 [&>svg]:w-4 [&>svg]:h-4',         // 28×28
  md: 'p-1.5 [&>svg]:w-5 [&>svg]:h-5',         // 32×32
  lg: 'p-2 [&>svg]:w-5 [&>svg]:h-5',           // 36×36
  xl: 'p-2.5 [&>svg]:w-5 [&>svg]:h-5',         // 40×40
}

const VARIANT_TONE: Record<IconButtonVariant, Record<IconButtonTone, string>> = {
  solid: {
    primary:
      'bg-vintiga-indigo-600 text-vintiga-white hover:bg-vintiga-indigo-700 active:bg-vintiga-indigo-700',
    destructive:
      'bg-vintiga-red-600 text-vintiga-white hover:bg-vintiga-red-700 active:bg-vintiga-red-700',
  },
  outline: {
    primary:
      'bg-vintiga-white text-vintiga-slate-900 border border-vintiga-slate-300 hover:bg-vintiga-indigo-50 hover:border-vintiga-indigo-500 active:bg-vintiga-indigo-50 active:border-vintiga-indigo-600',
    destructive:
      'bg-vintiga-white text-vintiga-red-600 border border-vintiga-red-200 hover:bg-vintiga-red-50 hover:border-vintiga-red-500 active:bg-vintiga-red-50 active:border-vintiga-red-600',
  },
}

const DISABLED: Record<IconButtonVariant, string> = {
  solid: 'bg-vintiga-slate-300 text-vintiga-slate-400 cursor-not-allowed pointer-events-none',
  outline: 'bg-vintiga-white text-vintiga-slate-400 border border-vintiga-slate-200 cursor-not-allowed pointer-events-none',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function IconButton({
  icon,
  variant = 'solid',
  size = 'md',
  tone = 'primary',
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  className,
  type = 'button',
}: IconButtonProps) {
  const classes = [
    'inline-flex items-center justify-center rounded-vintiga-md transition-colors border-none cursor-pointer shrink-0',
    SIZE[size],
    disabled ? DISABLED[variant] : VARIANT_TONE[variant][tone],
    className ?? '',
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
    >
      {icon}
    </button>
  )
}
