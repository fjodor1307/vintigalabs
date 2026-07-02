// POS Profiles — data model + seed.
// A store holds several POS profiles. In a Commerce7-connected store the
// profiles are ingested from C7 and most fields are read-only; in a Vintiga
// stand-alone store every field is editable and profiles can be added.
// See CONTEXT.md / _context/requirements.md for the field spec.

export type StoreMode = 'standalone' | 'c7'
export type TipType = 'percentage' | 'amounts'

export type Collection = {
  id: string
  name: string
  productCount: number
  colorHex: string
  showImages: boolean
  sortOrder: number
}

export type Printer = {
  id: string
  title: string
  printerId: string
  type: string
}

export type Device = {
  id: string
  title: string
  terminalId: string
  type: string
}

export type Profile = {
  id: string
  name: string
  colorHex: string
  isDefault: boolean
  salesAttribute: string
  operationalLocation: string
  // Tips
  tipsEnabled: boolean
  tipType: TipType
  tipOptions: string[]
  displayOnEmv: boolean
  // Finalizing orders & employee PINs
  employeePin: boolean
  requirePinBeforePayment: boolean
  requirePinAfterOrder: boolean
  additionalOrderInfo: boolean
  kitchenTickets: boolean
  sendToKitchen: boolean
  tableManagement: boolean
  printers: Printer[]
  // Chip & PIN devices
  devices: Device[]
  // Collections
  collections: Collection[]
  // Inventory (physical locations mapped to inventory locations)
  carryOutLocation: string
  shipLocation: string
  pickupLocation: string
  /** Commerce7 profile id when ingested from C7; null for locally-created. */
  referenceId: string | null
}

// ─── Option lists ─────────────────────────────────────────────────────────────

export const OPERATIONAL_LOCATIONS = [
  'No Location',
  'Vineyard Bellingham',
  'Downtown Tasting Room',
  'Tasting Room Downtown',
]

export const INVENTORY_LOCATIONS = [
  'New York Tasting Room',
  'Vintiga Labs, Inc',
  'Vineyard Bellingham',
  'Downtown Warehouse',
]

export const DEVICE_TYPES = ['Ingenico iCT250', 'Ingenico Move/5000', 'Verifone P400', 'PAX A920']
export const PRINTER_TYPES = ['Epson Cloud', 'Star Cloud', 'Epson TM-m30', 'Star TSP143']

/** A small palette of on-brand hex colors offered when picking a profile /
 *  collection color. Value is what's stored; label is for humans. */
export const COLOR_SWATCHES: { hex: string; label: string }[] = [
  { hex: '#6366F1', label: 'Indigo' },
  { hex: '#10B981', label: 'Green' },
  { hex: '#F59E0B', label: 'Amber' },
  { hex: '#EF4444', label: 'Red' },
  { hex: '#3B82F6', label: 'Blue' },
  { hex: '#8B5CF6', label: 'Purple' },
  { hex: '#EC4899', label: 'Pink' },
  { hex: '#14B8A6', label: 'Teal' },
]

export function colorName(hex: string): string {
  return COLOR_SWATCHES.find((s) => s.hex.toLowerCase() === hex.toLowerCase())?.label ?? hex.toUpperCase()
}

// ─── Seed profiles ────────────────────────────────────────────────────────────

let uid = 0
export const nextId = (prefix: string) => `${prefix}-${(++uid).toString(36)}${Date.now().toString(36).slice(-3)}`

const fullCollections: Collection[] = [
  { id: 'col-wine', name: 'Wine Selection', productCount: 24, colorHex: '#6366F1', showImages: true, sortOrder: 1 },
  { id: 'col-appetizers', name: 'Appetizers', productCount: 12, colorHex: '#10B981', showImages: false, sortOrder: 2 },
  { id: 'col-tasting', name: 'Tasting Experiences', productCount: 8, colorHex: '#F59E0B', showImages: false, sortOrder: 3 },
]

export const SEED_PROFILES: Profile[] = [
  {
    id: 'tasting-room-downtown',
    name: 'Tasting Room Downtown',
    colorHex: '#8B5CF6',
    isDefault: true,
    salesAttribute: 'POS',
    operationalLocation: 'Vineyard Bellingham',
    tipsEnabled: true,
    tipType: 'percentage',
    tipOptions: ['15', '18', '20', '25'],
    displayOnEmv: false,
    employeePin: true,
    requirePinBeforePayment: true,
    requirePinAfterOrder: true,
    additionalOrderInfo: true,
    kitchenTickets: false,
    sendToKitchen: true,
    tableManagement: false,
    printers: [
      { id: 'prt-1', title: 'Receipt Printer', printerId: 'PRT-001', type: 'Epson Cloud' },
      { id: 'prt-2', title: 'Kitchen Printer', printerId: 'PRT-002', type: 'Star Cloud' },
    ],
    devices: [{ id: 'dev-1', title: 'Main Terminal', terminalId: 'TRM-001', type: 'Ingenico iCT250' }],
    collections: fullCollections.map((c) => ({ ...c })),
    carryOutLocation: 'New York Tasting Room',
    shipLocation: 'Vintiga Labs, Inc',
    pickupLocation: 'New York Tasting Room',
    referenceId: 'c7-88fa21',
  },
  {
    id: 'remote-events',
    name: 'Remote Events',
    colorHex: '#10B981',
    isDefault: false,
    salesAttribute: 'POS',
    operationalLocation: 'No Location',
    tipsEnabled: true,
    tipType: 'percentage',
    tipOptions: ['10', '15', '20', '25'],
    displayOnEmv: true,
    employeePin: false,
    requirePinBeforePayment: false,
    requirePinAfterOrder: false,
    additionalOrderInfo: false,
    kitchenTickets: false,
    sendToKitchen: false,
    tableManagement: false,
    printers: [],
    devices: [{ id: 'dev-2', title: 'Mobile Reader', terminalId: 'TRM-014', type: 'PAX A920' }],
    collections: [{ id: 'col-wine-2', name: 'Wine Selection', productCount: 24, colorHex: '#6366F1', showImages: true, sortOrder: 1 }],
    carryOutLocation: 'Vintiga Labs, Inc',
    shipLocation: 'Vintiga Labs, Inc',
    pickupLocation: 'Vintiga Labs, Inc',
    referenceId: 'c7-1290bb',
  },
  {
    id: 'vintiga-patio',
    name: 'Vintiga - Patio',
    colorHex: '#F59E0B',
    isDefault: false,
    salesAttribute: 'POS',
    operationalLocation: 'Vineyard Bellingham',
    tipsEnabled: true,
    tipType: 'amounts',
    tipOptions: ['2', '3', '5', '10'],
    displayOnEmv: false,
    employeePin: true,
    requirePinBeforePayment: false,
    requirePinAfterOrder: true,
    additionalOrderInfo: false,
    kitchenTickets: true,
    sendToKitchen: true,
    tableManagement: true,
    printers: [{ id: 'prt-3', title: 'Patio Receipt', printerId: 'PRT-010', type: 'Star Cloud' }],
    devices: [{ id: 'dev-3', title: 'Patio Terminal', terminalId: 'TRM-021', type: 'Verifone P400' }],
    collections: [
      { id: 'col-wine-3', name: 'Wine Selection', productCount: 24, colorHex: '#6366F1', showImages: true, sortOrder: 1 },
      { id: 'col-small-plates', name: 'Small Plates', productCount: 9, colorHex: '#14B8A6', showImages: true, sortOrder: 2 },
    ],
    carryOutLocation: 'Vineyard Bellingham',
    shipLocation: 'Vintiga Labs, Inc',
    pickupLocation: 'Vineyard Bellingham',
    referenceId: 'c7-77c012',
  },
  {
    id: 'vintiga-tasting-room',
    name: 'Vintiga - Tasting Room',
    colorHex: '#6366F1',
    isDefault: false,
    salesAttribute: 'POS',
    operationalLocation: 'Vineyard Bellingham',
    tipsEnabled: true,
    tipType: 'percentage',
    tipOptions: ['15', '18', '20', '25'],
    displayOnEmv: false,
    employeePin: true,
    requirePinBeforePayment: true,
    requirePinAfterOrder: false,
    additionalOrderInfo: true,
    kitchenTickets: false,
    sendToKitchen: false,
    tableManagement: false,
    printers: [{ id: 'prt-4', title: 'Receipt Printer', printerId: 'PRT-004', type: 'Epson Cloud' }],
    devices: [{ id: 'dev-4', title: 'Bar Terminal', terminalId: 'TRM-004', type: 'Ingenico iCT250' }],
    collections: fullCollections.map((c) => ({ ...c, id: `${c.id}-tr` })),
    carryOutLocation: 'Vineyard Bellingham',
    shipLocation: 'Vintiga Labs, Inc',
    pickupLocation: 'Vineyard Bellingham',
    referenceId: 'c7-4521aa',
  },
  {
    id: 'vintiga-admin',
    name: 'Vintiga Admin',
    colorHex: '#6366F1',
    isDefault: false,
    salesAttribute: 'POS',
    operationalLocation: 'Vineyard Bellingham',
    tipsEnabled: false,
    tipType: 'percentage',
    tipOptions: ['15', '18', '20', '25'],
    displayOnEmv: false,
    employeePin: true,
    requirePinBeforePayment: true,
    requirePinAfterOrder: true,
    additionalOrderInfo: false,
    kitchenTickets: false,
    sendToKitchen: false,
    tableManagement: false,
    printers: [],
    devices: [],
    collections: [],
    carryOutLocation: 'Vineyard Bellingham',
    shipLocation: 'Vintiga Labs, Inc',
    pickupLocation: 'Vineyard Bellingham',
    referenceId: 'c7-9930fe',
  },
]

/** A blank profile for the Add flow (stand-alone stores only). */
export function blankProfile(): Profile {
  return {
    id: nextId('profile'),
    name: '',
    colorHex: '#6366F1',
    isDefault: false,
    salesAttribute: 'POS',
    operationalLocation: 'No Location',
    tipsEnabled: false,
    tipType: 'percentage',
    tipOptions: ['15', '18', '20', '25'],
    displayOnEmv: false,
    employeePin: false,
    requirePinBeforePayment: false,
    requirePinAfterOrder: false,
    additionalOrderInfo: false,
    kitchenTickets: false,
    sendToKitchen: false,
    tableManagement: false,
    printers: [],
    devices: [],
    collections: [],
    carryOutLocation: 'No Location',
    shipLocation: 'No Location',
    pickupLocation: 'No Location',
    referenceId: null,
  }
}
