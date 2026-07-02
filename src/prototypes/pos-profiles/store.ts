// POS Profiles — in-memory reactive store.
// Prototype state lives here so add / edit / duplicate feel real as the user
// navigates between the list and detail screens (single-page, no reload).
// Resets on a full page reload — that's fine for a prototype.

import { useSyncExternalStore } from 'react'
import { SEED_PROFILES, blankProfile, nextId, type Profile, type StoreMode } from './data'

type State = {
  mode: StoreMode
  profiles: Profile[]
}

let state: State = {
  mode: 'standalone',
  profiles: SEED_PROFILES.map((p) => ({ ...p })),
}

const listeners = new Set<() => void>()
function emit() {
  state = { ...state }
  listeners.forEach((l) => l())
}
function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}
const getSnapshot = () => state

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useStoreMode(): StoreMode {
  return useSyncExternalStore(subscribe, () => state.mode)
}

export function useProfiles(): Profile[] {
  return useSyncExternalStore(subscribe, getSnapshot).profiles
}

export function useProfile(id: string | null): Profile | undefined {
  const profiles = useProfiles()
  return id ? profiles.find((p) => p.id === id) : undefined
}

/** True when profile fields are read-only (Commerce7-connected store). Only
 *  collection images-on/off and collection colors stay editable in C7. */
export function useReadOnly(): boolean {
  return useStoreMode() === 'c7'
}

// ─── Mutators ─────────────────────────────────────────────────────────────────

export function setStoreMode(mode: StoreMode) {
  state.mode = mode
  emit()
}

/** Replace a profile with an edited copy (modals build the full next profile). */
export function saveProfile(next: Profile) {
  state.profiles = state.profiles.map((p) => (p.id === next.id ? next : p))
  // A profile can be made default — only one default at a time.
  if (next.isDefault) {
    state.profiles = state.profiles.map((p) => (p.id === next.id ? p : { ...p, isDefault: false }))
  }
  emit()
}

export function addProfile(profile: Profile): Profile {
  const created = { ...profile }
  if (created.isDefault) {
    state.profiles = state.profiles.map((p) => ({ ...p, isDefault: false }))
  }
  state.profiles = [...state.profiles, created]
  emit()
  return created
}

export function duplicateProfile(id: string): Profile | undefined {
  const src = state.profiles.find((p) => p.id === id)
  if (!src) return undefined
  const copy: Profile = {
    ...src,
    id: nextId('profile'),
    name: `${src.name} (Copy)`,
    isDefault: false,
    referenceId: null, // a duplicate is a new, locally-created profile
    collections: src.collections.map((c) => ({ ...c, id: nextId('col') })),
    printers: src.printers.map((pr) => ({ ...pr, id: nextId('prt') })),
    devices: src.devices.map((d) => ({ ...d, id: nextId('dev') })),
  }
  state.profiles = [...state.profiles, copy]
  emit()
  return copy
}

export function deleteProfile(id: string) {
  state.profiles = state.profiles.filter((p) => p.id !== id)
  emit()
}

export { blankProfile }
