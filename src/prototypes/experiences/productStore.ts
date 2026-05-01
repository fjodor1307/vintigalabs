import { useSyncExternalStore } from 'react'

// Prototype-level store. State is in-memory; uploaded images are blob URLs so
// they persist across hash navigation but die on full page reload.

export interface ProductImage {
  id: string
  url: string
  name: string
}

// Experience variants drop the physical-goods fields (UPC, weight, compare-at,
// alcohol %, volume) and surface the fields specific to selling an experience:
// cost, sort order, tax type, loyalty redemption, optional department.
export interface Variant {
  id: string
  title: string
  price: string
  sku: string
  cost: string
  sortOrder: string
  taxType: string
  redeemableWithLoyalty: boolean
  department: string
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

export interface ProductState {
  name: string
  productType: string
  tags: string[]
  collections: string[]
  images: ProductImage[]
  variants: Variant[]
  // Advanced — global
  department: string
  // Advanced — experience-specific
  experienceType: ExperienceType
  location: string
  defaultLocation: string
  durationMinutes: string
  leadTimeHours: string
  requiresHost: boolean
  // Catalogue (sibling list of experiences + collections, used by ProductsListScreen + CollectionsScreen)
  catalogue: CatalogueProduct[]
  allCollections: Collection[]
  /** ID of the catalogue row currently being edited (set by `loadFromCatalogue`).
   *  Image edits sync back to this row's thumbnail when set. */
  editingId: string | null
}

function uid(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function emptyVariant(title = 'each'): Variant {
  return {
    id: uid('v'),
    title,
    price: '',
    sku: '',
    cost: '',
    sortOrder: '',
    taxType: 'Experience',
    redeemableWithLoyalty: false,
    department: '',
  }
}

const initial: ProductState = {
  name: '',
  productType: 'Experience',
  tags: [],
  collections: ['Experiences', 'Tastings'],
  images: [],
  variants: [],
  department: 'Experience',
  experienceType: 'Tasting',
  location: 'Estate Tasting Room',
  defaultLocation: 'Estate Tasting Room',
  durationMinutes: '60',
  leadTimeHours: '24',
  requiresHost: true,
  catalogue: [
    // IDs are e-prefixed so they line up with the experience entries seeded
    // in the products prototype (`src/prototypes/products/productStore.ts`).
    // Clicking an experience row in the products list routes here with the
    // same id and `loadFromCatalogue` finds the row.
    { id: 'e1',  name: 'Reserve Cellar Tasting',         sku: 'EXP-1001', price: '45.00',  type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tastings'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1558346489-19413928158b?w=320&h=320&fit=crop&q=80' },
    { id: 'e2',  name: 'Vineyard Walking Tour',          sku: 'EXP-1002', price: '35.00',  type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tours'],    channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1559528691-a48bcdb6d97b?w=320&h=320&fit=crop&q=80' },
    { id: 'e3',  name: 'Library Vintage Flight',         sku: 'EXP-1003', price: '85.00',  type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tastings'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=320&h=320&fit=crop&q=80' },
    { id: 'e4',  name: 'Sunset Estate Tour',             sku: 'EXP-1004', price: '60.00',  type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tours'],    channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=320&h=320&fit=crop&q=80' },
    { id: 'e5',  name: 'Blending Workshop',              sku: 'EXP-1005', price: '125.00', type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Workshops'],channels: ['Website'],        imageUrl: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=320&h=320&fit=crop&q=80' },
    { id: 'e6',  name: 'Barrel Room Private Tasting',    sku: 'EXP-1006', price: '95.00',  type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tastings'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=320&h=320&fit=crop&q=80' },
    { id: 'e7',  name: 'Harvest Day Experience',         sku: 'EXP-1007', price: '150.00', type: 'Experience', availability: 'Private', collections: ['Experiences', 'Seasonal'], channels: ['Website'],        imageUrl: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=320&h=320&fit=crop&q=80' },
    { id: 'e8',  name: 'Food + Wine Pairing',            sku: 'EXP-1008', price: '75.00',  type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tastings'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=320&h=320&fit=crop&q=80' },
    { id: 'e9',  name: 'Rosé Garden Tasting',            sku: 'EXP-1009', price: '40.00',  type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tastings'], channels: ['Website', 'POS'], imageUrl: 'https://images.unsplash.com/photo-1510626176961-4b87f8b4421a?w=320&h=320&fit=crop&q=80' },
    { id: 'e10', name: 'Vintner Lunch',                  sku: 'EXP-1010', price: '180.00', type: 'Experience', availability: 'Public',  collections: ['Experiences', 'Tastings'], channels: ['Website'],        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=320&h=320&fit=crop&q=80' },
  ],
  allCollections: [
    { id: 'c1', name: 'Tastings',   type: 'Experience Type', productIds: ['e1', 'e3', 'e6', 'e8', 'e9', 'e10'] },
    { id: 'c2', name: 'Tours',      type: 'Experience Type', productIds: ['e2', 'e4'] },
    { id: 'c3', name: 'Workshops',  type: 'Experience Type', productIds: ['e5'] },
    { id: 'c4', name: 'Seasonal',   type: 'Experience Type', productIds: ['e7'] },
    { id: 'c5', name: 'Private',    type: 'Experience Type', productIds: ['e6', 'e7', 'e10'] },
  ],
  editingId: null,
}

let state: ProductState = { ...initial }
const listeners = new Set<() => void>()

function emit() { listeners.forEach((l) => l()) }

/**
 * Push the editor's first image URL back to the catalogue row's thumbnail
 * so the experiences list & collections list stay in sync with what the user
 * sees (and edits) on the editor.
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
  setName(name: string) { state = { ...state, name }; emit() },
  setProductType(productType: string) { state = { ...state, productType }; emit() },

  addImage(file: File) {
    const url = URL.createObjectURL(file)
    const img: ProductImage = { id: uid('img'), url, name: file.name }
    state = { ...state, images: [...state.images, img] }
    syncCatalogueThumb()
    emit()
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

  // Catalogue collections
  addCollection(name: string, type = 'Experience Type') {
    state = { ...state, allCollections: [...state.allCollections, { id: uid('c'), name, type, productIds: [] }] }
    emit()
  },
  removeCollection(id: string) {
    state = { ...state, allCollections: state.allCollections.filter((c) => c.id !== id) }
    emit()
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
   * Load a catalogue experience into the in-progress product, so the editor screens
   * render it as if it had just been opened for editing. Idempotent — bails if already loaded.
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

    state = {
      ...state,
      editingId: productId,
      name: p.name,
      productType: p.type,
      collections: p.collections,
      images,
      // Variants: if the experience has none, seed a single one named "each"
      // (the brief's required default).
      variants: state.variants.length > 0 ? state.variants : [
        { ...emptyVariant('each'), sku: p.sku, price: p.price },
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
   * Start editing a brand-new experience. Clears the editor-specific fields
   * (name, content, images, variants, collections, editingId) but leaves the
   * catalogue and collections lists intact.
   */
  startNewProduct(productType: string) {
    state.images.forEach((i) => { if (i.url.startsWith('blob:')) URL.revokeObjectURL(i.url) })
    state = {
      ...state,
      editingId: null,
      name: '',
      productType,
      tags: [],
      collections: [],
      images: [],
      variants: [],
    }
    emit()
  },
}

export { uid as _uid }
