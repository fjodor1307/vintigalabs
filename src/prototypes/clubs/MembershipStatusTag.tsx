import { Tag } from '@ds/shared/Tag'
import { ClockIcon } from '@ds/icons/Icons'
import { type MembershipState, formatHoldRange } from './holdStatus'

// ─── MembershipStatusTag ─────────────────────────────────────────────────────
// Renders a resolved membership state as a tag + optional sub-lines:
//   • caption  — the hold-until end date, or the cancellation date
//   • future hold — a clock-prefixed "Hold {range}" line under an Active tag
// Shared by the cross-club list, the per-club Members tab, and the detail
// page title so the status reads identically everywhere.

export function MembershipStatusTag({
  state,
  size = 'sm',
  showFutureHold = true,
}: {
  state: MembershipState
  size?: 'sm' | 'md'
  /** Hide the "Hold scheduled" sub-line where space is tight (e.g. page title). */
  showFutureHold?: boolean
}) {
  return (
    <span className="inline-flex flex-col items-start gap-0.5 align-middle">
      <Tag variant={state.variant} tone={state.tone} size={size}>
        {state.label}
      </Tag>
      {state.caption && (
        <span className="typo-caption text-vintiga-slate-500">{state.caption}</span>
      )}
      {showFutureHold && state.futureHold && (
        <span className="typo-caption text-vintiga-slate-500 inline-flex items-center gap-1">
          <ClockIcon className="w-3 h-3" />
          Hold {formatHoldRange(state.futureHold)}
        </span>
      )}
    </span>
  )
}
