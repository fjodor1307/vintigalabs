import { useSyncExternalStore } from 'react'

// ─── globalBlackoutsStore ─────────────────────────────────────────────────────
// Tenant-wide blackouts that every experience inherits automatically. Authored
// inline from any experience's Schedule tab via the "Apply globally" toggle on
// the Add Blackout modal — there's no separate Settings page yet.
//
// Reads are merged with the experience-local list to render a single table
// (color-coded by scope). Deletes route back here so a global removed from
// one experience disappears across all of them.

export type BlackoutType = 'holiday' | 'event' | 'ops' | 'other'

export interface GlobalBlackout {
  id: string
  /** Display reason — what's blocking the date. */
  reason: string
  type: BlackoutType
  /** yyyy-mm-dd start. */
  start: string
  /** yyyy-mm-dd end. Empty = single day. */
  end: string
}

// ─── State + sync-external-store plumbing ─────────────────────────────────────

interface State {
  blackouts: GlobalBlackout[]
}

const SEED: GlobalBlackout[] = [
  { id: 'gbl-1', reason: 'Memorial Day',     type: 'holiday', start: '2026-05-25', end: '' },
  { id: 'gbl-2', reason: 'Independence Day', type: 'holiday', start: '2026-07-04', end: '' },
  { id: 'gbl-3', reason: 'Thanksgiving',     type: 'holiday', start: '2026-11-26', end: '' },
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

export const globalBlackoutsActions = {
  add(b: Omit<GlobalBlackout, 'id'>): GlobalBlackout {
    const next = { ...b, id: uid() }
    state = { blackouts: [...state.blackouts, next] }
    emit()
    return next
  },
  remove(id: string) {
    state = { blackouts: state.blackouts.filter((b) => b.id !== id) }
    emit()
  },
}
