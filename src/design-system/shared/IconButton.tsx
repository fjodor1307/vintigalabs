import type { ReactNode } from 'react'

// ─── IconButton ───────────────────────────────────────────────────────────────
// Square sibling to <Button>. Same variant / intent / disabled vocab and
// matching outer dimensions so a Button + IconButton sit perfectly in-line.

export type IconButtonVariant = 'solid' | 'outline'
export type IconButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type IconButtonIntent  = 'primary' | 'destructive'
/** @deprecated Use IconButtonIntent. Kept for backwards compatibility. */
export type IconButtonTone    = IconButtonIntent

export interface IconButtonProps {
  /** The icon to render inside the button */
  icon: ReactNode
  /** Visual style. Default: 'solid' */
  variant?: IconButtonVariant
  /** Size. Default: 'md' */
  size?: IconButtonSize
  /** Colour intent. Default: 'primary' */
  intent?: IconButtonIntent
  /** @deprecated Use `intent`. */
  tone?: IconButtonIntent
  disabled?: boolean
  onClick?: () => void
  /** Required for accessibility */
  'aria-label': string
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

// ─── Size map — outer height matches <Button> at the same size ───────────────
//  xs 24 · sm 28 · md 32 · lg 36 · xl 40

const SIZE: Record<IconButtonSize, string> = {
  xs: 'p-1   [&>svg]:w-4 [&>svg]:h-4',
  sm: 'p-1.5 [&>svg]:w-4 [&>svg]:h-4',
  md: 'p-1.5 [&>svg]:w-5 [&>svg]:h-5',
  lg: 'p-2   [&>svg]:w-5 [&>svg]:h-5',
  xl: 'p-2.5 [&>svg]:w-5 [&>svg]:h-5',
}

// ─── Variant × intent — mirrors <Button> exactly ─────────────────────────────

const VARIANT_INTENT: Record<IconButtonVariant, Record<IconButtonIntent, string>> = {
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

const DISABLED: Record<IconButtonVariant, string> = {
  solid:   'bg-vintiga-slate-300 text-vintiga-slate-400 cursor-not-allowed pointer-events-none',
  outline: 'bg-vintiga-white text-vintiga-slate-300 border border-vintiga-slate-200 cursor-not-allowed pointer-events-none',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function IconButton({
  icon,
  variant = 'solid',
  size = 'md',
  intent,
  tone,
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  className,
  type = 'button',
}: IconButtonProps) {
  const resolvedIntent: IconButtonIntent = intent ?? tone ?? 'primary'

  const classes = [
    'inline-flex items-center justify-center rounded-vintiga-md transition-colors cursor-pointer shrink-0',
    SIZE[size],
    disabled ? DISABLED[variant] : VARIANT_INTENT[variant][resolvedIntent],
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
