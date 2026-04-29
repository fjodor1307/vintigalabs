import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TagVariant = 'filled' | 'outline' | 'neutral-dark' | 'neutral-light'
/**
 * Filled-tag tones — palette matches Figma 4506:19880 (Order Status).
 *
 *   Semantic   Hex pair (bg / text)   Typical use
 *   ─────────  ─────────────────────  ─────────────────────────────────
 *   default    gray-200   gray-700    Pending / draft / neutral
 *   success    lime-100   green-700   Completed / Fulfilled / paid
 *   warning    amber-100  amber-800   Awaiting Payment
 *   danger     red-100    red-700     Declined / Quarantined / failure
 *   info       sky-100    sky-800     Awaiting Shipping / informational
 *   orange     orange-100 orange-800  Awaiting Compliance
 *   yellow     yellow-100 yellow-800  Awaiting Fulfillment
 *   teal       teal-100   teal-800    Exchanged
 *   blue       blue-100   blue-800    Refunded
 *   violet     violet-100 violet-800  Partially Refunded / Exchanged
 */
export type TagTone =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'orange'
  | 'yellow'
  | 'teal'
  | 'blue'
  | 'violet'
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
  default: 'bg-vintiga-gray-200    text-vintiga-gray-700',
  success: 'bg-vintiga-lime-100    text-vintiga-green-700',
  warning: 'bg-vintiga-amber-100   text-vintiga-amber-800',
  danger:  'bg-vintiga-red-100     text-vintiga-red-700',
  info:    'bg-vintiga-sky-100     text-vintiga-sky-800',
  orange:  'bg-vintiga-orange-100  text-vintiga-orange-800',
  yellow:  'bg-vintiga-yellow-100  text-vintiga-yellow-800',
  teal:    'bg-vintiga-teal-100    text-vintiga-teal-800',
  blue:    'bg-vintiga-blue-100    text-vintiga-blue-800',
  violet:  'bg-vintiga-violet-100  text-vintiga-violet-800',
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
