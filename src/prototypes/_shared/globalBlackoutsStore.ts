import { useSyncExternalStore } from 'react'

// ─── globalBlackoutsStore ─────────────────────────────────────────────────────
// Tenant-wide blackouts shared by every experience. Authored in Settings →
// Closures; surfaced read-only on every experience's Schedule tab where the
// operator can exclude an individual global from that experience (without
// affecting the rest).
//
// Each experience also keeps its *own* blackouts in `productStore.blackouts`
// — those are unaffected by this store. Render order on an experience is
// `global \ excluded ∪ experience-local`.

export type BlackoutType = 'holiday' | 'event' | 'ops' | 'other'

/**
 * Optional partial-day time window. `undefined` = closed for the whole day
 * (same behaviour as a regular full-day blackout). When set, the closure
 * only applies between `start` and `end` (24-hour "HH:MM" strings).
 *
 * Example: a winery setting up for a 5 pm wedding closes Sat 1 pm–5 pm but
 * stays open for morning tastings.
 */
export interface BlackoutTimeWindow {
  /** 24-hour "HH:MM". */
  start: string
  /** 24-hour "HH:MM". */
  end: string
}

export interface GlobalBlackout {
  id: string
  /** Display reason — what's blocking the date. */
  reason: string
  type: BlackoutType
  /** yyyy-mm-dd start. */
  start: string
  /** yyyy-mm-dd end. Empty = single day. */
  end: string
  /** When present, blackout only covers part of the day(s). */
  timeWindow?: BlackoutTimeWindow
}

// ─── State + sync-external-store plumbing ─────────────────────────────────────

interface State {
  blackouts: GlobalBlackout[]
}

const SEED: GlobalBlackout[] = [
  { id: 'gbl-1', reason: 'Memorial Day',     type: 'holiday', start: '2026-05-25', end: '' },
  { id: 'gbl-2', reason: 'Independence Day', type: 'holiday', start: '2026-07-04', end: '' },
  { id: 'gbl-3', reason: 'Thanksgiving',     type: 'holiday', start: '2026-11-26', end: '' },
  // Partial-day demo — winery sets up for a 5 pm wedding, morning tastings still run.
  { id: 'gbl-4', reason: 'Wedding setup',    type: 'event',   start: '2026-06-13', end: '', timeWindow: { start: '13:00', end: '17:00' } },
]

let state: State = { blackouts: SEED.slice() }
const listeners = new Set<() => void>()
function emit() { listeners.forEach((l) => l()) }
function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l) } }

let seq = SEED.length
function uid() { return `gbl-${++seq}` }

// ─── Hook + actions ───────────────────────────────────────────────────────────

export function useGlobalBlackouts(): GlobalBlackout[] {
  return useSyncExternalStore(subscribe, () => state.blackouts, () => state.blackouts)
}

/** Snapshot read for non-React consumers. */
export function getGlobalBlackouts(): GlobalBlackout[] {
  return state.blackouts
}

export const globalBlackoutsActions = {
  add(b: Omit<GlobalBlackout, 'id'>): GlobalBlackout {
    const next = { ...b, id: uid() }
    state = { blackouts: [...state.blackouts, next] }
    emit()
    return next
  },
  update(id: string, patch: Partial<Omit<GlobalBlackout, 'id'>>) {
    state = {
      blackouts: state.blackouts.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }
    emit()
  },
  remove(id: string) {
    state = { blackouts: state.blackouts.filter((b) => b.id !== id) }
    emit()
  },
}
