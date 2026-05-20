import { useSyncExternalStore } from 'react'

// ─── clubStore ────────────────────────────────────────────────────────────────
// Tiny in-memory store for the Club editor flow. Holds the draft club the user
// is creating / editing. Survives navigation between tabs (Overview / Releases /
// Levels / Emails) but resets when the user explicitly starts a new draft via
// `clubActions.startNew(type)`.
//
// Pattern matches `productStore.ts` — module-level state + `useSyncExternalStore`
// for components.

export type ClubKind = 'curated' | 'account-credit' | 'membership'

export interface ClubImage {
  id: string
  url: string
  name: string
}

export type ContributionCadence = 'Monthly' | 'Quarterly' | 'Annually'

export interface ClubLevel {
  id: string
  name: string
  amount: number
  /** Contribution cadence per level (Figma 5079:46371). */
  cadence: ContributionCadence
  isDefault: boolean
}

export interface ClubRelease {
  id: string
  title: string
  minQty: number
  maxQty?: number
  minOrderSubtotal: number
  autoProcessDate?: string
  startTime?: string
  shipmentInstructions: string
  letMembersProcessEarly: boolean
  allowSkipOnline: boolean
  productCount: number
}

export interface ClubDraft {
  // Core
  type: ClubKind
  name: string
  status: 'active' | 'inactive'
  availableOnWebsite: boolean
  description: string

  // Curated / Membership-specific
  durationOfMembership: '3 Months' | '6 Months' | '12 Months' | 'Indefinite'
  hasMembershipFee: boolean
  membershipFee: number
  // Tax rate uses the same dropdown taxonomy as Products (see VariantModal).
  taxRate: string

  // Required for every club type — signup creates a real order against this
  // SKU so accounting can reconcile revenue.
  sku: string

  // Membership-specific — surfaced in the rail as a static read-only flag
  // (Figma 5079:44506). Always true for the membership type.
  autoRenew: boolean

  // Account Credit-specific
  levels: ClubLevel[]

  // Curated-specific
  releases: ClubRelease[]

  // Images
  images: ClubImage[]

  // Terms
  requireAcceptTerms: boolean
  termsBody: string

  // SEO
  metaTitle: string
  metaDescription: string
  slug: string

  // Read-only fields shown in the rail
  dateCreated: string
}

const TYPE_LABEL: Record<ClubKind, string> = {
  curated:          'Curated Club',
  'account-credit': 'Tasting Credit',
  membership:       'Membership',
}

function emptyDraft(type: ClubKind): ClubDraft {
  return {
    type,
    name: '',
    status: 'inactive',
    availableOnWebsite: true,
    description: '',
    durationOfMembership: '12 Months',
    hasMembershipFee: type === 'curated' || type === 'membership',
    membershipFee: 0,
    taxRate: '',
    sku: '',
    autoRenew: type === 'membership',
    levels:
      type === 'account-credit'
        ? [
            { id: 'l1', name: '', amount: 0, cadence: 'Monthly', isDefault: true },
            { id: 'l2', name: '', amount: 0, cadence: 'Monthly', isDefault: false },
          ]
        : [],
    releases: [],
    images: [],
    requireAcceptTerms: false,
    termsBody: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    dateCreated: 'Mar 15, 2025',
  }
}

let state: ClubDraft = emptyDraft('curated')

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

export function useClubState(): ClubDraft {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
    () => state,
  )
}

export const clubActions = {
  startNew(type: ClubKind) {
    state = emptyDraft(type)
    emit()
  },
  patch<K extends keyof ClubDraft>(key: K, value: ClubDraft[K]) {
    state = { ...state, [key]: value }
    emit()
  },
  // Levels
  addLevel() {
    const id = `l${state.levels.length + 1}`
    state = {
      ...state,
      levels: [
        ...state.levels,
        { id, name: '', amount: 0, cadence: 'Monthly', isDefault: state.levels.length === 0 },
      ],
    }
    emit()
  },
  removeLevel(id: string) {
    state = { ...state, levels: state.levels.filter((l) => l.id !== id) }
    emit()
  },
  setLevelDefault(id: string) {
    state = {
      ...state,
      levels: state.levels.map((l) => ({ ...l, isDefault: l.id === id })),
    }
    emit()
  },
  patchLevel(id: string, partial: Partial<ClubLevel>) {
    state = {
      ...state,
      levels: state.levels.map((l) => (l.id === id ? { ...l, ...partial } : l)),
    }
    emit()
  },
  // Releases
  addRelease(release: ClubRelease) {
    state = { ...state, releases: [...state.releases, release] }
    emit()
  },
  // Images — uses object URLs so previews work without a backend; URLs die on
  // a hard refresh (we don't `URL.revokeObjectURL` since the prototype is
  // short-lived).
  addImage(file: File) {
    const url = URL.createObjectURL(file)
    const id  = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    state = { ...state, images: [...state.images, { id, url, name: file.name }] }
    emit()
  },
  addImages(files: File[]) {
    files.forEach((f) => this.addImage(f))
  },
  removeImage(id: string) {
    state = { ...state, images: state.images.filter((i) => i.id !== id) }
    emit()
  },
}

export function clubTypeLabel(type: ClubKind): string {
  return TYPE_LABEL[type]
}
