import type { ReactNode } from 'react'

// ─── SelectionCard ────────────────────────────────────────────────────────────
// Vintiga "pick one" card — Figma-accurate. Covers four common patterns:
//
//   • Horizontal info card  (5079:33569 — SelectClubCard)
//   • Vertical type tile    (3675:37603 — SelectPromoType, left-aligned text)
//   • Centred type tile     (5000:45656 — ReportCard, centre-aligned text)
//   • Tenant / list row     (2930:20012 — small icon, trailing pill)
//
// Axes that flex visuals:
//   orientation   horizontal | vertical                  (default: horizontal)
//   align         start | center                          (default: start)
//   size          sm | md                                 (default: md)
//   tone          indigo | slate                          (default: indigo) — icon container colour
//   selected      adds card border highlight + solid icon container (md only)
//   trailing      slot on the right (Tag, Button, anything)

export type SelectionCardOrientation = 'horizontal' | 'vertical'
export type SelectionCardAlign       = 'start' | 'center'
export type SelectionCardSize        = 'sm' | 'md'
export type SelectionCardTone        = 'indigo' | 'slate'

export interface SelectionCardProps {
  /** Icon (typically 16–24 px). Wrapped in a coloured container by the card. */
  icon?: ReactNode
  /** Required title text (or node). */
  title: ReactNode
  /** Optional supporting description below the title. */
  description?: ReactNode
  /** Stack icon next to title (`horizontal`) or above it (`vertical`). */
  orientation?: SelectionCardOrientation
  /** Text alignment. */
  align?: SelectionCardAlign
  /** Card visual size. */
  size?: SelectionCardSize
  /** Icon container palette. */
  tone?: SelectionCardTone
  /** Currently selected (only visually meaningful at `size="md"`). */
  selected?: boolean
  /** Disabled — non-interactive, faded. */
  disabled?: boolean
  /** Click handler. When passed, renders as a button. */
  onClick?: () => void
  /** Trailing slot (right-side pill, badge, button, etc.). */
  trailing?: ReactNode
  /** Override accessible label (defaults to `title` if it is a string). */
  'aria-label'?: string
  className?: string
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const SIZE_MAP = {
  md: {
    card:     'p-vintiga-lg rounded-2xl border-vintiga-slate-200',
    iconBox:  'size-12 rounded-vintiga-xl',
    iconSize: '[&>svg]:w-6 [&>svg]:h-6',
    title:    'text-lg leading-7 font-semibold text-vintiga-slate-900',
    desc:     'typo-body-sm font-medium text-vintiga-slate-400',
    gap:      'gap-vintiga-md',
  },
  sm: {
    card:     'px-vintiga-md py-vintiga-lg rounded-vintiga-lg border-vintiga-slate-300',
    iconBox:  'size-8 rounded-vintiga-md',
    iconSize: '[&>svg]:w-4 [&>svg]:h-4',
    title:    'typo-body font-medium text-vintiga-slate-900 truncate',
    desc:     'typo-body-sm text-vintiga-slate-600 truncate',
    gap:      'gap-vintiga-sm',
  },
} as const

const TONE_DEFAULT = {
  indigo: { bg: 'bg-vintiga-indigo-50',  text: 'text-vintiga-indigo-600' },
  slate:  { bg: 'bg-vintiga-slate-100',  text: 'text-vintiga-slate-700' },
} as const

const TONE_SELECTED = {
  indigo: { bg: 'bg-vintiga-indigo-600', text: 'text-vintiga-white' },
  slate:  { bg: 'bg-vintiga-slate-700',  text: 'text-vintiga-white' },
} as const

// ─── Component ────────────────────────────────────────────────────────────────

export function SelectionCard({
  icon,
  title,
  description,
  orientation = 'horizontal',
  align = 'start',
  size = 'md',
  tone = 'indigo',
  selected = false,
  disabled = false,
  onClick,
  trailing,
  className = '',
  ...rest
}: SelectionCardProps) {
  const s = SIZE_MAP[size]
  const iconPalette = (selected && size === 'md' ? TONE_SELECTED : TONE_DEFAULT)[tone]

  // Card container classes
  const cardClasses = [
    'flex w-full border bg-vintiga-white text-left transition-colors',
    s.card,
    orientation === 'horizontal' ? 'flex-row items-start' : 'flex-col',
    orientation === 'vertical' && align === 'center' ? 'items-center' : 'items-start',
    s.gap,
    disabled
      ? 'cursor-not-allowed opacity-60'
      : onClick
        ? 'cursor-pointer'
        : '',
    selected && size === 'md'
      ? '!border-vintiga-slate-400 !bg-vintiga-slate-50'
      : !disabled && onClick
        ? size === 'md'
          ? 'hover:!border-vintiga-slate-400 hover:!bg-vintiga-slate-50'
          : 'hover:!bg-vintiga-slate-50'
        : '',
    className,
  ].filter(Boolean).join(' ')

  // Icon container
  const iconBoxClasses = [
    'flex items-center justify-center shrink-0 transition-colors',
    s.iconBox,
    s.iconSize,
    iconPalette.bg,
    iconPalette.text,
  ].join(' ')

  // Text container
  const textBlockClasses = [
    'flex flex-col gap-1.5 min-w-0',
    orientation === 'horizontal' ? 'flex-1' : 'w-full',
    align === 'center' ? 'text-center items-center' : 'items-start',
  ].join(' ')

  const inner = (
    <>
      {icon && <span className={iconBoxClasses}>{icon}</span>}
      <span className={textBlockClasses}>
        <span className={s.title}>{title}</span>
        {description && <span className={s.desc}>{description}</span>}
      </span>
      {trailing && <span className="shrink-0 ml-auto">{trailing}</span>}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        aria-pressed={selected}
        aria-label={rest['aria-label'] ?? (typeof title === 'string' ? title : undefined)}
        className={cardClasses}
      >
        {inner}
      </button>
    )
  }

  return <div className={cardClasses}>{inner}</div>
}
