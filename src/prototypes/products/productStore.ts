import { useSyncExternalStore } from 'react'

// Prototype-level store. State is in-memory; uploaded images are blob URLs so
// they persist across hash navigation but die on full page reload.

export interface ProductImage {
  id: string
  url: string
  name: string
}

export interface Variant {
  id: string
  title: string
  price: string
  sku: string
  upcCode: string
  compareAtPrice: string
  taxType: string
  costOfGood: string
  alcoholPercentage: string
  weight: string
  volume: string
  physicalProduct: boolean
  /** 0-based display order. Drag-reorder updates this in the variants table. */
  sortOrder: number
}

export interface ModifierOption {
  id: string
  name: string
  price: string
}

export interface ModifierGroup {
  id: string
  name: string
  required: boolean
  multipleOptions: boolean
  enableOptionPrefixes: boolean
  options: ModifierOption[]
}

export interface CatalogueProduct {
  id: string
  name: string
  sku: string
  price: string
  type: string
  availability: 'Public' | 'Private' | 'Draft'
  collections: string[]
  imageUrl?: string
  channels: ('Website' | 'POS')[]
}

export interface Collection {
  id: string
  name: string
  type: string
  productIds: string[]
}

export type ExperienceType = 'Tasting' | 'Tour' | 'Other'
export type SeatingType = 'Communal' | 'Table'
export type ChargeType = 'On Booking' | '48 hours advance' | 'On Checkin' | 'No Charge'

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
export const WEEKDAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export interface TimeSlot {
  id: string
  /** "9:00" — free-form so the user can type half-hour offsets ("9:30"). */
  time: string
  period: 'AM' | 'PM'
  /** Whether this slot is bookable online. Off = phone-only. */
  online: boolean
}

export interface Blackout {
  id: string
  /** ISO date (yyyy-mm-dd). */
  startDate: string
  /** ISO date (yyyy-mm-dd). Empty = same as startDate (single-day blackout). */
  endDate: string
  /** "9:00" — empty means "all day". */
  startTime: string
  startPeriod: 'AM' | 'PM'
  endTime: string
  endPeriod: 'AM' | 'PM'
}

export interface ProductState {
  name: string
  productType: string
  /** Top-level product status — Available / Not Available. */
  status: 'Available' | 'Not Available'
  /** Per-channel status. Web Status mirrors the spec values for experiences. */
  webStatus: 'Available' | 'Not Available'
  /** Eligible for redemption with loyalty points. Shared across product types. */
  loyaltyPoints: boolean
  /** Web Subtitle / Teaser — moved to state so the editor can pre-fill them. */
  subtitle: string
  teaser: string
  /** SEO — store the values so we can auto-populate Meta Title + Slug from name. */
  metaTitle: string
  metaDescription: string
  slug: string
  /** True until the user types into the field — lets us replace the auto-filled
   *  value silently as the name evolves, and stop once the user takes ownership. */
  metaTitleAuto: boolean
  slugAuto: boolean
  tags: string[]
  collections: string[]
  images: ProductImage[]
  variants: Variant[]
  // Advanced
  department: string
  vendor: string
  wineType: string
  varietal: string
  vintage: string
  country: string
  region: string
  appellation: string
  taste: { body: number; sweetness: number; acidity: number; tannin: number; fruitiness: number }
  // Experience-specific
  experienceType: ExperienceType
  seatingType: SeatingType
  location: string
  durationMinutes: string
  leadTimeHours: string
  // Capacity — interpretation depends on seatingType.
  // Communal: per-time-slot headcount. Table: per-group size + tabletops per slot.
  minGuestsPerSlot: string
  maxGuestsPerSlot: string
  minGuestsPerGroup: string
  maxGuestsPerGroup: string
  maxGroupsPerSlot: string
  requiresHost: boolean
  /** ISO date (yyyy-mm-dd) — the date this experience first becomes available. */
  startDate: string
  /** ISO date (yyyy-mm-dd). Empty string means "no end date" (open-ended). */
  endDate: string
  chargeType: ChargeType
  /** Whether customers can cancel the booking themselves on the website. */
  allowCancelOnline: boolean
  /** Free-form instructions emailed to the customer on purchase. */
  customerInstructions: string
  /** Weekly bookable time slots, keyed by weekday. */
  timeSlotsByDay: Record<Weekday, TimeSlot[]>
  /** ISO date (yyyy-mm-dd). Empty = recurs indefinitely. */
  scheduleRepeatsUntil: string
  blackouts: Blackout[]
  // Modifiers
  modifierGroups: ModifierGroup[]
  // Catalogue (sibling list of products + collections, used by ProductsListScreen + CollectionsScreen)
  catalogue: CatalogueProduct[]
  allCollections: Collection[]
  /** ID of the catalogue row currently being edited (set by `loadFromCatalogue`).
   *  Image edits sync back to this row's thumbnail when set. */
  editingId: string | null
}

/** Slugify a product name into a URL-safe slug (spaces → "-", lowercase). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function uid(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function emptyVariant(title = '', sortOrder = 0): Variant {
  return {
    id: uid('v'),
    title,
    price: '',
    sku: '',
    upcCode: '',
    compareAtPrice: '',
    taxType: 'Wine',
    costOfGood: '',
    alcoholPercentage: '',
    weight: '',
    volume: '',
    physicalProduct: true,
    sortOrder,
  }
}

export function emptyModifierGroup(name = ''): ModifierGroup {
  return {
    id: uid('m'),
    name,
    required: false,
    multipleOptions: false,
    enableOptionPrefixes: false,
    options: [{ id: uid('o'), name: '', price: '' }],
  }
}

const initial: ProductState = {
  name: '',
  productType: 'Wine',
  status: 'Available',
  webStatus: 'Available',
  loyaltyPoints: false,
  subtitle: '',
  teaser: '',
  metaTitle: '',
  metaDescription: '',
  slug: '',
  metaTitleAuto: true,
  slugAuto: true,
  tags: [],
  collections: ['Wines', 'Red Wines'],
  images: [],
  variants: [],
  department: 'Wine',
  vendor: 'Wine',
  wineType: 'Red',
  varietal: 'Cabernet Sauvignon',
  vintage: '2015',
  country: 'US',
  region: 'CA',
  appellation: 'Napa Valley',
  taste: { body: 1, sweetness: 3, acidity: 4, tannin: 2, fruitiness: 4 },
  experienceType: 'Tasting',
  seatingType: 'Table',
  location: '',
  durationMinutes: '',
  leadTimeHours: '',
  minGuestsPerSlot: '',
  maxGuestsPerSlot: '',
  minGuestsPerGroup: '',
  maxGuestsPerGroup: '',
  maxGroupsPerSlot: '',
  requiresHost: false,
  startDate: '',
  endDate: '',
  chargeType: 'On Booking',
  allowCancelOnline: true,
  customerInstructions: '',
  timeSlotsByDay: {
    Monday: [
      { id: 'ts-mon-1', time: '10:00', period: 'AM', online: true },
      { id: 'ts-mon-2', time: '2:00', period: 'PM', online: true },
    ],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  },
  scheduleRepeatsUntil: '',
  blackouts: [],
  modifierGroups: [],
  catalogue: [
    { id: 'p1',  name: '2016 Reserve Cabernet Sauvignon', sku: 'SKU-1234-1234', price: '27.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'Red Wine'],   channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1697115355150-46dd3a5df633?w=320&h=320&fit=crop&q=80' },
    { id: 'p2',  name: '2018 Pinot Noir',                  sku: 'SKU-1234-1234', price: '43.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'Red Wine'],   channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1611571940159-425a28706d6f?w=320&h=320&fit=crop&q=80' },
    { id: 'p3',  name: '2020 Chardonnay',                  sku: 'SKU-1234-1234', price: '72.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'White Wine'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1642189941430-7073f85d7140?w=320&h=320&fit=crop&q=80' },
    { id: 'p4',  name: '2020 Rose',                        sku: 'SKU-1234-1234', price: '12.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'Rose'],       channels: ['POS'],            imageUrl: 'https://images.unsplash.com/photo-1710795476248-53791e560daf?w=320&h=320&fit=crop&q=80' },
    { id: 'p5',  name: '2020 Riesling',                    sku: 'SKU-1234-1234', price: '16.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'White Wine'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1710795476231-54c3b96d416f?w=320&h=320&fit=crop&q=80' },
    { id: 'p6',  name: '2020 Pinot Gris',                  sku: 'SKU-1234-1234', price: '44.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'White Wine'], channels: ['Website'],        imageUrl: 'https://images.unsplash.com/photo-1710795476210-8c64901f506b?w=320&h=320&fit=crop&q=80' },
    { id: 'p7',  name: '2018 Reserve Cabernet Sauvignon',  sku: 'SKU-1234-1234', price: '27.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'Red Wine'],   channels: ['Website'],        imageUrl: 'https://images.unsplash.com/photo-1710795476273-1edb00a92ebc?w=320&h=320&fit=crop&q=80' },
    { id: 'p8',  name: '2021 Chardonnay',                  sku: 'SKU-1234-1234', price: '17.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'White Wine'], channels: ['POS'],            imageUrl: 'https://images.unsplash.com/photo-1676024462421-f12102fc613d?w=320&h=320&fit=crop&q=80' },
    // ── New batch ─────────────────────────────────────────────────────────────
    { id: 'p9',  name: '2019 Merlot Estate',               sku: 'SKU-1234-1235', price: '34.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'Red Wine'],   channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1695634580213-c384a6201eee?w=320&h=320&fit=crop&q=80' },
    { id: 'p10', name: '2017 Syrah Reserve',               sku: 'SKU-1234-1236', price: '52.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'Red Wine'],   channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1697115355209-46e7bce340fb?w=320&h=320&fit=crop&q=80' },
    { id: 'p11', name: '2021 Sauvignon Blanc',             sku: 'SKU-1234-1237', price: '22.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'White Wine'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1588982766898-4a826e5ef631?w=320&h=320&fit=crop&q=80' },
    { id: 'p12', name: '2019 Brut Sparkling',              sku: 'SKU-1234-1238', price: '38.00', type: 'Wine', availability: 'Public', collections: ['Wine'],               channels: ['Website'],        imageUrl: 'https://images.unsplash.com/photo-1614208406223-5b78888e8b4b?w=320&h=320&fit=crop&q=80' },
    { id: 'p13', name: '2022 Late Harvest Riesling',       sku: 'SKU-1234-1239', price: '28.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'White Wine'], channels: ['POS'],            imageUrl: 'https://images.unsplash.com/photo-1605701061257-37892a5cc0ab?w=320&h=320&fit=crop&q=80' },
    // ── Experiences ───────────────────────────────────────────────────────────
    // Bookable experiences live in the products catalogue under the
    // Experiences tab. IDs are e-prefixed.
    { id: 'e1',  name: 'Reserve Cellar Tasting',           sku: 'EXP-1001',     price: '45.00', type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tastings'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1558346489-19413928158b?w=320&h=320&fit=crop&q=80' },
    { id: 'e2',  name: 'Vineyard Walking Tour',            sku: 'EXP-1002',     price: '35.00', type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tours'],    channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1559528691-a48bcdb6d97b?w=320&h=320&fit=crop&q=80' },
    { id: 'e3',  name: 'Library Vintage Flight',           sku: 'EXP-1003',     price: '85.00', type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tastings'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=320&h=320&fit=crop&q=80' },
    { id: 'e4',  name: 'Sunset Estate Tour',               sku: 'EXP-1004',     price: '60.00', type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tours'],    channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=320&h=320&fit=crop&q=80' },
    { id: 'e5',  name: 'Blending Workshop',                sku: 'EXP-1005',     price: '125.00',type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Workshops'],channels: ['Website'],        imageUrl: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=320&h=320&fit=crop&q=80' },
    { id: 'e6',  name: 'Barrel Room Private Tasting',      sku: 'EXP-1006',     price: '95.00', type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tastings'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=320&h=320&fit=crop&q=80' },
    { id: 'e7',  name: 'Harvest Day Experience',           sku: 'EXP-1007',     price: '150.00',type: 'Experience', availability: 'Private', collections: ['Experiences', 'Seasonal'], channels: ['Website'],        imageUrl: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=320&h=320&fit=crop&q=80' },
    { id: 'e8',  name: 'Food + Wine Pairing',              sku: 'EXP-1008',     price: '75.00', type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tastings'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=320&h=320&fit=crop&q=80' },
  ],
  allCollections: [
    { id: 'c1', name: 'Mix Wines',  type: 'Wine Type',  productIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p8'] },
    { id: 'c2', name: 'White Wines', type: 'Wine Type',  productIds: [] },
    { id: 'c3', name: 'Red Wines',   type: 'Wine Type',  productIds: ['p1', 'p2', 'p7'] },
    { id: 'c4', name: 'Pale Ale',    type: 'Beer Type',  productIds: [] },
    { id: 'c5', name: 'On Tap',      type: 'Beer Type',  productIds: [] },
    { id: 'c6', name: 'Flights',     type: 'Tasting',    productIds: [] },
  ],
  editingId: null,
}

let state: ProductState = { ...initial }
const listeners = new Set<() => void>()

function emit() { listeners.forEach((l) => l()) }

/**
 * Push the editor's first image URL back to the catalogue row's thumbnail
 * so the products list & collections list stay in sync with what the user
 * sees (and edits) on the product editor.
 */
function syncCatalogueThumb() {
  const id = state.editingId
  if (!id) return
  const next = state.images[0]?.url
  state = {
    ...state,
    catalogue: state.catalogue.map((p) =>
      p.id === id ? { ...p, imageUrl: next } : p,
    ),
  }
}

export function useProductState(): ProductState {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => { listeners.delete(l) } },
    () => state,
    () => state,
  )
}

export const productActions = {
  setName(name: string) {
    // Mirror the name into auto-managed Meta Title + Slug until the user
    // edits them directly. Spec: at creation time, Meta Title defaults to
    // Product Title and Slug defaults to slugified Product Title.
    const next: Partial<ProductState> = { name }
    if (state.metaTitleAuto) next.metaTitle = name
    if (state.slugAuto)      next.slug      = slugify(name)
    state = { ...state, ...next }
    emit()
  },
  setProductType(productType: string) { state = { ...state, productType }; emit() },
  setStatus(status: ProductState['status']) { state = { ...state, status }; emit() },
  setWebStatus(webStatus: ProductState['webStatus']) { state = { ...state, webStatus }; emit() },
  setLoyaltyPoints(loyaltyPoints: boolean) { state = { ...state, loyaltyPoints }; emit() },
  setSubtitle(subtitle: string) { state = { ...state, subtitle }; emit() },
  setTeaser(teaser: string) { state = { ...state, teaser }; emit() },
  /** Direct Meta Title edit — flips auto-fill OFF so future name changes
   *  don't overwrite what the user typed. */
  setMetaTitle(metaTitle: string) {
    state = { ...state, metaTitle, metaTitleAuto: false }
    emit()
  },
  setMetaDescription(metaDescription: string) {
    state = { ...state, metaDescription }
    emit()
  },
  setSlug(slug: string) {
    state = { ...state, slug, slugAuto: false }
    emit()
  },

  addImage(file: File) {
    const url = URL.createObjectURL(file)
    const img: ProductImage = { id: uid('img'), url, name: file.name }
    state = { ...state, images: [...state.images, img] }
    syncCatalogueThumb()
    emit()
  },
  addImages(files: File[]) {
    files.forEach((f) => this.addImage(f))
  },
  removeImage(id: string) {
    const img = state.images.find((i) => i.id === id)
    if (img && img.url.startsWith('blob:')) URL.revokeObjectURL(img.url)
    state = { ...state, images: state.images.filter((i) => i.id !== id) }
    syncCatalogueThumb()
    emit()
  },

  // Variants — modal-driven
  upsertVariant(variant: Variant) {
    const exists = state.variants.some((v) => v.id === variant.id)
    const variants = exists
      ? state.variants.map((v) => v.id === variant.id ? variant : v)
      : [...state.variants, variant]
    state = { ...state, variants }
    emit()
  },
  removeVariant(id: string) {
    state = { ...state, variants: state.variants.filter((v) => v.id !== id) }
    emit()
  },
  reorderVariant(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    const next = [...state.variants]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    state = { ...state, variants: next }
    emit()
  },

  // Advanced
  setAdvanced(patch: Partial<ProductState>) {
    state = { ...state, ...patch }
    emit()
  },
  setTaste(key: keyof ProductState['taste'], value: number) {
    state = { ...state, taste: { ...state.taste, [key]: value } }
    emit()
  },

  // Reservation time slots — keyed by weekday
  addTimeSlot(day: Weekday) {
    const slot: TimeSlot = { id: uid('ts'), time: '', period: 'AM', online: true }
    state = {
      ...state,
      timeSlotsByDay: { ...state.timeSlotsByDay, [day]: [...state.timeSlotsByDay[day], slot] },
    }
    emit()
  },
  updateTimeSlot(day: Weekday, id: string, patch: Partial<TimeSlot>) {
    state = {
      ...state,
      timeSlotsByDay: {
        ...state.timeSlotsByDay,
        [day]: state.timeSlotsByDay[day].map((s) => (s.id === id ? { ...s, ...patch } : s)),
      },
    }
    emit()
  },
  removeTimeSlot(day: Weekday, id: string) {
    state = {
      ...state,
      timeSlotsByDay: {
        ...state.timeSlotsByDay,
        [day]: state.timeSlotsByDay[day].filter((s) => s.id !== id),
      },
    }
    emit()
  },

  // Recurrence + blackouts
  setScheduleRepeatsUntil(value: string) {
    state = { ...state, scheduleRepeatsUntil: value }
    emit()
  },
  addBlackout() {
    const b: Blackout = {
      id: uid('bl'),
      startDate: '',
      endDate: '',
      startTime: '',
      startPeriod: 'AM',
      endTime: '',
      endPeriod: 'PM',
    }
    state = { ...state, blackouts: [...state.blackouts, b] }
    emit()
  },
  updateBlackout(id: string, patch: Partial<Blackout>) {
    state = {
      ...state,
      blackouts: state.blackouts.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }
    emit()
  },
  removeBlackout(id: string) {
    state = { ...state, blackouts: state.blackouts.filter((b) => b.id !== id) }
    emit()
  },

  // Modifier groups — modal-driven
  upsertModifierGroup(group: ModifierGroup) {
    const exists = state.modifierGroups.some((g) => g.id === group.id)
    const modifierGroups = exists
      ? state.modifierGroups.map((g) => g.id === group.id ? group : g)
      : [...state.modifierGroups, group]
    state = { ...state, modifierGroups }
    emit()
  },
  removeModifierGroup(id: string) {
    state = { ...state, modifierGroups: state.modifierGroups.filter((g) => g.id !== id) }
    emit()
  },
  reorderModifierGroup(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    const next = [...state.modifierGroups]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    state = { ...state, modifierGroups: next }
    emit()
  },

  // Catalogue collections
  addCollection(name: string, type = 'Wine Type') {
    state = { ...state, allCollections: [...state.allCollections, { id: uid('c'), name, type, productIds: [] }] }
    emit()
  },
  removeCollection(id: string) {
    state = { ...state, allCollections: state.allCollections.filter((c) => c.id !== id) }
    emit()
  },
  duplicateCollection(id: string): string | null {
    const src = state.allCollections.find((c) => c.id === id)
    if (!src) return null
    const newId = uid('c')
    const dup: Collection = { id: newId, name: `${src.name} Copy`, type: src.type, productIds: [...src.productIds] }
    const idx = state.allCollections.findIndex((c) => c.id === id)
    const next = [...state.allCollections]
    next.splice(idx + 1, 0, dup)
    state = { ...state, allCollections: next }
    emit()
    return newId
  },
  removeProductFromCollection(collectionId: string, productId: string) {
    state = {
      ...state,
      allCollections: state.allCollections.map((c) =>
        c.id === collectionId ? { ...c, productIds: c.productIds.filter((p) => p !== productId) } : c,
      ),
    }
    emit()
  },
  addProductToCollection(collectionId: string, productId: string) {
    state = {
      ...state,
      allCollections: state.allCollections.map((c) =>
        c.id === collectionId && !c.productIds.includes(productId)
          ? { ...c, productIds: [...c.productIds, productId] }
          : c,
      ),
    }
    emit()
  },
  reorderProductInCollection(collectionId: string, fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    state = {
      ...state,
      allCollections: state.allCollections.map((c) => {
        if (c.id !== collectionId) return c
        const next = [...c.productIds]
        const [m] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, m)
        return { ...c, productIds: next }
      }),
    }
    emit()
  },
  /** For prototype demo only — clears all collections so the empty-state can be shown. */
  clearCollections() {
    state = { ...state, allCollections: [] }
    emit()
  },

  /**
   * Load a catalogue product into the in-progress product, so the editor screens render
   * it as if it had just been opened for editing. Idempotent — bails if already loaded.
   */
  loadFromCatalogue(productId: string) {
    if (state.name && state.images.length > 0 && productId === '__current') return
    const p = state.catalogue.find((x) => x.id === productId)
    if (!p) return

    // Drop any existing blob-URL uploads (we only own those during this session).
    state.images.forEach((i) => { if (i.url.startsWith('blob:')) URL.revokeObjectURL(i.url) })

    // Seed a single image entry from the catalogue's primary photo.
    const images: ProductImage[] = p.imageUrl
      ? [{ id: uid('img'), url: p.imageUrl, name: p.name }]
      : []

    // For experiences, seed a sensible variant title + tax type so the editor
    // doesn't open with wine defaults bleeding through.
    const isExperience = p.type === 'Experience'
    const seedTitle = isExperience ? 'Standard' : 'Standard Bottle'
    const seedTax   = isExperience ? 'Experience' : p.type

    state = {
      ...state,
      editingId: productId,
      name: p.name,
      productType: p.type,
      // Department mirrors product type — keeps the Advanced tab on the right
      // type-specific properties card (Wine vs Experience).
      department: p.type,
      collections: p.collections,
      images,
      // Reset SEO auto-fill so loading a product starts a clean cycle.
      metaTitle: p.name,
      slug: slugify(p.name),
      metaTitleAuto: true,
      slugAuto: true,
      // Variants: if catalogue product carries no variants, seed a single one.
      variants: state.variants.length > 0 ? state.variants : [
        { ...emptyVariant(seedTitle, 0), sku: p.sku, price: p.price, taxType: seedTax },
      ],
    }
    emit()
  },

  reset() {
    state.images.forEach((i) => { if (i.url.startsWith('blob:')) URL.revokeObjectURL(i.url) })
    state = { ...initial }
    emit()
  },

  /**
   * Start editing a brand-new product. Clears the editor-specific fields
   * (name, content, images, variants, collections, editingId) but leaves the
   * catalogue and collections lists intact so the user can return to them.
   * Pre-fills `productType` with the picked type.
   */
  startNewProduct(productType: string) {
    state.images.forEach((i) => { if (i.url.startsWith('blob:')) URL.revokeObjectURL(i.url) })
    state = {
      ...state,
      editingId: null,
      name: '',
      productType,
      // Mirror department to drive the Advanced tab branching.
      department: productType,
      tags: [],
      collections: [],
      images: [],
      variants: [],
      // Reset SEO auto-fill so a fresh product starts with empty Meta Title + Slug.
      metaTitle: '',
      slug: '',
      metaTitleAuto: true,
      slugAuto: true,
    }
    emit()
  },
}

export { uid as _uid }
