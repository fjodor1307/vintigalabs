import { useSyncExternalStore } from 'react'
import { CUSTOMER, type Customer, type CustomerNote, type NoteKind } from './customerSample'

// ─── customerStore ───────────────────────────────────────────────────────────
// Tiny in-memory store for the Customer detail flow. Holds the current
// customer profile (editable through the "Update Customer" modal) and the
// notes list (editable through the Add Note / Update Note modals on the
// right rail).
//
// Pattern matches `clubStore.ts` / `productStore.ts` — module-level state
// + `useSyncExternalStore` for components.

export interface CustomerProfile {
  /** Salutation: 'mr' | 'mrs' | 'ms' | 'mx' | '' */
  salutation: string
  firstName: string
  lastName: string
  email: string
  emailPreferred: boolean
  phone: string
  /** Date of birth — stored as separate parts to match the Figma form. */
  dobMonth: string
  dobDay: string
  dobYear: string
  country: string
  address: string
  address2: string
  company: string
  zipCode: string
  city: string
  state: string
  /** Marketing opt-in. */
  emailMarketing: 'subscribed' | 'not-subscribed' | null
}

// ─── Account Balance / Loyalty Points ledger ─────────────────────────────────

/** Who initiated the adjustment. Drives the "Source" column on Billing. */
export type LedgerSource = 'user' | 'integration' | 'vintiga'

export interface LedgerEntry {
  id: string
  /** ISO date string — formatted at display time. */
  timestamp: string
  source: LedgerSource
  /** Display name of the actor — staff member, 3rd party integration name, or "Vintiga". */
  sourceName: string
  /** Optional staff member ID — only meaningful when `source === 'user'`. */
  sourceUserId?: string
  /** Order this credit/debit was used to settle, if any. */
  orderNumber?: string
  /** Free-text description of why the adjustment happened. */
  description?: string
  /** Signed amount. Positive = credit, negative = debit. Currency for balance, integer for points. */
  amount: number
}

// ─── Payment Methods + Addresses ─────────────────────────────────────────────

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover'

export interface PaymentMethod {
  id: string
  brand: CardBrand
  last4: string
  expiresMonth: string
  expiresYear: string
  isDefault: boolean
}

export interface Address {
  id: string
  /** Friendly label ("Home", "Work", or "Address 1") */
  label: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  email?: string
}

interface State {
  profile: CustomerProfile
  notes: CustomerNote[]
  /** Account balance in dollars (signed). */
  accountBalance: number
  /** Loyalty points (signed integer). */
  loyaltyPoints: number
  balanceLedger: LedgerEntry[]
  pointsLedger: LedgerEntry[]
  paymentMethods: PaymentMethod[]
  addresses: Address[]
}

function nameParts(name: string): { firstName: string; lastName: string } {
  const trimmed = name.trim()
  if (!trimmed) return { firstName: '', lastName: '' }
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function locationParts(location: string): { city: string; state: string; zip: string } {
  const m = location.match(/^([^,]+),\s*([A-Z]{2}),?\s*(\d{4,5})?$/)
  if (!m) return { city: '', state: '', zip: '' }
  return { city: m[1].trim(), state: m[2], zip: m[3] ?? '' }
}

function initialProfile(c: Customer): CustomerProfile {
  const { firstName, lastName } = nameParts(c.name)
  const { city, state, zip } = locationParts(c.location)
  return {
    salutation: '',
    firstName,
    lastName,
    email: c.email,
    emailPreferred: c.emailPreferred,
    phone: '',
    dobMonth: '',
    dobDay: '',
    dobYear: '',
    country: 'United States',
    address: '',
    address2: '',
    company: '',
    zipCode: zip,
    city,
    state,
    emailMarketing: 'subscribed',
  }
}

// Seed ledgers — gives the Billing tab something to render on first load.
const SEED_BALANCE_LEDGER: LedgerEntry[] = [
  {
    id: 'bal-1',
    timestamp: '2026-04-28T09:01:00',
    source: 'integration',
    sourceName: 'Commerce7',
    description: 'Sync from C7 ledger',
    amount: 184.82,
  },
  {
    id: 'bal-2',
    timestamp: '2026-03-02T15:45:00',
    source: 'user',
    sourceName: 'Tom Cook',
    sourceUserId: 'STAFF-104',
    description: 'Goodwill credit — shipping delay',
    amount: 25.00,
  },
  {
    id: 'bal-3',
    timestamp: '2026-05-04T14:14:00',
    source: 'vintiga',
    sourceName: 'Vintiga',
    orderNumber: '#124444',
    description: 'Used to pay shipping',
    amount: -52.87,
  },
  {
    id: 'bal-4',
    timestamp: '2025-09-10T16:36:00',
    source: 'user',
    sourceName: 'Donna Ataman',
    sourceUserId: 'STAFF-088',
    description: 'Manual adjustment',
    amount: 50.00,
  },
]

const SEED_POINTS_LEDGER: LedgerEntry[] = [
  {
    id: 'pts-1',
    timestamp: '2026-05-04T14:14:00',
    source: 'vintiga',
    sourceName: 'Vintiga',
    orderNumber: '#124444',
    description: 'Earned on order',
    amount: 250,
  },
  {
    id: 'pts-2',
    timestamp: '2026-04-28T09:01:00',
    source: 'integration',
    sourceName: 'Commerce7',
    description: 'Tier upgrade bonus',
    amount: 500,
  },
  {
    id: 'pts-3',
    timestamp: '2026-02-14T11:00:00',
    source: 'user',
    sourceName: 'Tom Cook',
    sourceUserId: 'STAFF-104',
    description: 'Birthday bonus',
    amount: 100,
  },
]

function sumAmounts(entries: LedgerEntry[]): number {
  return entries.reduce((acc, e) => acc + e.amount, 0)
}

const SEED_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm-1', brand: 'mastercard', last4: '0092', expiresMonth: '07', expiresYear: '27', isDefault: true },
  { id: 'pm-2', brand: 'mastercard', last4: '0044', expiresMonth: '08', expiresYear: '28', isDefault: false },
]

const SEED_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Address 1',
    street: '1210 Lakeview Street',
    city: 'Bellingham',
    state: 'Washington',
    zip: '98229',
    country: 'United States',
    phone: '(555) 123-4567',
    email: 'janedavis@gmail.com',
  },
  {
    id: 'addr-2',
    label: 'Address 2',
    street: '1210 Lakeview Street',
    city: 'Bellingham',
    state: 'Washington',
    zip: '98229',
    country: 'United States',
    phone: '(555) 123-4567',
    email: 'janedavis@gmail.com',
  },
]

let state: State = {
  profile: initialProfile(CUSTOMER),
  notes: CUSTOMER.notes.slice(),
  accountBalance: sumAmounts(SEED_BALANCE_LEDGER),
  loyaltyPoints: sumAmounts(SEED_POINTS_LEDGER),
  balanceLedger: SEED_BALANCE_LEDGER.slice(),
  pointsLedger: SEED_POINTS_LEDGER.slice(),
  paymentMethods: SEED_PAYMENT_METHODS.slice(),
  addresses: SEED_ADDRESSES.slice(),
}

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useCustomerProfile(): CustomerProfile {
  return useSyncExternalStore(subscribe, () => state.profile, () => state.profile)
}

export function useCustomerNotes(): CustomerNote[] {
  return useSyncExternalStore(subscribe, () => state.notes, () => state.notes)
}

export function useAccountBalance(): number {
  return useSyncExternalStore(subscribe, () => state.accountBalance, () => state.accountBalance)
}

export function useLoyaltyPoints(): number {
  return useSyncExternalStore(subscribe, () => state.loyaltyPoints, () => state.loyaltyPoints)
}

export function useBalanceLedger(): LedgerEntry[] {
  return useSyncExternalStore(subscribe, () => state.balanceLedger, () => state.balanceLedger)
}

export function usePointsLedger(): LedgerEntry[] {
  return useSyncExternalStore(subscribe, () => state.pointsLedger, () => state.pointsLedger)
}

export function usePaymentMethods(): PaymentMethod[] {
  return useSyncExternalStore(subscribe, () => state.paymentMethods, () => state.paymentMethods)
}

export function useAddresses(): Address[] {
  return useSyncExternalStore(subscribe, () => state.addresses, () => state.addresses)
}

/** Display name derived from `firstName` + `lastName` — falls back to "Customer". */
export function useCustomerDisplayName(): string {
  const p = useCustomerProfile()
  const full = `${p.firstName} ${p.lastName}`.trim()
  return full || 'Customer'
}

// ─── Actions ──────────────────────────────────────────────────────────────────

let noteSeq    = state.notes.length
let balanceSeq = state.balanceLedger.length
let pointsSeq  = state.pointsLedger.length
let pmSeq      = state.paymentMethods.length
let addrSeq    = state.addresses.length

function nowFormatted(): string {
  const d = new Date()
  const date = d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return `${date} at ${time}`
}

export const customerActions = {
  updateProfile(patch: Partial<CustomerProfile>) {
    state = { ...state, profile: { ...state.profile, ...patch } }
    emit()
  },
  addNote({ kind, body }: { kind: NoteKind; body: string }) {
    const id = `n${++noteSeq}`
    const next: CustomerNote = {
      id,
      kind,
      title: body.split('\n')[0].slice(0, 80) || 'New note',
      body,
      author: 'Tom Cook',
      createdAt: nowFormatted(),
    }
    state = { ...state, notes: [next, ...state.notes] }
    emit()
  },
  updateNote(id: string, patch: { kind?: NoteKind; body?: string }) {
    state = {
      ...state,
      notes: state.notes.map((n) =>
        n.id === id
          ? {
              ...n,
              ...(patch.kind ? { kind: patch.kind } : {}),
              ...(patch.body
                ? {
                    body: patch.body,
                    title: patch.body.split('\n')[0].slice(0, 80) || n.title,
                  }
                : {}),
            }
          : n,
      ),
    }
    emit()
  },
  deleteNote(id: string) {
    state = { ...state, notes: state.notes.filter((n) => n.id !== id) }
    emit()
  },
  /** Append a new entry to the account balance ledger and update the running balance. */
  adjustBalance(entry: Omit<LedgerEntry, 'id' | 'timestamp'> & { timestamp?: string }) {
    const id = `bal-${++balanceSeq}`
    const next: LedgerEntry = {
      ...entry,
      id,
      timestamp: entry.timestamp ?? new Date().toISOString(),
    }
    const ledger = [next, ...state.balanceLedger]
    state = { ...state, balanceLedger: ledger, accountBalance: sumAmounts(ledger) }
    emit()
  },
  /** Append a new entry to the loyalty points ledger and update the running balance. */
  adjustPoints(entry: Omit<LedgerEntry, 'id' | 'timestamp'> & { timestamp?: string }) {
    const id = `pts-${++pointsSeq}`
    const next: LedgerEntry = {
      ...entry,
      id,
      timestamp: entry.timestamp ?? new Date().toISOString(),
    }
    const ledger = [next, ...state.pointsLedger]
    state = { ...state, pointsLedger: ledger, loyaltyPoints: sumAmounts(ledger) }
    emit()
  },
  addPaymentMethod(pm: Omit<PaymentMethod, 'id'>) {
    const id = `pm-${++pmSeq}`
    let methods = [...state.paymentMethods, { ...pm, id }]
    // Enforce single-default invariant.
    if (pm.isDefault) methods = methods.map((m) => ({ ...m, isDefault: m.id === id }))
    state = { ...state, paymentMethods: methods }
    emit()
  },
  setDefaultPaymentMethod(id: string) {
    state = {
      ...state,
      paymentMethods: state.paymentMethods.map((m) => ({ ...m, isDefault: m.id === id })),
    }
    emit()
  },
  deletePaymentMethod(id: string) {
    state = { ...state, paymentMethods: state.paymentMethods.filter((m) => m.id !== id) }
    emit()
  },
  addAddress(addr: Omit<Address, 'id'>) {
    const id = `addr-${++addrSeq}`
    state = { ...state, addresses: [...state.addresses, { ...addr, id }] }
    emit()
  },
  updateAddress(id: string, patch: Partial<Address>) {
    state = {
      ...state,
      addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }
    emit()
  },
  deleteAddress(id: string) {
    state = { ...state, addresses: state.addresses.filter((a) => a.id !== id) }
    emit()
  },
}
