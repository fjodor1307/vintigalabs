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

export interface ProductState {
  name: string
  productType: string
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
  // Modifiers
  modifierGroups: ModifierGroup[]
  // Catalogue (sibling list of products + collections, used by ProductsListScreen + CollectionsScreen)
  catalogue: CatalogueProduct[]
  allCollections: Collection[]
}

function uid(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function emptyVariant(title = ''): Variant {
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
  modifierGroups: [],
  catalogue: [
    { id: 'p1', name: '2016 Reserve Cabernet Sauvignon', sku: 'SKU-1234-1234', price: '27.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'Red Wine'], channels: ['Website', 'POS'] },
    { id: 'p2', name: '2018 Pinot Noir',                  sku: 'SKU-1234-1234', price: '43.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'Red Wine'], channels: ['Website', 'POS'] },
    { id: 'p3', name: '2020 Chardonnay',                  sku: 'SKU-1234-1234', price: '72.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'White Wine'], channels: ['Website', 'POS'] },
    { id: 'p4', name: '2020 Rose',                        sku: 'SKU-1234-1234', price: '12.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'Rose'], channels: ['POS'] },
    { id: 'p5', name: '2020 Riesling',                    sku: 'SKU-1234-1234', price: '16.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'White Wine'], channels: ['Website', 'POS'] },
    { id: 'p6', name: '2020 Pinot Gris',                  sku: 'SKU-1234-1234', price: '44.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'White Wine'], channels: ['Website'] },
    { id: 'p7', name: '2018 Reserve Cabernet Sauvignon',  sku: 'SKU-1234-1234', price: '27.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'Red Wine'], channels: ['Website'] },
    { id: 'p8', name: '2021 Chardonnay',                  sku: 'SKU-1234-1234', price: '17.00', type: 'Wine', availability: 'Public', collections: ['Wine', 'White Wine'], channels: ['POS'] },
  ],
  allCollections: [
    { id: 'c1', name: 'Mix Wines',  type: 'Wine Type',  productIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p8'] },
    { id: 'c2', name: 'White Wines', type: 'Wine Type',  productIds: [] },
    { id: 'c3', name: 'Red Wines',   type: 'Wine Type',  productIds: ['p1', 'p2', 'p7'] },
    { id: 'c4', name: 'Pale Ale',    type: 'Beer Type',  productIds: [] },
    { id: 'c5', name: 'On Tap',      type: 'Beer Type',  productIds: [] },
    { id: 'c6', name: 'Flights',     type: 'Tasting',    productIds: [] },
  ],
}

let state: ProductState = { ...initial }
const listeners = new Set<() => void>()

function emit() { listeners.forEach((l) => l()) }

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
    emit()
  },
  removeImage(id: string) {
    const img = state.images.find((i) => i.id === id)
    if (img) URL.revokeObjectURL(img.url)
    state = { ...state, images: state.images.filter((i) => i.id !== id) }
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
    // Don't trample uploaded images (blob URLs).
    state = {
      ...state,
      name: p.name,
      productType: p.type,
      collections: p.collections,
      // Variants: if catalogue product carries no variants, seed a single one.
      variants: state.variants.length > 0 ? state.variants : [
        { ...emptyVariant('Standard Bottle'), sku: p.sku, price: p.price, taxType: p.type },
      ],
    }
    emit()
  },

  reset() {
    state.images.forEach((i) => URL.revokeObjectURL(i.url))
    state = { ...initial }
    emit()
  },
}

export { uid as _uid }
