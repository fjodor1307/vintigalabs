import type { ReactNode } from 'react'
import { ChevronRightIcon } from '@ds/icons/Icons'

// ─── KpiCard ──────────────────────────────────────────────────────────────────
// Vintiga KPI tile — Figma-accurate (132:6062 + 5568:21837 variants).
// One card, three shapes:
//
//   ┌──────────────────────────────────┐    ① Plain
//   │  Label                       (◯) │       Just label + value + icon.
//   │  $45,231.89                      │
//   └──────────────────────────────────┘
//
//   ┌──────────────────────────────────┐    ② Goal / progress
//   │  Total Revenue               (◯) │       Pass `goalLabel` (and optionally
//   │  $45,231.89                      │       `progressPercent`) to render
//   │  ─────                           │       the progress strip. When
//   │  Goal: $10,000.00           25%  │       `progressPercent` is omitted
//   └──────────────────────────────────┘       it defaults to 0% — useful for
//                                              "No goal set" empty states.
//
//   ┌──────────────────────────────────┐    ③ Status pill
//   │  AOV                         (◯) │       Pass a `status` node — typically
//   │  $0   [ Awaiting first order ]   │       a <Tag variant="outline">. Sits
//   │                                  │       inline next to the value.
//   │  ─────                           │       Combine with goal + progress
//   │  No goal set                 0%  │       freely.
//   └──────────────────────────────────┘
//
//   "No goal set" empty state works whether the value is zero or not — pass
//   `goalLabel="No goal set"` (and omit `progressPercent`) to render the empty
//   strip below any value. Reach for the `status` pill only when the value is
//   genuinely zero / awaiting first activity.

// ─── Types ────────────────────────────────────────────────────────────────────

export type KpiCardSize = 'md' | 'sm'

export interface KpiCardProps {
  /** Card label — 14 px / `font-medium` / gray-900. */
  label: ReactNode
  /** Value — 24 px (md) or 16 px (sm), `font-semibold` / gray-900. */
  value: ReactNode
  /** Optional icon shown in an indigo circle (36 px md, 32 px sm). */
  icon?: ReactNode
  /**
   * Optional pill / badge sitting inline next to the value. Typically a
   * `<Tag variant="outline">` carrying a status like "Awaiting first sale".
   * `md` only — `sm` ignores this for layout simplicity.
   */
  status?: ReactNode
  /**
   * When set, the progress section renders below. Pair with `progressPercent`
   * for a filled bar, or pass `goalLabel="No goal set"` alone to render the
   * empty 0% state. `md` only — `sm` ignores progress for layout simplicity.
   */
  goalLabel?: ReactNode
  /** 0–100. Defaults to 0 when `goalLabel` is set without an explicit value. */
  progressPercent?: number
  /**
   * Layout density. Default `md` keeps the existing label-top + large value
   * stack. `sm` is the compact variant from Figma 5347:77005 — icon top-left
   * + label/value on a single row below. Use `sm` when packing many tiles
   * into a 3-column grid (e.g. tab summary strips).
   */
  size?: KpiCardSize
  /**
   * When set, the card renders as an `<a>` and gets an interactive hover state
   * (border darkens, indigo tint). Used by KPIs that drill down into a
   * dedicated tab — e.g. Account Balance / Loyalty Points routing to Billing.
   */
  href?: string
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KpiCard({
  label,
  value,
  icon,
  status,
  goalLabel,
  progressPercent,
  size = 'md',
  href,
  className = '',
}: KpiCardProps) {
  if (size === 'sm') return <KpiCardSm label={label} value={value} icon={icon} href={href} className={className} />

  const showProgress = goalLabel != null || typeof progressPercent === 'number'
  const pct = Math.max(0, Math.min(100, progressPercent ?? 0))

  const Tag = href ? 'a' : 'div'
  const interactiveCls = href
    ? 'hover:border-vintiga-indigo-300 hover:bg-vintiga-indigo-50/30 transition-colors cursor-pointer no-underline'
    : ''

  return (
    <Tag
      {...(href ? { href } : {})}
      className={[
        'bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-2xl p-vintiga-lg',
        'flex flex-col gap-vintiga-sm',
        interactiveCls,
        className,
      ].join(' ')}
    >
      {/* Header row — label + icon */}
      <div className="flex items-center justify-between gap-vintiga-md w-full">
        <span className="typo-body-sm font-medium text-vintiga-gray-900">{label}</span>
        {icon && (
          <div className="w-9 h-9 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 shrink-0 [&>svg]:w-5 [&>svg]:h-5">
            {icon}
          </div>
        )}
      </div>

      {/* Value row — value + optional inline status pill */}
      <div className="flex items-center justify-between gap-vintiga-md w-full">
        <p
          className="font-semibold text-vintiga-gray-900 shrink-0"
          style={{ fontSize: 24, lineHeight: '32px' }}
        >
          {value}
        </p>
        {status && <span className="shrink-0 inline-flex items-center">{status}</span>}
      </div>

      {/* Optional progress strip */}
      {showProgress && (
        <div className="flex flex-col gap-vintiga-sm pt-vintiga-md w-full">
          <div className="h-1.5 w-full rounded-full bg-vintiga-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-vintiga-indigo-500 transition-[width]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-vintiga-md">
            {goalLabel && (
              <span className="typo-caption font-semibold text-vintiga-slate-500">
                {goalLabel}
              </span>
            )}
            <span className="typo-caption font-semibold text-vintiga-slate-500 ml-auto">
              {pct}%
            </span>
          </div>
        </div>
      )}
    </Tag>
  )
}

// ─── sm variant — KPI-small (Figma 5682:137241) ──────────────────────────────
// Compact 64-px tall single-row card: icon (32-px indigo circle) on the left,
// label takes the slack, value pinned right, optional chevron when `href` is
// set. Replaces the older 2-row "icon-top + label/value" sm layout.
//
// Variants drive off `href`:
//   • `href` absent  →  Default state, no chevron (Figma: Button=False)
//   • `href` set     →  Renders as `<a>` with chevron + hover tint
//                       (Figma: Button=True). Hover state matches the spec —
//                       slate-50 fill, slate-300 border.
//
// Layout rhythm — outer card padding 16, gap 12 between icon and text block,
// label uses `typo-body-sm` regular, value uses `typo-body` semibold.

function KpiCardSm({ label, value, icon, href, className = '' }: { label: ReactNode; value: ReactNode; icon?: ReactNode; href?: string; className?: string }) {
  const Tag = href ? 'a' : 'div'
  const interactiveCls = href
    ? 'group hover:border-vintiga-slate-300 hover:bg-vintiga-slate-50 transition-colors cursor-pointer no-underline'
    : ''
  return (
    <Tag
      {...(href ? { href } : {})}
      className={[
        'bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-xl px-vintiga-md py-vintiga-sm',
        'h-16 flex items-center gap-vintiga-md min-w-0',
        interactiveCls,
        className,
      ].join(' ')}
    >
      {icon && (
        <div className="w-8 h-8 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 shrink-0 [&>svg]:w-4 [&>svg]:h-4">
          {icon}
        </div>
      )}
      <span className="flex-1 min-w-0 typo-body-sm text-vintiga-slate-900 truncate">{label}</span>
      <span className="typo-body font-semibold text-vintiga-slate-900 shrink-0">{value}</span>
      {href && (
        <ChevronRightIcon
          className="w-4 h-4 text-vintiga-slate-400 group-hover:text-vintiga-slate-700 transition-colors shrink-0"
          aria-hidden="true"
        />
      )}
    </Tag>
  )
}
