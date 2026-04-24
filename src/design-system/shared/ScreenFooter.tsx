// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScreenFooterProps {
  /** Label for the primary (solid) CTA */
  primaryLabel: string
  /** href for the primary CTA — use this for routing links */
  primaryHref?: string
  /** onClick for the primary CTA — fires before navigation if both provided */
  primaryOnClick?: () => void
  /** Disable the primary CTA (greyed out, non-interactive) */
  primaryDisabled?: boolean
  /** Label for the optional ghost (text) CTA below the primary */
  ghostLabel?: string
  /** href for the ghost CTA */
  ghostHref?: string
  /** onClick for the ghost CTA */
  ghostOnClick?: () => void
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ScreenFooter({
  primaryLabel,
  primaryHref,
  primaryOnClick,
  primaryDisabled,
  ghostLabel,
  ghostHref,
  ghostOnClick,
  className,
}: ScreenFooterProps) {
  const primaryBase = 'w-full flex items-center justify-center h-12 rounded-full text-[16px] font-semibold tracking-[0.08px] transition-colors'
  const primaryEnabled = 'text-vintiga-primary-foreground bg-vintiga-primary hover:opacity-90 cursor-pointer'
  const primaryDisabledCls = 'text-vintiga-slate-400 bg-vintiga-border cursor-not-allowed'
  const primaryCls = `${primaryBase} ${primaryDisabled ? primaryDisabledCls : primaryEnabled}`

  return (
    <div className={`px-4 pb-8 pt-4 bg-vintiga-surface flex flex-col gap-3 ${className ?? ''}`}>
      {/* Primary CTA */}
      {primaryHref && !primaryDisabled ? (
        <a
          href={primaryHref}
          onClick={primaryOnClick}
          className={`${primaryCls} no-underline`}
        >
          {primaryLabel}
        </a>
      ) : (
        <button
          type="button"
          onClick={!primaryDisabled ? primaryOnClick : undefined}
          disabled={primaryDisabled}
          className={`${primaryCls} border-none`}
        >
          {primaryLabel}
        </button>
      )}

      {/* Ghost CTA (optional) */}
      {ghostLabel && (
        ghostHref ? (
          <a
            href={ghostHref}
            onClick={ghostOnClick}
            className="w-full flex items-center justify-center h-12 rounded-full text-[16px] font-semibold text-vintiga-primary no-underline transition-colors hover:bg-vintiga-primary-soft tracking-[0.08px]"
          >
            {ghostLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={ghostOnClick}
            className="w-full flex items-center justify-center h-12 rounded-full text-[16px] font-semibold text-vintiga-primary transition-colors hover:bg-vintiga-primary-soft tracking-[0.08px] border-none cursor-pointer bg-transparent"
          >
            {ghostLabel}
          </button>
        )
      )}
    </div>
  )
}
