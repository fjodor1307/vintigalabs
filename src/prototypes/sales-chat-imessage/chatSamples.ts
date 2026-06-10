// ─── Sales Chat fixtures ─────────────────────────────────────────────────────
// Conversations + messages + templates for the WhatsApp Business–style inbox.
// `windowExpiresAt` is the moment the 24h customer-service window closes for
// that conversation. Fixed offsets from `now()` keep the demo stable across
// reloads — see the export below.

export type TemplateCategory = 'marketing' | 'utility' | 'authentication' | 'service' | 'compliance'
export type MessageStatus    = 'sent' | 'delivered' | 'read'
export type MessageKind      = 'inbound' | 'outbound'

/**
 * Where the conversation originated.
 *
 * - `whatsapp` — direct customer chat over WhatsApp Business (legacy default).
 * - `website` — anonymous visitor using the chat widget embedded on the
 *   marketing site.
 * - `members` — wine-club member messaging through the My Account page.
 */
export type ChatSource = 'whatsapp' | 'website' | 'members'

/**
 * Which field on the active conversation's customer pre-fills a template
 * variable. Templates flag each variable with one of these keys (or
 * `undefined` for "operator types it in"); the picker reads from the
 * selected conversation's customer record and seeds the input.
 */
export type CustomerVarKey =
  | 'firstName'
  | 'fullName'
  | 'city'
  | 'phone'
  | 'segment'

export interface ChatMessage {
  id: string
  kind: MessageKind
  body: string
  /** Relative minutes offset from the conversation's "anchor" (last activity). */
  atOffsetMin: number
  /** Outbound only — delivery state. */
  status?: MessageStatus
  /** Outbound only — flagged when the message came from a template (not free-form). */
  fromTemplate?: string
}

export interface ChatCustomer {
  id: string
  name: string
  initials: string
  phone: string
  segment: 'Member' | 'VIP' | 'New customer' | 'Returning'
  city: string
  lifetimeSpend: number
  ordersCount: number
}

export interface ChatConversation {
  id: string
  customer: ChatCustomer
  /** Channel this conversation came in on — drives the inbox filter tabs. */
  source: ChatSource
  unread: number
  /** Minutes since the customer's last inbound — drives the "X min ago" label. */
  lastActivityMin: number
  /**
   * Minutes until the 24h service window closes. Positive = still inside; 0 or
   * negative = expired and only templates can be sent.
   */
  windowRemainingMin: number
  messages: ChatMessage[]
}

export interface TemplateVariable {
  /** Human-readable label rendered above the input. */
  label: string
  /**
   * Auto-fill source from the active conversation's customer. Undefined =
   * operator types it. The picker uses this on open to seed the input.
   */
  fillFrom?: CustomerVarKey
}

export interface MessageTemplate {
  id: string
  name: string
  category: TemplateCategory
  /** Human label shown in the picker. */
  language: string
  /** Body with `{{1}}`, `{{2}}` placeholders. */
  body: string
  /** Per-variable metadata — order matches `{{1}}`, `{{2}}`, … */
  variables: TemplateVariable[]
}

/**
 * Resolve a customer-var key to a concrete string for the active customer.
 * Returns empty string when the field isn't available — the picker then
 * leaves the input blank so the operator can fill it in.
 */
export function readCustomerVar(customer: ChatCustomer, key: CustomerVarKey): string {
  switch (key) {
    case 'firstName': return customer.name.split(' ')[0] ?? ''
    case 'fullName':  return customer.name
    case 'city':      return customer.city
    case 'phone':     return customer.phone
    case 'segment':   return customer.segment
  }
}

// ─── Customers ───────────────────────────────────────────────────────────────

const JANE: ChatCustomer = {
  id: 'cust-1',
  name: 'Jane Davis',
  initials: 'JD',
  phone: '+1 (555) 123-4567',
  segment: 'Member',
  city: 'Bellingham, WA',
  lifetimeSpend: 1240.5,
  ordersCount: 8,
}

const MARCUS: ChatCustomer = {
  id: 'cust-2',
  name: 'Marcus Allen',
  initials: 'MA',
  phone: '+1 (555) 904-1180',
  segment: 'VIP',
  city: 'Portland, OR',
  lifetimeSpend: 3820.0,
  ordersCount: 22,
}

const SOFIA: ChatCustomer = {
  id: 'cust-3',
  name: 'Sofía Reyes',
  initials: 'SR',
  phone: '+1 (555) 220-7714',
  segment: 'Returning',
  city: 'Seattle, WA',
  lifetimeSpend: 612.75,
  ordersCount: 4,
}

const ETHAN: ChatCustomer = {
  id: 'cust-4',
  name: 'Ethan Walker',
  initials: 'EW',
  phone: '+1 (555) 661-3309',
  segment: 'New customer',
  city: 'Vancouver, BC',
  lifetimeSpend: 89.0,
  ordersCount: 1,
}

// Anonymous website visitor — chat widget threads can land before the
// visitor identifies themselves, so phone is blank and segment defaults
// to "New customer".
const ANON_VISITOR: ChatCustomer = {
  id: 'cust-anon-1',
  name: 'Website visitor',
  initials: 'WV',
  phone: '',
  segment: 'New customer',
  city: 'Unknown',
  lifetimeSpend: 0,
  ordersCount: 0,
}

const PRIYA: ChatCustomer = {
  id: 'cust-5',
  name: 'Priya Iyer',
  initials: 'PI',
  phone: '+1 (555) 401-9912',
  segment: 'Member',
  city: 'Austin, TX',
  lifetimeSpend: 940.0,
  ordersCount: 6,
}

// ─── Conversations ───────────────────────────────────────────────────────────

export const CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    customer: JANE,
    source: 'whatsapp',
    unread: 2,
    lastActivityMin: 7,
    windowRemainingMin: 23 * 60 + 53, // ~23h 53m — fresh window
    messages: [
      { id: 'm-1-1', kind: 'inbound',  body: "Hi! I saw the new Reserva Cabernet on your site — is the 2018 still in stock?", atOffsetMin: 22 },
      { id: 'm-1-2', kind: 'outbound', body: "Hi Jane! Yes — we have 14 bottles of the 2018 left at $48 each. Want me to set one aside?", atOffsetMin: 18, status: 'read' },
      { id: 'm-1-3', kind: 'inbound',  body: "Yes please. Actually — can I get two?", atOffsetMin: 14 },
      { id: 'm-1-4', kind: 'outbound', body: "Done. I've reserved 2 bottles under your account. Pick up or ship?", atOffsetMin: 12, status: 'read' },
      { id: 'm-1-5', kind: 'inbound',  body: "Ship to my Bellingham address please 🙂", atOffsetMin: 9 },
      { id: 'm-1-6', kind: 'inbound',  body: "Also — does it go well with lamb?", atOffsetMin: 7 },
    ],
  },
  {
    id: 'conv-2',
    customer: MARCUS,
    source: 'whatsapp',
    unread: 0,
    lastActivityMin: 60 * 3 + 12,
    windowRemainingMin: 35, // ~35 min left — almost expired
    messages: [
      { id: 'm-2-1', kind: 'inbound',  body: "Saw the Founder's Club invite — can I bring a +1 to the May tasting?",       atOffsetMin: 60 * 5 },
      { id: 'm-2-2', kind: 'outbound', body: "Of course, Marcus. Adding you + 1 to the list for May 22, 6:30pm.",            atOffsetMin: 60 * 4 + 50, status: 'read' },
      { id: 'm-2-3', kind: 'outbound', body: "Anything special you'd like us to pour? We can pull a magnum if you like.",   atOffsetMin: 60 * 4 + 40, status: 'read' },
      { id: 'm-2-4', kind: 'inbound',  body: "Surprise me. And thanks for sorting the shipping last week 🙏",                atOffsetMin: 60 * 3 + 12 },
    ],
  },
  {
    id: 'conv-3',
    customer: SOFIA,
    source: 'whatsapp',
    unread: 0,
    lastActivityMin: 60 * 30, // 30h ago
    windowRemainingMin: -360, // 6h past expiry
    messages: [
      { id: 'm-3-1', kind: 'inbound',  body: "Hey! My order #ORD-5102 — did it ship?",                                         atOffsetMin: 60 * 32 },
      { id: 'm-3-2', kind: 'outbound', body: "Hi Sofía! It went out yesterday. Tracking: 1Z-VTG-99041. Should arrive Tuesday.", atOffsetMin: 60 * 31 + 40, status: 'read' },
      { id: 'm-3-3', kind: 'inbound',  body: "Perfect, thank you!",                                                            atOffsetMin: 60 * 30 },
    ],
  },
  {
    id: 'conv-4',
    customer: ETHAN,
    source: 'whatsapp',
    unread: 1,
    lastActivityMin: 60 * 26, // 26h — just past expiry
    windowRemainingMin: -120,
    messages: [
      { id: 'm-4-1', kind: 'inbound',  body: "Is the Founders Pack still available for new members?",                          atOffsetMin: 60 * 28 },
      { id: 'm-4-2', kind: 'outbound', body: "Hi Ethan! Yes — $129 for the intro 3-bottle set. Want me to send the join link?", atOffsetMin: 60 * 27, status: 'delivered', fromTemplate: 'founders_pack_intro' },
      { id: 'm-4-3', kind: 'inbound',  body: "Yes please",                                                                     atOffsetMin: 60 * 26 },
    ],
  },
  // ── Website channel: anonymous chat-widget visitor ──────────────────────────
  {
    id: 'conv-5',
    customer: ANON_VISITOR,
    source: 'website',
    unread: 3,
    lastActivityMin: 4,
    windowRemainingMin: 23 * 60 + 30,
    messages: [
      { id: 'm-5-1', kind: 'inbound', body: "Hey, the site says the Founders Pack ships free over $100 — does that include Texas?", atOffsetMin: 10 },
      { id: 'm-5-2', kind: 'inbound', body: "Also wondering if you ship to PO boxes",                                                atOffsetMin: 7 },
      { id: 'm-5-3', kind: 'inbound', body: "Sorry one more — do you do gift wrap?",                                                atOffsetMin: 4 },
    ],
  },
  // ── Members channel: club member messaging from My Account ──────────────────
  {
    id: 'conv-6',
    customer: PRIYA,
    source: 'members',
    unread: 1,
    lastActivityMin: 38,
    windowRemainingMin: 23 * 60 + 18,
    messages: [
      { id: 'm-6-1', kind: 'inbound',  body: "Hi! Can I switch my June shipment to the white-only allocation?",            atOffsetMin: 90 },
      { id: 'm-6-2', kind: 'outbound', body: "Hi Priya — yes, no problem. Switching you to the all-whites pack for June.", atOffsetMin: 75, status: 'read' },
      { id: 'm-6-3', kind: 'inbound',  body: "Amazing, thank you. Also: when does the August allocation go out?",          atOffsetMin: 38 },
    ],
  },
]

// ─── Templates ───────────────────────────────────────────────────────────────

export const TEMPLATES: MessageTemplate[] = [
  // ── Compliance ───────────────────────────────────────────────────────────────
  // Age verification has to fire before anything alcohol-related on a brand-new
  // thread (US wine compliance). Pinned to the top of the picker.
  {
    id: 'age_verification',
    name: 'Age verification',
    category: 'compliance',
    language: 'en_US',
    body: "Hi {{1}}, before we chat about anything alcohol-related — can you confirm you're over 21? Reply YES to continue.",
    variables: [
      { label: 'Customer first name', fillFrom: 'firstName' },
    ],
  },
  // ── Utility ──────────────────────────────────────────────────────────────────
  {
    id: 'order_shipped',
    name: 'Order shipped',
    category: 'utility',
    language: 'en_US',
    body: "Hi {{1}}! Your order {{2}} just shipped. Tracking: {{3}}. Expected delivery in 2–3 business days.",
    variables: [
      { label: 'Customer first name', fillFrom: 'firstName' },
      { label: 'Order number' },
      { label: 'Tracking number' },
    ],
  },
  {
    id: 'reservation_confirm',
    name: 'Reservation confirmation',
    category: 'utility',
    language: 'en_US',
    body: "Hi {{1}}, you're confirmed for {{2}} on {{3}} at {{4}}. Reply STOP to cancel.",
    variables: [
      { label: 'Customer first name', fillFrom: 'firstName' },
      { label: 'Event name' },
      { label: 'Date' },
      { label: 'Time' },
    ],
  },
  // ── Marketing ────────────────────────────────────────────────────────────────
  {
    id: 'abandoned_cart',
    name: 'Abandoned cart reminder',
    category: 'marketing',
    language: 'en_US',
    body: "Hi {{1}}, you left {{2}} in your cart. We saved it for you — finish your order at {{3}} and use code WELCOME10 for 10% off.",
    variables: [
      { label: 'Customer first name', fillFrom: 'firstName' },
      { label: 'Product name' },
      { label: 'Checkout link' },
    ],
  },
  {
    id: 'back_in_stock',
    name: 'Back in stock',
    category: 'marketing',
    language: 'en_US',
    body: "Good news {{1}} — {{2}} is back in stock. We have {{3}} left. Reply YES and we'll set one aside.",
    variables: [
      { label: 'Customer first name', fillFrom: 'firstName' },
      { label: 'Product name' },
      { label: 'Units in stock' },
    ],
  },
  {
    id: 'founders_pack_intro',
    name: 'Founders Pack intro',
    category: 'marketing',
    language: 'en_US',
    body: "Hi {{1}}! Welcome to Vintiga. The Founders Pack is {{2}} — three hand-picked bottles plus member pricing on future orders. Join here: {{3}}",
    variables: [
      { label: 'Customer first name', fillFrom: 'firstName' },
      { label: 'Pack price' },
      { label: 'Join link' },
    ],
  },
  // ── Service ──────────────────────────────────────────────────────────────────
  {
    id: 'service_followup',
    name: 'Customer service follow-up',
    category: 'service',
    language: 'en_US',
    body: "Hi {{1}}, just checking in on your recent question about {{2}}. Anything else I can help with?",
    variables: [
      { label: 'Customer first name', fillFrom: 'firstName' },
      { label: 'Topic' },
    ],
  },
]
