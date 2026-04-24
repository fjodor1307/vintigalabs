// ─── Types ────────────────────────────────────────────────────────────────────

export interface PillProps {
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Pill — selection chip used for filters, role pickers, and tag lists.
 *
 * States: default · hover · selected
 * Figma: 02. Core Components › node 40003750-12774
 */
export function Pill({ label, selected = false, onClick, className }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        border rounded-full px-5 py-2.5 typo-body-sm font-light whitespace-nowrap
        transition-colors cursor-pointer
        ${
          selected
            ? 'bg-vintiga-primary-soft border-vintiga-primary text-vintiga-primary'
            : 'bg-transparent border-vintiga-border text-vintiga-foreground hover:border-vintiga-slate-400'
        }
        ${className ?? ''}
      `}
    >
      {label}
    </button>
  )
}
