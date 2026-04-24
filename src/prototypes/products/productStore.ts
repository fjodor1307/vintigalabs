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

  reset() {
    state.images.forEach((i) => URL.revokeObjectURL(i.url))
    state = { ...initial }
    emit()
  },
}

export { uid as _uid }
