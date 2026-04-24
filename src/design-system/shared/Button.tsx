import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonIntent = 'primary' | 'destructive'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  intent?: ButtonIntent
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  className?: string
  children?: ReactNode
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: 'button'
  }

type ButtonAsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: 'a'
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

// ─── Style maps ───────────────────────────────────────────────────────────────

const SIZE: Record<ButtonSize, string> = {
  xs: 'h-7 px-vintiga-sm gap-[6px] typo-caption',
  sm: 'h-9 px-vintiga-md gap-vintiga-sm typo-body-sm',
  md: 'h-10 px-vintiga-md gap-vintiga-sm typo-body-sm',
  lg: 'h-12 px-vintiga-lg gap-vintiga-sm typo-body-sm',
  xl: 'h-14 px-vintiga-xl gap-vintiga-sm typo-body-sm',
}

/**
 * Variant × intent → Tailwind classes (enabled state).
 * Hover/active use CSS transitions; disabled is handled separately.
 */
const VARIANT_INTENT: Record<ButtonVariant, Record<ButtonIntent, string>> = {
  solid: {
    primary:
      'bg-vintiga-primary text-vintiga-primary-foreground hover:bg-vintiga-primary-hover active:bg-vintiga-primary-active',
    destructive:
      'bg-vintiga-error text-white hover:opacity-90 active:opacity-80',
  },
  soft: {
    primary:
      'bg-vintiga-primary-soft text-vintiga-primary hover:bg-[#d6e6fa] active:bg-[#c0d8f7]',
    destructive:
      'bg-vintiga-error-soft text-vintiga-error hover:opacity-90 active:opacity-80',
  },
  outline: {
    primary:
      'border border-vintiga-primary text-vintiga-primary bg-transparent hover:bg-vintiga-primary-soft active:bg-[#d6e6fa]',
    destructive:
      'border border-vintiga-error text-vintiga-error bg-transparent hover:bg-vintiga-error-soft active:opacity-90',
  },
  ghost: {
    primary:
      'text-vintiga-primary bg-transparent hover:bg-vintiga-primary-soft active:bg-[#d6e6fa]',
    destructive:
      'text-vintiga-error bg-transparent hover:bg-vintiga-error-soft active:opacity-90',
  },
}

const DISABLED =
  'opacity-40 cursor-not-allowed pointer-events-none'

// ─── Component ────────────────────────────────────────────────────────────────

export function Button(props: ButtonProps) {
  const {
    variant = 'solid',
    size = 'lg',
    intent = 'primary',
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    children,
    as,
    ...rest
  } = props

  const disabled =
    as !== 'a' && (rest as ButtonHTMLAttributes<HTMLButtonElement>).disabled

  const base = [
    'inline-flex items-center justify-center rounded-full font-semibold transition-colors cursor-pointer select-none',
    SIZE[size],
    VARIANT_INTENT[variant][intent],
    fullWidth ? 'w-full' : '',
    disabled ? DISABLED : '',
    // outline/ghost need no default border from browser reset
    variant === 'solid' || variant === 'soft' ? 'border-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </>
  )

  if (as === 'a') {
    const { href, ...anchorRest } = rest as ButtonAsAnchor
    return (
      <a href={href} className={`${base} no-underline`} {...anchorRest}>
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={base}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  )
}
