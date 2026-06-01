import { useSyncExternalStore } from 'react'

// ─── storeSeasonsStore ────────────────────────────────────────────────────────
// Tenant-wide named date ranges ("Summer", "Harvest", "Holiday") that
// experiences can reuse as schedule containers. Authored in Settings →
// Seasons; referenced from each experience's Schedule tab.
//
// Store seasons are NOT schedules — they're reusable operational calendars.
// The actual availability rules (time slots, blackouts, capacity) live on
// the per-experience season that points at one of these.
//
// Overlap is allowed at this level by design — Summer (May–Oct) and Harvest
// (Sep–Oct) coexist intentionally. Per-experience seasons get the
// no-overlap rule, not these.

export interface StoreSeason {
  id: string
  name: string
  /** yyyy-mm-dd start. */
  start: string
  /** yyyy-mm-dd end (inclusive). */
  end: string
}

// ─── State + sync-external-store plumbing ─────────────────────────────────────

interface State {
  seasons: StoreSeason[]
}

const SEED: StoreSeason[] = [
  { id: 'season-spring',  name: 'Spring',  start: '2026-03-01', end: '2026-05-31' },
  { id: 'season-summer',  name: 'Summer',  start: '2026-05-01', end: '2026-10-31' },
  { id: 'season-fall',    name: 'Fall',    start: '2026-09-01', end: '2026-11-30' },
  { id: 'season-harvest', name: 'Harvest', start: '2026-09-01', end: '2026-10-15' },
  { id: 'season-holiday', name: 'Holiday', start: '2026-12-15', end: '2027-01-05' },
]

let state: State = { seasons: SEED.slice() }
const listeners = new Set<() => void>()
function emit() { listeners.forEach((l) => l()) }
function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l) } }

let seq = SEED.length
function uid() { return `season-${++seq}` }

// ─── Hook + actions ───────────────────────────────────────────────────────────

export function useStoreSeasons(): StoreSeason[] {
  return useSyncExternalStore(subscribe, () => state.seasons, () => state.seasons)
}

/** Snapshot read for non-React consumers (e.g. resolving a season-id at
 *  schedule-render time). */
export function getStoreSeasons(): StoreSeason[] {
  return state.seasons
}

export function getStoreSeason(id: string): StoreSeason | undefined {
  return state.seasons.find((s) => s.id === id)
}

export const storeSeasonsActions = {
  add(s: Omit<StoreSeason, 'id'>): StoreSeason {
    const next: StoreSeason = { ...s, id: uid() }
    state = { seasons: [...state.seasons, next] }
    emit()
    return next
  },
  update(id: string, patch: Partial<Omit<StoreSeason, 'id'>>) {
    state = {
      seasons: state.seasons.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }
    emit()
  },
  remove(id: string) {
    state = { seasons: state.seasons.filter((s) => s.id !== id) }
    emit()
  },
}
