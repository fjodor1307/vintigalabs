// ─── Sales Chat (iMessage / Sendblue) fixtures ──────────────────────────────
// Conversations are modelled the way Sendblue's API thinks about them:
//   • Each message has a `channel` — iMessage / SMS / RCS — because a single
//     thread can transparently fall back when the recipient's phone can't
//     receive iMessage at that moment.
//   • Reactions are Apple "tapbacks" (heart / thumbs / haha / exclaim / question).
//   • Voice memos, photos, link previews, and shared contacts are first-class
//     message kinds — not text with a paperclip icon glued on.
//
// We drop the WhatsApp 24-hour customer-service window entirely — iMessage /
// SMS has no equivalent rule. Pricing throttling instead lives on the
// contact-cap quota Sendblue exposes per phone line.

export type ChatChannel = 'imessage' | 'sms' | 'rcs'
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
export type MessageKind   = 'inbound' | 'outbound'

/** Apple tapbacks. Same set Sendblue's API supports. */
export type Tapback = 'heart' | 'thumbs-up' | 'thumbs-down' | 'haha' | 'exclaim' | 'question'

export interface MessageReaction {
  by: 'agent' | 'customer'
  type: Tapback
}

interface MessageBase {
  id: string
  kind: MessageKind
  /** Channel this message went over — iMessage threads can mix in a stray SMS
   *  when the recipient briefly went off-Wi-Fi or out of iMessage range. */
  channel: ChatChannel
  /** Relative minutes from the conversation anchor (last activity). */
  atOffsetMin: number
  /** Outbound only. Inbound messages are always read by the time we render. */
  status?: MessageStatus
  /** Apple tapbacks attached to this message — usually 0 or 1. */
  reactions?: MessageReaction[]
  /** Outbound only — the agent picked a quick reply (not free-typed). */
  fromQuickReply?: string
  /** Outbound only — message came from the AI agent rather than a human. */
  fromAi?: boolean
}

export interface TextMessage    extends MessageBase { type: 'text';    body: string }
export interface ImageMessage   extends MessageBase { type: 'image';   src: string; caption?: string }
export interface VoiceMessage   extends MessageBase { type: 'voice';   durationSec: number }
export interface LinkMessage    extends MessageBase {
  type: 'link'
  url: string
  preview: { title: string; description?: string; thumbnail?: string; host: string }
}
export interface ContactMessage extends MessageBase {
  type: 'contact'
  contact: { name: string; phone?: string; email?: string; org?: string }
}

export type ChatMessage =
  | TextMessage
  | ImageMessage
  | VoiceMessage
  | LinkMessage
  | ContactMessage

// ─── Contacts ───────────────────────────────────────────────────────────────

export interface ChatContact {
  id: string
  name: string
  initials: string
  photoUrl?: string
  phone: string
  /** Whether this number is registered with iMessage right now. Drives the
   *  composer's channel pill: iMessage if true, green SMS-only fallback if
   *  false. Mirrors Sendblue's `evaluate_service` API. */
  iMessageCapable: boolean
  /** Lifetime spend, in dollars. */
  lifetimeSpend: number
  ordersCount: number
  segment: 'Member' | 'VIP' | 'New customer' | 'Returning'
  city: string
  /** Quick contextual tags surfaced on the right rail. */
  tags?: string[]
}

const DONNA: ChatContact = {
  id: 'cust-donna',
  name: 'Donna Ottoman',
  initials: 'DO',
  phone: '+1 250 555 0118',
  iMessageCapable: true,
  lifetimeSpend: 4820.5,
  ordersCount: 24,
  segment: 'VIP',
  city: 'Victoria, BC',
  tags: ['Founders Club', '2018 vintage fan'],
}

const MARCUS: ChatContact = {
  id: 'cust-marcus',
  name: 'Marcus Reed',
  initials: 'MR',
  phone: '+1 250 555 0142',
  // Android user — every outbound falls back to SMS (green bubble).
  iMessageCapable: false,
  lifetimeSpend: 612.5,
  ordersCount: 4,
  segment: 'Returning',
  city: 'Portland, OR',
  tags: ['Newsletter sub'],
}

const SOFIA: ChatContact = {
  id: 'cust-sofia',
  name: 'Sofía Reyes',
  initials: 'SR',
  phone: '+1 604 555 0145',
  iMessageCapable: true,
  lifetimeSpend: 940.0,
  ordersCount: 6,
  segment: 'Member',
  city: 'Seattle, WA',
  tags: ['Tasting Credit'],
}

const ETHAN: ChatContact = {
  id: 'cust-ethan',
  name: 'Ethan Walker',
  initials: 'EW',
  phone: '+1 778 555 0193',
  iMessageCapable: true,
  lifetimeSpend: 89.0,
  ordersCount: 1,
  segment: 'New customer',
  city: 'Vancouver, BC',
}

const LINDA: ChatContact = {
  id: 'cust-linda',
  name: 'Linda Harper',
  initials: 'LH',
  phone: '+1 250 555 0117',
  iMessageCapable: true,
  lifetimeSpend: 2150.0,
  ordersCount: 12,
  segment: 'Member',
  city: 'Sidney, BC',
  tags: ['Pickup preferred'],
}

const PRIYA: ChatContact = {
  id: 'cust-priya',
  name: 'Priya Iyer',
  initials: 'PI',
  phone: '+1 555 401 9912',
  iMessageCapable: true,
  lifetimeSpend: 1260.0,
  ordersCount: 9,
  segment: 'Member',
  city: 'Austin, TX',
}

// ─── Conversations ──────────────────────────────────────────────────────────

export interface ChatConversation {
  id: string
  contact: ChatContact
  /** Last channel used to message this contact — drives the inbox row's
   *  pill and the composer's default. Auto-flips on send when iMessage
   *  isn't available. */
  lastChannel: ChatChannel
  /** Unread inbound messages. */
  unread: number
  /** Minutes since the contact's last inbound — drives "X min ago". */
  lastActivityMin: number
  /** Is the customer currently typing? Renders the bouncing-dots bubble. */
  typing?: boolean
  /** AI agent on/off for this thread. Persists per conversation. */
  aiAgent: boolean
  /** Pinned to the top of the inbox. */
  pinned?: boolean
  /** Snoozed conversations drop out of the default inbox view. */
  snoozedUntil?: string
  messages: ChatMessage[]
}

export const CONVERSATIONS: ChatConversation[] = [
  // ── Donna — active iMessage thread, mix of media + reactions ──────────────
  {
    id: 'conv-donna',
    contact: DONNA,
    lastChannel: 'imessage',
    unread: 2,
    lastActivityMin: 4,
    typing: true,
    aiAgent: false,
    pinned: true,
    messages: [
      {
        id: 'm-d-1',
        kind: 'inbound',
        channel: 'imessage',
        type: 'text',
        body: 'Hey! Picked up the Reserve Pinot last week — absolutely loved it 🍷',
        atOffsetMin: 28,
      },
      {
        id: 'm-d-2',
        kind: 'outbound',
        channel: 'imessage',
        type: 'text',
        body: "So glad you enjoyed it, Donna! The '22 is drinking beautifully right now.",
        atOffsetMin: 26,
        status: 'read',
        reactions: [{ by: 'customer', type: 'heart' }],
      },
      {
        id: 'm-d-3',
        kind: 'inbound',
        channel: 'imessage',
        type: 'text',
        body: 'Any chance you have more of the 2018 reserve still in the cellar?',
        atOffsetMin: 20,
      },
      {
        id: 'm-d-4',
        kind: 'outbound',
        channel: 'imessage',
        type: 'text',
        body: "We have 6 bottles left — and I'd actually love to invite you to the cellar tasting on the 22nd. Reserve-only line-up.",
        atOffsetMin: 18,
        status: 'read',
      },
      {
        id: 'm-d-5',
        kind: 'outbound',
        channel: 'imessage',
        type: 'link',
        url: 'https://vintiga.com/events/cellar-tasting-jun-22',
        preview: {
          title: 'Cellar Tasting · June 22 — Reserve Line-Up',
          description: 'An intimate 8-person tasting with the winemaker. Pinot Noir Reserve verticals from 2014–2022.',
          host: 'vintiga.com',
          thumbnail: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=320&h=200&fit=crop&q=80',
        },
        atOffsetMin: 17,
        status: 'read',
      },
      {
        id: 'm-d-6',
        kind: 'inbound',
        channel: 'imessage',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=520&fit=crop&q=80',
        caption: 'My set-up tonight 😍',
        atOffsetMin: 10,
      },
      {
        id: 'm-d-7',
        kind: 'inbound',
        channel: 'imessage',
        type: 'text',
        body: "Yes please for the tasting! I'll bring my husband too — he's been asking about the 2014.",
        atOffsetMin: 6,
        reactions: [{ by: 'agent', type: 'thumbs-up' }],
      },
      {
        id: 'm-d-8',
        kind: 'inbound',
        channel: 'imessage',
        type: 'voice',
        durationSec: 9,
        atOffsetMin: 5,
      },
      {
        id: 'm-d-9',
        kind: 'inbound',
        channel: 'imessage',
        type: 'text',
        body: 'Quick one — can we add another guest? Sorry, last-minute',
        atOffsetMin: 4,
      },
    ],
  },

  // ── Marcus — SMS-only (Android phone), green bubbles end-to-end ───────────
  {
    id: 'conv-marcus',
    contact: MARCUS,
    lastChannel: 'sms',
    unread: 0,
    lastActivityMin: 38,
    aiAgent: true, // AI handling routine product questions for new contacts
    messages: [
      {
        id: 'm-m-1',
        kind: 'inbound',
        channel: 'sms',
        type: 'text',
        body: "Hi — saw the Founders Pack on your site. Does it ship to Oregon?",
        atOffsetMin: 60,
      },
      {
        id: 'm-m-2',
        kind: 'outbound',
        channel: 'sms',
        type: 'text',
        body: "Hi Marcus — yes, we ship the Founders Pack to Oregon. 2-day ground from Sidney, BC. $129 + $12 shipping.",
        atOffsetMin: 58,
        status: 'delivered',
        fromAi: true,
      },
      {
        id: 'm-m-3',
        kind: 'inbound',
        channel: 'sms',
        type: 'text',
        body: 'Perfect. Send me the link?',
        atOffsetMin: 42,
      },
      {
        id: 'm-m-4',
        kind: 'outbound',
        channel: 'sms',
        type: 'link',
        url: 'https://vintiga.com/founders-pack',
        preview: {
          title: 'Founders Pack — Vintiga',
          description: '3 hand-picked bottles + member pricing on future orders. $129 intro.',
          host: 'vintiga.com',
        },
        atOffsetMin: 41,
        status: 'delivered',
        fromAi: true,
      },
      {
        id: 'm-m-5',
        kind: 'inbound',
        channel: 'sms',
        type: 'text',
        body: 'Thanks 🙏',
        atOffsetMin: 38,
      },
    ],
  },

  // ── Sofia — recent iMessage exchange, contact card shared ─────────────────
  {
    id: 'conv-sofia',
    contact: SOFIA,
    lastChannel: 'imessage',
    unread: 1,
    lastActivityMin: 12,
    aiAgent: false,
    messages: [
      {
        id: 'm-s-1',
        kind: 'inbound',
        channel: 'imessage',
        type: 'text',
        body: 'My friend Maya is in town next week — can she pick up my June allocation for me?',
        atOffsetMin: 22,
      },
      {
        id: 'm-s-2',
        kind: 'outbound',
        channel: 'imessage',
        type: 'text',
        body: "Absolutely — send me her name and phone and I'll add her as an authorised pickup.",
        atOffsetMin: 20,
        status: 'read',
      },
      {
        id: 'm-s-3',
        kind: 'inbound',
        channel: 'imessage',
        type: 'contact',
        contact: {
          name: 'Maya Chen',
          phone: '+1 604 555 0167',
          email: 'maya.chen@example.com',
        },
        atOffsetMin: 12,
      },
    ],
  },

  // ── Ethan — quick exchange, brand-new lead ────────────────────────────────
  {
    id: 'conv-ethan',
    contact: ETHAN,
    lastChannel: 'imessage',
    unread: 0,
    lastActivityMin: 60 * 2 + 5,
    aiAgent: false,
    messages: [
      {
        id: 'm-e-1',
        kind: 'inbound',
        channel: 'imessage',
        type: 'text',
        body: 'Hey — is the cellar tour bookable on weekends?',
        atOffsetMin: 60 * 3,
      },
      {
        id: 'm-e-2',
        kind: 'outbound',
        channel: 'imessage',
        type: 'text',
        body: 'Yes! Saturdays at 11am and 2pm. Want me to send the booking link?',
        atOffsetMin: 60 * 2 + 50,
        status: 'read',
      },
      {
        id: 'm-e-3',
        kind: 'inbound',
        channel: 'imessage',
        type: 'text',
        body: 'Please, for the 11am if 2 spots are open',
        atOffsetMin: 60 * 2 + 10,
        reactions: [{ by: 'agent', type: 'thumbs-up' }],
      },
      {
        id: 'm-e-4',
        kind: 'outbound',
        channel: 'imessage',
        type: 'text',
        body: "Two spots reserved for Saturday 11am — I'll text the confirmation in a sec.",
        atOffsetMin: 60 * 2 + 5,
        status: 'read',
      },
    ],
  },

  // ── Linda — pickup reminder, voice note from agent ────────────────────────
  {
    id: 'conv-linda',
    contact: LINDA,
    lastChannel: 'imessage',
    unread: 0,
    lastActivityMin: 60 * 5,
    aiAgent: false,
    messages: [
      {
        id: 'm-l-1',
        kind: 'outbound',
        channel: 'imessage',
        type: 'text',
        body: "Hi Linda — your Q2 club allocation is ready for pickup at the tasting room whenever you're in town.",
        atOffsetMin: 60 * 6,
        status: 'read',
        fromQuickReply: 'club-pickup-ready',
      },
      {
        id: 'm-l-2',
        kind: 'inbound',
        channel: 'imessage',
        type: 'text',
        body: 'Lovely! Will swing by Saturday morning.',
        atOffsetMin: 60 * 5,
        reactions: [{ by: 'agent', type: 'thumbs-up' }],
      },
    ],
  },

  // ── Priya — older thread, mostly archived ─────────────────────────────────
  {
    id: 'conv-priya',
    contact: PRIYA,
    lastChannel: 'imessage',
    unread: 0,
    lastActivityMin: 60 * 36,
    aiAgent: false,
    messages: [
      {
        id: 'm-p-1',
        kind: 'inbound',
        channel: 'imessage',
        type: 'text',
        body: 'Can I switch my June shipment to whites only?',
        atOffsetMin: 60 * 38,
      },
      {
        id: 'm-p-2',
        kind: 'outbound',
        channel: 'imessage',
        type: 'text',
        body: "Done — you're booked into the all-whites pack for June.",
        atOffsetMin: 60 * 37,
        status: 'read',
        reactions: [{ by: 'customer', type: 'heart' }],
      },
      {
        id: 'm-p-3',
        kind: 'inbound',
        channel: 'imessage',
        type: 'text',
        body: 'Thanks!',
        atOffsetMin: 60 * 36,
      },
    ],
  },
]

// ─── Quick replies (Sendblue-style snippets, no template variables) ────────

export type QuickReplyCategory = 'greeting' | 'sales' | 'service' | 'club' | 'compliance'

export interface QuickReply {
  id: string
  category: QuickReplyCategory
  name: string
  body: string
}

export const QUICK_REPLIES: QuickReply[] = [
  // Greeting
  { id: 'hello',         category: 'greeting',  name: 'Friendly intro',        body: "Hi! Thanks for reaching out 👋 How can I help today?" },
  { id: 'thanks',        category: 'greeting',  name: 'Thanks',                body: "Thanks so much — appreciate you!" },

  // Sales
  { id: 'in-stock',      category: 'sales',     name: 'Bottle in stock',       body: "Yes, we still have it in stock. Want me to set one aside?" },
  { id: 'club-pricing',  category: 'sales',     name: 'Club pricing',          body: "Club members get 15% off this bottle. Worth joining if you're picking up a case!" },
  { id: 'pairing',       category: 'sales',     name: 'Pairing suggestion',    body: "It pairs really well with grilled lamb or aged cheddar — happy to suggest more if you'd like." },

  // Club / service
  { id: 'club-pickup-ready', category: 'club',  name: 'Club pickup ready',     body: "Your club allocation is ready for pickup at the tasting room whenever you're in town." },
  { id: 'club-switch',   category: 'club',      name: 'Allocation switch',     body: "Sure — I can switch your next allocation. Want all reds, all whites, or the regular mixed pack?" },
  { id: 'shipping-eta',  category: 'service',   name: 'Shipping ETA',          body: "Your order shipped ground from Sidney, BC — usually 2 business days. I'll send tracking shortly." },

  // Compliance — Sendblue handles SMS opt-out at the carrier level, but
  // wineries still need this one occasionally for over-21 confirmation.
  { id: 'age-verify',    category: 'compliance', name: 'Age verification',     body: "Quick check — can you confirm you're over 21 before we chat about anything alcohol-related? Reply YES to continue." },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

export function tapbackEmoji(t: Tapback): string {
  switch (t) {
    case 'heart':        return '❤️'
    case 'thumbs-up':    return '👍'
    case 'thumbs-down':  return '👎'
    case 'haha':         return '😂'
    case 'exclaim':      return '‼️'
    case 'question':     return '❓'
  }
}

export function channelLabel(ch: ChatChannel): string {
  if (ch === 'imessage') return 'iMessage'
  if (ch === 'rcs')      return 'RCS'
  return 'SMS'
}

/** Pick the channel a brand-new message should use given the contact's
 *  current iMessage status. Sendblue's `evaluate_service` returns this. */
export function preferredChannel(contact: ChatContact): ChatChannel {
  return contact.iMessageCapable ? 'imessage' : 'sms'
}
