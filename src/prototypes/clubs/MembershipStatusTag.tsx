import { Tag } from '@ds/shared/Tag'
import { ClockIcon } from '@ds/icons/Icons'
import { type MembershipState, formatHoldDate } from './holdStatus'

// ─── MembershipStatusTag ─────────────────────────────────────────────────────
// Renders a resolved membership state as a tag + optional sub-lines:
//   • caption  — the hold-until end date, or the cancellation date
//   • future hold — a clock-prefixed "Hold Starts {date}" line under an Active
//     tag (start only — end date lives on the membership detail, not the list)
// Shared by the cross-club list, the per-club Members tab, and the detail
// page title so the status reads identically everywhere.

export function MembershipStatusTag({
  state,
  size = 'sm',
  showFutureHold = true,
  showCaption = true,
}: {
  state: MembershipState
  size?: 'sm' | 'md'
  /** Hide the "Hold scheduled" sub-line where space is tight (e.g. page title). */
  showFutureHold?: boolean
  /** Hide the caption (end / cancellation date) — the detail header keeps the
   *  tag bare and shows the dates in the messaging area instead. */
  showCaption?: boolean
}) {
  return (
    <span className="inline-flex flex-col items-start gap-0.5 align-middle">
      <Tag variant={state.variant} tone={state.tone} size={size}>
        {state.label}
      </Tag>
      {showCaption && state.caption && (
        <span className="typo-caption text-vintiga-slate-500">{state.caption}</span>
      )}
      {showFutureHold && state.futureHold && (
        <span className="typo-caption text-vintiga-slate-500 inline-flex items-center gap-1">
          <ClockIcon className="w-3 h-3" />
          Hold Starts {formatHoldDate(state.futureHold.start)}
        </span>
      )}
    </span>
  )
}
