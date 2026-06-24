// ─── holdStatus ──────────────────────────────────────────────────────────────
// A membership hold has a START date (when the hold takes effect) and an
// optional END date (when it auto-resumes). The displayed status depends on
// where "today" sits relative to those two dates:
//
//   Start in PAST,  End set     →  "Hold Until {end}"   (on the On Hold filter)
//   Start in PAST,  End null    →  "On Hold"            (on the On Hold filter)
//   Start in FUTURE, End set    →  "Active" + future-hold indicator
//   Start in FUTURE, End null   →  "Active" + future-hold indicator
//
// A future-dated hold leaves the membership ACTIVE until the start date is
// reached — so it filters under Active, but the UI flags the scheduled hold so
// staff aren't surprised when it kicks in.
//
// This module is the single source of truth: the cross-club list, the per-club
// Members tab, and the Membership detail page all derive their status display
// and filtering from `deriveMembershipState`.

/** A hold request on a membership. ISO `yyyy-mm-dd` dates. */
export interface MembershipHold {
  /** When the hold takes effect. */
  start: string
  /** When the hold auto-resumes. Undefined = indefinite ("until further notice"). */
  end?: string
}

/** The base lifecycle status stored on a membership, before hold dates are
 *  resolved against today. `active` members may still carry a future hold. */
export type BaseStatus = 'pending' | 'active' | 'cancelled'

/** Which filter bucket a membership lands in. Holds (current OR a past-start
 *  hold-until) collapse into `on-hold`; everything else maps 1:1. */
export type FilterStatus = 'pending' | 'active' | 'on-hold' | 'cancelled'

/** The resolved display kind for the status cell / tag. */
export type HoldDisplayKind =
  | 'active'        // no hold, or hold is in the future
  | 'on-hold'       // hold in effect, no end date
  | 'hold-until'    // hold in effect, ends on a date
  | 'pending'
  | 'cancelled'

export interface MembershipState {
  /** What the status tag should read. */
  label: string
  /** Tag styling. */
  tone: 'success' | 'orange' | 'default' | 'danger'
  variant: 'filled' | 'neutral-light'
  /** Resolved kind for branching in the UI. */
  kind: HoldDisplayKind
  /** Which filter dropdown bucket this row belongs to. */
  filter: FilterStatus
  /** Secondary caption under the tag (the end date for hold-until, the
   *  cancellation date for cancelled). Undefined when there's nothing to show. */
  caption?: string
  /** Present only when an active membership has a hold scheduled in the
   *  future — drives the "Future hold" indicator on lists + the detail page. */
  futureHold?: MembershipHold
  /** The hold currently in effect (start in the past). Present for on-hold /
   *  hold-until. Lets the detail page pre-fill the edit modal. */
  activeHold?: MembershipHold
}

// Fixed "today" so the demo is deterministic across reloads — matches the
// other June-2026 prototypes (orders-to-pickup, charges, iMessage).
export const TODAY_ISO = '2026-06-12'

/** ISO `yyyy-mm-dd` strings compare correctly with `<` / `>`, so no Date math. */
function isPast(iso: string, today: string): boolean {
  return iso <= today
}

/** "Jul 15, 2026" from an ISO date. */
export function formatHoldDate(iso: string): string {
  // Parse as local midnight to avoid TZ drift on the date-only string.
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Human range for a future hold: "Aug 1 – Oct 1, 2026" or "from Sep 15, 2026". */
export function formatHoldRange(hold: MembershipHold): string {
  if (!hold.end) return `from ${formatHoldDate(hold.start)}`
  // Drop the year on the start when both share it, for a tighter range.
  const startD = new Date(hold.start + 'T00:00:00')
  const endD = new Date(hold.end + 'T00:00:00')
  const sameYear = startD.getFullYear() === endD.getFullYear()
  const startStr = sameYear
    ? startD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : formatHoldDate(hold.start)
  return `${startStr} – ${formatHoldDate(hold.end)}`
}

const PENDING_STATE: Omit<MembershipState, 'caption'> = {
  label: 'Pending', tone: 'orange', variant: 'filled', kind: 'pending', filter: 'pending',
}
const ACTIVE_STATE: Omit<MembershipState, 'futureHold'> = {
  label: 'Active', tone: 'success', variant: 'filled', kind: 'active', filter: 'active',
}

/**
 * Resolve a membership's base status + optional hold into everything the UI
 * needs to render and filter it.
 */
export function deriveMembershipState(
  base: BaseStatus,
  hold: MembershipHold | undefined,
  opts: { cancelledDate?: string; today?: string } = {},
): MembershipState {
  const today = opts.today ?? TODAY_ISO

  if (base === 'cancelled') {
    return {
      label: 'Cancelled', tone: 'danger', variant: 'filled',
      kind: 'cancelled', filter: 'cancelled',
      caption: opts.cancelledDate,
    }
  }

  if (base === 'pending') {
    return { ...PENDING_STATE }
  }

  // base === 'active' — the hold dates decide what we actually show.
  if (!hold) {
    return { ...ACTIVE_STATE }
  }

  // Future-dated hold: still active, but flag the scheduled hold.
  if (!isPast(hold.start, today)) {
    return { ...ACTIVE_STATE, futureHold: hold }
  }

  // Start is in the past. If the end date has also passed, the hold has
  // expired and the membership is Active again.
  if (hold.end && isPast(hold.end, today)) {
    return { ...ACTIVE_STATE }
  }

  // Hold is in effect now → status is "On Hold". A future end date rides along
  // as a caption; the full date copy lives in the detail messaging area.
  if (hold.end) {
    return {
      label: 'On Hold', tone: 'default', variant: 'neutral-light',
      kind: 'hold-until', filter: 'on-hold',
      caption: `Until ${formatHoldDate(hold.end)}`,
      activeHold: hold,
    }
  }
  return {
    label: 'On Hold', tone: 'default', variant: 'neutral-light',
    kind: 'on-hold', filter: 'on-hold',
    activeHold: hold,
  }
}
