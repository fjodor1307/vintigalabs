// ─── Sales Chat fixtures ─────────────────────────────────────────────────────
// Conversations + messages + templates for the WhatsApp Business–style inbox.
// `windowExpiresAt` is the moment the 24h customer-service window closes for
// that conversation. Fixed offsets from `now()` keep the demo stable across
// reloads — see the export below.

export type TemplateCategory = 'marketing' | 'utility' | 'authentication' | 'service'
export type MessageStatus    = 'sent' | 'delivered' | 'read'
export type MessageKind      = 'inbound' | 'outbound'

/**
 * Marketing consent mirrors WhatsApp's opt-in / opt-out model. Customers must
 * explicitly opt in before they can receive `marketing` category templates,
 * and replying `STOP` (or equivalent) opts them out. `pending` covers brand-
 * new contacts where we don't yet have a recorded preference — utility /
 * service / authentication templates are still allowed.
 */
export type MarketingConsent = 'opted-in' | 'opted-out' | 'pending'

/**
 * Templates can carry up to 3 buttons. Two real flavours:
 *   - `quick-reply` — a labelled tap that the customer can hit to send a
 *     short reply back without typing. We simulate this in the prototype by
 *     appending an inbound message with the button's label.
 *   - `cta` — a call-to-action that opens a URL or dials a phone number
 *     when the customer taps it. We just render the label + destination.
 */
export type TemplateButton =
  | { kind: 'quick-reply'; label: string }
  | { kind: 'cta'; label: string; action: 'url' | 'phone'; target: string }

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
  /** Outbound only — buttons carried over from the template. */
  buttons?: TemplateButton[]
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
  /** Marketing opt-in state. Gates `marketing` category templates. */
  marketingConsent: MarketingConsent
}

export interface ChatConversation {
  id: string
  customer: ChatCustomer
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

export interface MessageTemplate {
  id: string
  name: string
  category: TemplateCategory
  /** Human label shown in the picker. */
  language: string
  /** Body with `{{1}}`, `{{2}}` placeholders. */
  body: string
  /** Labels for each variable so the agent knows what to fill in. */
  variables: string[]
  /** Up to 3 buttons attached to the template (quick-reply or CTA). */
  buttons?: TemplateButton[]
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
  marketingConsent: 'opted-in',
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
  marketingConsent: 'opted-in',
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
  marketingConsent: 'opted-out',
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
  marketingConsent: 'pending',
}

// ─── Conversations ───────────────────────────────────────────────────────────

export const CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    customer: JANE,
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
    unread: 1,
    lastActivityMin: 60 * 26, // 26h — just past expiry
    windowRemainingMin: -120,
    messages: [
      { id: 'm-4-1', kind: 'inbound',  body: "Is the Founders Pack still available for new members?",                          atOffsetMin: 60 * 28 },
      { id: 'm-4-2', kind: 'outbound', body: "Hi Ethan! Yes — $129 for the intro 3-bottle set. Want me to send the join link?", atOffsetMin: 60 * 27, status: 'delivered', fromTemplate: 'founders_pack_intro', buttons: [
        { kind: 'cta',         label: 'Join now',     action: 'url', target: 'https://vintiga.example/join' },
        { kind: 'quick-reply', label: 'Tell me more' },
      ] },
      { id: 'm-4-3', kind: 'inbound',  body: "Yes please",                                                                     atOffsetMin: 60 * 26 },
    ],
  },
]

// ─── Templates ───────────────────────────────────────────────────────────────

export const TEMPLATES: MessageTemplate[] = [
  {
    id: 'order_shipped',
    name: 'Order shipped',
    category: 'utility',
    language: 'en_US',
    body: "Hi {{1}}! Your order {{2}} just shipped. Tracking: {{3}}. Expected delivery in 2–3 business days.",
    variables: ['Customer first name', 'Order number', 'Tracking number'],
    buttons: [
      { kind: 'cta', label: 'Track package', action: 'url', target: 'https://vintiga.example/track' },
    ],
  },
  {
    id: 'abandoned_cart',
    name: 'Abandoned cart reminder',
    category: 'marketing',
    language: 'en_US',
    body: "Hi {{1}}, you left {{2}} in your cart. We saved it for you — finish your order at {{3}} and use code WELCOME10 for 10% off.",
    variables: ['Customer first name', 'Product name', 'Checkout link'],
    buttons: [
      { kind: 'cta',         label: 'Complete order', action: 'url', target: 'https://vintiga.example/cart' },
      { kind: 'quick-reply', label: 'Not interested' },
    ],
  },
  {
    id: 'back_in_stock',
    name: 'Back in stock',
    category: 'marketing',
    language: 'en_US',
    body: "Good news {{1}} — {{2}} is back in stock. We have {{3}} left. Reply YES and we'll set one aside.",
    variables: ['Customer first name', 'Product name', 'Units in stock'],
    buttons: [
      { kind: 'quick-reply', label: 'Reserve one' },
      { kind: 'quick-reply', label: 'No thanks' },
    ],
  },
  {
    id: 'founders_pack_intro',
    name: 'Founders Pack intro',
    category: 'marketing',
    language: 'en_US',
    body: "Hi {{1}}! Welcome to Vintiga. The Founders Pack is {{2}} — three hand-picked bottles plus member pricing on future orders. Join here: {{3}}",
    variables: ['Customer first name', 'Pack price', 'Join link'],
    buttons: [
      { kind: 'cta',         label: 'Join now',     action: 'url', target: 'https://vintiga.example/join' },
      { kind: 'quick-reply', label: 'Tell me more' },
    ],
  },
  {
    id: 'reservation_confirm',
    name: 'Reservation confirmation',
    category: 'utility',
    language: 'en_US',
    body: "Hi {{1}}, you're confirmed for {{2}} on {{3}} at {{4}}. Reply STOP to cancel.",
    variables: ['Customer first name', 'Event name', 'Date', 'Time'],
    buttons: [
      { kind: 'quick-reply', label: 'Add to calendar' },
      { kind: 'quick-reply', label: 'Cancel' },
    ],
  },
  {
    id: 'service_followup',
    name: 'Customer service follow-up',
    category: 'service',
    language: 'en_US',
    body: "Hi {{1}}, just checking in on your recent question about {{2}}. Anything else I can help with?",
    variables: ['Customer first name', 'Topic'],
  },
  {
    id: 'optin_request',
    name: 'Marketing opt-in request',
    category: 'utility',
    language: 'en_US',
    body: "Hi {{1}}! Would you like to hear about new releases and member-only offers? Reply YES to opt in — you can opt out any time by replying STOP.",
    variables: ['Customer first name'],
    buttons: [
      { kind: 'quick-reply', label: 'Yes, opt me in' },
      { kind: 'quick-reply', label: 'No thanks' },
    ],
  },
]
