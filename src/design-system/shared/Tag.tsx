import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TagVariant = 'filled' | 'outline' | 'neutral-dark' | 'neutral-light'
export type TagTone = 'success' | 'warning' | 'danger' | 'info' | 'default'
export type TagSize = 'sm' | 'md'

export interface TagProps {
  children: ReactNode
  variant?: TagVariant
  /** Only applies to the `filled` variant. */
  tone?: TagTone
  size?: TagSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onRemove?: () => void
  className?: string
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const SIZE: Record<TagSize, string> = {
  sm: 'px-2 py-0.5 typo-caption',
  md: 'px-2.5 py-1 typo-caption',
}

const FILLED_TONE: Record<TagTone, string> = {
  success: 'bg-vintiga-lime-100 text-vintiga-green-700',
  warning: 'bg-vintiga-orange-100 text-vintiga-orange-700',
  danger:  'bg-vintiga-red-100 text-vintiga-red-700',
  info:    'bg-vintiga-blue-100 text-vintiga-blue-700',
  default: 'bg-vintiga-slate-100 text-vintiga-slate-700',
}

const VARIANT: Record<TagVariant, string> = {
  filled:         '', // tone-driven; handled below
  outline:        'bg-vintiga-white text-vintiga-slate-900 border border-vintiga-slate-200',
  'neutral-dark': 'bg-vintiga-slate-800 text-vintiga-white',
  'neutral-light':'bg-vintiga-gray-200 text-vintiga-gray-700',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Tag({
  children,
  variant = 'filled',
  tone = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  onRemove,
  className = '',
}: TagProps) {
  const variantCls = variant === 'filled' ? FILLED_TONE[tone] : VARIANT[variant]

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
        SIZE[size],
        variantCls,
        className,
      ].join(' ')}
    >
      {leftIcon && <span className="shrink-0 inline-flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0 inline-flex items-center">{rightIcon}</span>}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="w-3.5 h-3.5 -mr-1 ml-0.5 inline-flex items-center justify-center rounded-full hover:bg-black/10 bg-transparent border-none cursor-pointer"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 2l6 6M8 2l-6 6" />
          </svg>
        </button>
      )}
    </span>
  )
}
