import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'solid' | 'outline'
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

// ─── Size × typography map (Figma-accurate) ───────────────────────────────────

const SIZE: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 gap-1.5 text-xs leading-4',
  sm: 'px-2 py-1 gap-1.5 text-sm leading-5',
  md: 'px-2.5 py-1.5 gap-1.5 text-sm leading-5',
  lg: 'px-3 py-2 gap-1.5 text-sm leading-5',
  xl: 'px-3.5 py-2.5 gap-1.5 text-sm leading-5',
}

const ICON_SIZE: Record<ButtonSize, string> = {
  xs: '[&>svg]:w-4 [&>svg]:h-4',
  sm: '[&>svg]:w-4 [&>svg]:h-4',
  md: '[&>svg]:w-5 [&>svg]:h-5',
  lg: '[&>svg]:w-5 [&>svg]:h-5',
  xl: '[&>svg]:w-5 [&>svg]:h-5',
}

const VARIANT_INTENT: Record<ButtonVariant, Record<ButtonIntent, string>> = {
  solid: {
    primary:
      'bg-vintiga-indigo-600 text-vintiga-white hover:bg-vintiga-indigo-700 active:bg-vintiga-indigo-700',
    destructive:
      'bg-vintiga-red-600 text-vintiga-white hover:bg-vintiga-red-700 active:bg-vintiga-red-700',
  },
  // Figma "Secondary Button" — slate tones, shadow on interaction
  outline: {
    primary:
      'bg-vintiga-white text-vintiga-slate-700 border border-vintiga-slate-300 ' +
      'hover:bg-vintiga-slate-50 hover:text-vintiga-slate-800 hover:shadow-sm ' +
      'active:bg-vintiga-slate-50 active:text-vintiga-slate-800 active:border-vintiga-slate-400 active:shadow-sm',
    destructive:
      'bg-vintiga-white text-vintiga-red-600 border border-vintiga-red-300 ' +
      'hover:bg-vintiga-red-50 hover:shadow-sm ' +
      'active:bg-vintiga-red-50 active:border-vintiga-red-400 active:shadow-sm',
  },
}

const DISABLED: Record<ButtonVariant, string> = {
  solid:   'bg-vintiga-slate-300 text-vintiga-slate-400 cursor-not-allowed pointer-events-none',
  outline: 'bg-vintiga-white text-vintiga-slate-300 border border-vintiga-slate-200 cursor-not-allowed pointer-events-none',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button(props: ButtonProps) {
  const {
    variant = 'solid',
    size = 'md',
    intent = 'primary',
    leftIcon,
    rightIcon,
    fullWidth,
    className = '',
    children,
  } = props

  const isDisabled = 'disabled' in props && props.disabled

  const classes = [
    'inline-flex items-center justify-center rounded-vintiga-md transition-colors font-semibold whitespace-nowrap cursor-pointer',
    SIZE[size],
    ICON_SIZE[size],
    isDisabled ? DISABLED[variant] : VARIANT_INTENT[variant][intent],
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ')

  if (props.as === 'a') {
    const {
      as: _as, variant: _v, size: _s, intent: _i,
      leftIcon: _l, rightIcon: _r, fullWidth: _fw,
      className: _c, children: _ch, ...anchorProps
    } = props
    void _as; void _v; void _s; void _i; void _l; void _r; void _fw; void _c; void _ch
    return (
      <a {...anchorProps} className={classes}>
        {leftIcon}
        {children}
        {rightIcon}
      </a>
    )
  }

  const {
    as: _as, variant: _v, size: _s, intent: _i,
    leftIcon: _l, rightIcon: _r, fullWidth: _fw,
    className: _c, children: _ch, ...buttonProps
  } = props
  void _as; void _v; void _s; void _i; void _l; void _r; void _fw; void _c; void _ch

  return (
    <button type={buttonProps.type ?? 'button'} {...buttonProps} className={classes}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
