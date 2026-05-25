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

export type ContributionCadence = 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual'

export const CADENCE_OPTIONS: ContributionCadence[] = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual']

export interface ClubLevel {
  id: string
  name: string
  amount: number
  /** Per-level SKU (VIN-496). Each level acts like a variant for the cart. */
  sku: string
  isDefault: boolean
}

/** Top-level Duration options for Curated / Rewards clubs (required, no default). */
export type ClubDuration = '' | '1 Month' | '3 Months' | '6 Months' | '12 Months'
export const DURATION_OPTIONS: ClubDuration[] = ['1 Month', '3 Months', '6 Months', '12 Months']

/** Store tax-rate list. Vintiga clubs default to Non-Taxable. */
export const TAX_RATE_OPTIONS = ['Non-Taxable', 'Wine', 'Beer', 'Spirits', 'Food', 'Merchandise']

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

  // Curated / Rewards — top-level Duration (required, no default).
  duration: ClubDuration
  // Has-Fee toggle defaults to No; the next three fields show when Yes.
  hasMembershipFee: boolean
  /** Required when hasMembershipFee, must be > 0. */
  membershipFee: number
  /** Membership Duration in months (under Has-Fee=Yes). Default 12. */
  membershipDurationMonths: string
  /** Membership Fee Tax Rate. Default Non-Taxable. */
  taxRate: string

  // Curated / Rewards Membership SKU. Tasting Credit uses per-level SKUs only.
  sku: string

  // Membership-specific — surfaced in the rail as a static read-only flag
  // (Figma 5079:44506). Always true for the membership type.
  autoRenew: boolean

  // Account Credit-specific
  // Per VIN-496, a contribution level is just Name + Amount. Cadence + tax rate
  // are club-wide (every level shares them); the cart SKU is the club-level
  // Membership SKU (`sku`).
  cadence: ContributionCadence
  levels: ClubLevel[]

  // Curated-specific
  releases: ClubRelease[]

  // Images
  images: ClubImage[]

  // Terms
  requireAcceptTerms: boolean
  termsBody: string

  // SEO — Meta Title and Slug auto-derive from the club Title until the user
  // edits them manually; the auto flags track ownership so we know when to stop
  // overwriting.
  metaTitle: string
  metaDescription: string
  slug: string
  metaTitleAuto: boolean
  slugAuto: boolean

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
    status: 'active',
    availableOnWebsite: true,
    description: '',
    duration: '',
    hasMembershipFee: false,
    membershipFee: 0,
    membershipDurationMonths: '12',
    taxRate: 'Non-Taxable',
    sku: '',
    autoRenew: type === 'membership',
    cadence: 'Monthly',
    levels:
      type === 'account-credit'
        ? [
            { id: 'l1', name: '', amount: 0, sku: '', isDefault: true },
            { id: 'l2', name: '', amount: 0, sku: '', isDefault: false },
          ]
        : [],
    releases: [],
    images: [],
    requireAcceptTerms: false,
    termsBody: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    metaTitleAuto: true,
    slugAuto: true,
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

/** URL-safe slug — lowercase, ASCII, spaces → hyphens. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
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
  /** Set the club Title and auto-fill Meta Title + Slug while the user hasn't
   *  taken ownership of those fields. */
  setName(value: string) {
    state = {
      ...state,
      name: value,
      metaTitle: state.metaTitleAuto ? value : state.metaTitle,
      slug:      state.slugAuto      ? slugify(value) : state.slug,
    }
    emit()
  },
  /** Manual edit of Meta Title — stops the auto-fill from Title. */
  setMetaTitle(value: string) {
    state = { ...state, metaTitle: value, metaTitleAuto: false }
    emit()
  },
  /** Manual edit of Slug — stops the auto-fill from Title. */
  setSlug(value: string) {
    state = { ...state, slug: value, slugAuto: false }
    emit()
  },
  // Levels
  addLevel() {
    const id = `l${state.levels.length + 1}`
    state = {
      ...state,
      levels: [
        ...state.levels,
        { id, name: '', amount: 0, sku: '', isDefault: state.levels.length === 0 },
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
