import { useEffect, useMemo, useRef, useState } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { Avatar } from '@ds/shared/Avatar'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Tag } from '@ds/shared/Tag'
import { TextField } from '@ds/shared/TextField'
import {
  SearchIcon,
  SendIcon,
  PaperclipIcon,
  SmileIcon,
  MicIcon,
  CheckIcon,
  CheckCheckIcon,
  PhoneIcon,
  LayersIcon,
  LockIcon,
  ClockIcon,
  ShoppingCartIcon,
  CreditCardIcon,
} from '@ds/icons/Icons'
import {
  CONVERSATIONS,
  type ChatConversation,
  type ChatMessage,
  type MarketingConsent,
  type TemplateButton,
} from './chatSamples'
import { TemplatePicker } from './TemplatePicker'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtAgo(min: number): string {
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function fmtWindow(min: number): string {
  if (min <= 0) return 'Session expired'
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}m left`
  return `${h}h ${m}m left`
}

function fmtTime(offsetMin: number): string {
  if (offsetMin < 60) return `${offsetMin}m ago`
  const h = Math.floor(offsetMin / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

// ─── Consent badge ───────────────────────────────────────────────────────────
// Tiny chip we drop into the rail / thread header to surface the customer's
// marketing opt-in state. Tone tracks the WhatsApp-side rule: opted-in is
// fine, opted-out is a hard block, pending means we just haven't recorded a
// preference yet — utility templates still work.

const CONSENT_LABEL: Record<MarketingConsent, string> = {
  'opted-in':  'Marketing opt-in',
  'opted-out': 'Opted out',
  'pending':   'No marketing opt-in',
}

function ConsentBadge({ consent }: { consent: MarketingConsent }) {
  const tone =
    consent === 'opted-in' ? 'success' : consent === 'opted-out' ? 'danger' : 'warning'
  return (
    <Tag variant="filled" tone={tone} size="sm">
      {CONSENT_LABEL[consent]}
    </Tag>
  )
}

// ─── Conversation list (left pane) ───────────────────────────────────────────

function ConvListItem({
  conv,
  selected,
  onClick,
}: {
  conv: ChatConversation
  selected: boolean
  onClick: () => void
}) {
  const last = conv.messages[conv.messages.length - 1]
  const expired = conv.windowRemainingMin <= 0
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full text-left px-vintiga-md py-vintiga-md flex items-start gap-vintiga-md transition-colors cursor-pointer border-l-2',
        selected
          ? 'bg-vintiga-indigo-50/60 border-vintiga-indigo-500'
          : 'border-transparent hover:bg-vintiga-slate-50',
      ].join(' ')}
    >
      <Avatar initials={conv.customer.initials} size="md" />
      <div className="flex-1 min-w-0 flex flex-col gap-vintiga-xs">
        <div className="flex items-center gap-vintiga-sm">
          <span className="typo-body-sm font-semibold text-vintiga-slate-900 flex-1 truncate">
            {conv.customer.name}
          </span>
          <span className="typo-caption text-vintiga-slate-400 shrink-0">
            {fmtAgo(conv.lastActivityMin)}
          </span>
        </div>
        <p className="typo-body-sm text-vintiga-slate-600 line-clamp-2">
          {last?.kind === 'outbound' ? 'You: ' : ''}
          {last?.body}
        </p>
        <div className="flex items-center gap-vintiga-xs">
          <span className="inline-flex items-center gap-1 typo-caption text-vintiga-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-vintiga-green-500" />
            WhatsApp
          </span>
          {expired ? (
            <span className="typo-caption text-vintiga-orange-600 font-medium">
              · Session expired
            </span>
          ) : (
            <span className="typo-caption text-vintiga-slate-400">
              · {fmtWindow(conv.windowRemainingMin)}
            </span>
          )}
          {conv.unread > 0 && (
            <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-vintiga-indigo-500 text-vintiga-white typo-caption font-semibold">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

// ─── Message bubble ──────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  onQuickReply,
}: {
  msg: ChatMessage
  /** Called when the agent (acting as the customer) taps a quick-reply button. */
  onQuickReply?: (label: string) => void
}) {
  const isOut = msg.kind === 'outbound'
  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[78%] flex flex-col gap-1 ${isOut ? 'items-end' : 'items-start'}`}>
        <div
          className={[
            'rounded-2xl px-vintiga-md py-vintiga-sm typo-body-sm whitespace-pre-wrap shadow-sm',
            isOut
              ? 'bg-vintiga-indigo-500 text-vintiga-white rounded-br-sm'
              : 'bg-vintiga-white border border-vintiga-slate-200 text-vintiga-slate-900 rounded-bl-sm',
          ].join(' ')}
        >
          {msg.body}
        </div>
        {/* Template buttons — only outbound messages carry them. CTA buttons
            render as anchors (the customer would actually open the URL on
            their phone); quick-reply buttons are clickable in the prototype
            so we can simulate the customer tapping one. */}
        {isOut && msg.buttons && msg.buttons.length > 0 && (
          <div className="flex flex-wrap gap-vintiga-xs justify-end">
            {msg.buttons.map((b, i) =>
              b.kind === 'cta' ? (
                <a
                  key={i}
                  href={b.action === 'phone' ? `tel:${b.target}` : b.target}
                  target={b.action === 'url' ? '_blank' : undefined}
                  rel={b.action === 'url' ? 'noreferrer' : undefined}
                  className="inline-flex items-center gap-1 typo-caption font-semibold text-vintiga-indigo-600 border border-vintiga-indigo-200 bg-vintiga-white rounded-full px-3 py-1 no-underline hover:bg-vintiga-indigo-50 transition-colors"
                >
                  ↗ {b.label}
                </a>
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => onQuickReply?.(b.label)}
                  className="inline-flex items-center gap-1 typo-caption font-semibold text-vintiga-indigo-600 border border-vintiga-indigo-200 bg-vintiga-white rounded-full px-3 py-1 hover:bg-vintiga-indigo-50 transition-colors cursor-pointer"
                >
                  ↩ {b.label}
                </button>
              ),
            )}
          </div>
        )}
        <div className="flex items-center gap-vintiga-xs px-1">
          {msg.fromTemplate && (
            <span className="inline-flex items-center gap-0.5 typo-caption text-vintiga-slate-400">
              <LayersIcon className="w-3 h-3" />
              Template
            </span>
          )}
          <span className="typo-caption text-vintiga-slate-400">{fmtTime(msg.atOffsetMin)}</span>
          {isOut && msg.status === 'sent' && (
            <CheckIcon className="w-3.5 h-3.5 text-vintiga-slate-400" aria-label="Sent" />
          )}
          {isOut && msg.status === 'delivered' && (
            <CheckCheckIcon className="w-3.5 h-3.5 text-vintiga-slate-400" aria-label="Delivered" />
          )}
          {isOut && msg.status === 'read' && (
            <CheckCheckIcon className="w-3.5 h-3.5 text-vintiga-indigo-500" aria-label="Read" />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Composer ────────────────────────────────────────────────────────────────

function Composer({
  expired,
  onSendText,
  onOpenTemplates,
}: {
  expired: boolean
  onSendText: (body: string) => void
  onOpenTemplates: () => void
}) {
  const [draft, setDraft] = useState('')

  function send() {
    const body = draft.trim()
    if (!body) return
    onSendText(body)
    setDraft('')
  }

  if (expired) {
    return (
      <div className="border-t border-vintiga-slate-200 bg-vintiga-orange-50/40 px-vintiga-lg py-vintiga-md flex items-center gap-vintiga-md">
        <LockIcon className="w-5 h-5 text-vintiga-orange-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="typo-body-sm font-semibold text-vintiga-slate-900">
            24-hour customer service window has expired
          </p>
          <p className="typo-caption text-vintiga-slate-600">
            You can only send a pre-approved template until the customer replies again.
          </p>
        </div>
        <Button variant="solid" size="md" leftIcon={<LayersIcon />} onClick={onOpenTemplates}>
          Use template
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        send()
      }}
      className="border-t border-vintiga-slate-200 bg-vintiga-white px-vintiga-lg py-vintiga-md flex items-end gap-vintiga-sm"
    >
      <IconButton variant="outline" size="md" icon={<PaperclipIcon />} aria-label="Attach"    onClick={() => {}} />
      <IconButton variant="outline" size="md" icon={<SmileIcon />}     aria-label="Emoji"     onClick={() => {}} />
      <div className="flex-1 min-w-0">
        <TextField
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message"
        />
      </div>
      <IconButton variant="outline" size="md" icon={<LayersIcon />} aria-label="Templates" onClick={onOpenTemplates} />
      {draft.trim().length > 0 ? (
        <IconButton variant="solid" size="md" icon={<SendIcon />} aria-label="Send" type="submit" />
      ) : (
        <IconButton variant="outline" size="md" icon={<MicIcon />} aria-label="Voice" onClick={() => {}} />
      )}
    </form>
  )
}

// ─── Right rail — customer context ───────────────────────────────────────────

function CustomerRail({ conv }: { conv: ChatConversation }) {
  const c = conv.customer
  return (
    <aside className="w-[320px] shrink-0 border-l border-vintiga-slate-200 bg-vintiga-white flex flex-col">
      <div className="px-vintiga-lg py-vintiga-lg flex flex-col items-center gap-vintiga-sm border-b border-vintiga-slate-200">
        <Avatar initials={c.initials} size="xl" />
        <div className="flex flex-col items-center gap-1">
          <span className="typo-title-section font-semibold text-vintiga-slate-900">{c.name}</span>
          <span className="typo-body-sm text-vintiga-slate-500">{c.city}</span>
        </div>
        <div className="flex flex-wrap gap-vintiga-xs justify-center">
          <Tag variant="filled" tone={c.segment === 'VIP' ? 'warning' : c.segment === 'Member' ? 'info' : 'default'} size="sm">
            {c.segment}
          </Tag>
          <ConsentBadge consent={c.marketingConsent} />
        </div>
      </div>

      <div className="px-vintiga-lg py-vintiga-md flex flex-col gap-vintiga-md border-b border-vintiga-slate-200">
        <div className="flex items-center gap-vintiga-sm">
          <div className="w-8 h-8 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 [&>svg]:w-4 [&>svg]:h-4">
            <PhoneIcon />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="typo-caption text-vintiga-slate-500">WhatsApp</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-900 truncate">{c.phone}</span>
          </div>
        </div>
        <div className="flex items-center gap-vintiga-sm">
          <div className="w-8 h-8 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 [&>svg]:w-4 [&>svg]:h-4">
            <ClockIcon />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="typo-caption text-vintiga-slate-500">Service window</span>
            <span
              className={[
                'typo-body-sm font-semibold',
                conv.windowRemainingMin <= 0
                  ? 'text-vintiga-orange-600'
                  : conv.windowRemainingMin < 60
                  ? 'text-vintiga-orange-600'
                  : 'text-vintiga-slate-900',
              ].join(' ')}
            >
              {fmtWindow(conv.windowRemainingMin)}
            </span>
          </div>
        </div>
      </div>

      <div className="px-vintiga-lg py-vintiga-md flex flex-col gap-vintiga-md border-b border-vintiga-slate-200">
        <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase tracking-wide">
          Customer summary
        </span>
        <div className="flex items-center gap-vintiga-sm">
          <div className="w-8 h-8 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 [&>svg]:w-4 [&>svg]:h-4">
            <ShoppingCartIcon />
          </div>
          <div className="flex flex-col">
            <span className="typo-caption text-vintiga-slate-500">Orders</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-900">{c.ordersCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-vintiga-sm">
          <div className="w-8 h-8 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 [&>svg]:w-4 [&>svg]:h-4">
            <CreditCardIcon />
          </div>
          <div className="flex flex-col">
            <span className="typo-caption text-vintiga-slate-500">Lifetime spend</span>
            <span className="typo-body-sm font-semibold text-vintiga-slate-900">
              ${c.lifetimeSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="px-vintiga-lg py-vintiga-md mt-auto">
        <Button variant="outline" size="md" fullWidth onClick={() => {}}>
          View customer profile
        </Button>
      </div>
    </aside>
  )
}

// ─── Screen ──────────────────────────────────────────────────────────────────

function readSelectedFromHash(): string | null {
  const m = window.location.hash.match(/^#\/web\/sales-chat\/([^/]+)/)
  return m ? m[1] : null
}

export function SalesChatScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()
  const [convs,    setConvs]    = useState<ChatConversation[]>(CONVERSATIONS)
  const [search,   setSearch]   = useState('')
  const [picking,  setPicking]  = useState(false)

  const initialId = readSelectedFromHash() ?? convs[0]?.id ?? null
  const [selectedId, setSelectedId] = useState<string | null>(initialId)

  // Keep the hash in sync (one-way: state → hash, on selection change)
  useEffect(() => {
    if (!selectedId) return
    const next = `#/web/sales-chat/${selectedId}`
    if (window.location.hash !== next) window.location.hash = next
  }, [selectedId])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return convs
    return convs.filter(
      (c) =>
        c.customer.name.toLowerCase().includes(q) ||
        c.customer.phone.toLowerCase().includes(q) ||
        c.messages.some((m) => m.body.toLowerCase().includes(q)),
    )
  }, [convs, search])

  const selected = convs.find((c) => c.id === selectedId) ?? convs[0]
  const expired  = selected ? selected.windowRemainingMin <= 0 : false

  // Scroll the thread to the bottom when conversation changes or a message is appended.
  const threadRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight })
  }, [selectedId, selected?.messages.length])

  function appendMessage(body: string, fromTemplate?: string, buttons?: TemplateButton[]) {
    if (!selected) return
    const next: ChatMessage = {
      id:           `m-${selected.id}-${Date.now()}`,
      kind:         'outbound',
      body,
      atOffsetMin:  0,
      status:       'sent',
      fromTemplate,
      buttons,
    }
    setConvs((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, messages: [...c.messages, next], lastActivityMin: 0 } : c,
      ),
    )
  }

  /**
   * Simulate the customer tapping a quick-reply button on a template we sent.
   * Appends an inbound message with the button's label, resets the 24h window
   * (since the customer just messaged us), and — if the label looks like a
   * marketing-consent answer — updates the consent state on the customer.
   */
  function simulateQuickReply(label: string) {
    if (!selected) return
    const reply: ChatMessage = {
      id:          `m-${selected.id}-${Date.now()}-qr`,
      kind:        'inbound',
      body:        label,
      atOffsetMin: 0,
    }
    const lower = label.toLowerCase()
    const consentNext: MarketingConsent | undefined =
      lower.includes('opt me in') || lower === 'yes'
        ? 'opted-in'
        : lower.includes('no thanks') || lower === 'stop'
        ? 'opted-out'
        : undefined

    setConvs((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              messages: [...c.messages, reply],
              lastActivityMin: 0,
              windowRemainingMin: 24 * 60,
              customer: consentNext
                ? { ...c.customer, marketingConsent: consentNext }
                : c.customer,
            }
          : c,
      ),
    )
  }

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Sales Chat"
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          device="responsive"
          fixed
          user={{ name: 'Tom Cook', initials: 'TC' }}
          onMenuToggle={onMenuToggle}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />

        <main className="flex-1 overflow-hidden pt-16 bg-vintiga-slate-50">
          <div className="h-full flex">
            {/* ── Left: inbox list ─────────────────────────────────────── */}
            <aside className="w-[340px] shrink-0 border-r border-vintiga-slate-200 bg-vintiga-white flex flex-col">
              <div className="px-vintiga-lg py-vintiga-lg border-b border-vintiga-slate-200 flex flex-col gap-vintiga-sm">
                <h1 className="typo-title-section font-semibold text-vintiga-slate-900">
                  Sales Chat
                </h1>
                <TextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations"
                  leftIcon={<SearchIcon />}
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="typo-body-sm text-vintiga-slate-500 px-vintiga-lg py-vintiga-lg">
                    No conversations match "{search}".
                  </p>
                ) : (
                  filtered.map((c) => (
                    <ConvListItem
                      key={c.id}
                      conv={c}
                      selected={c.id === selected?.id}
                      onClick={() => setSelectedId(c.id)}
                    />
                  ))
                )}
              </div>
            </aside>

            {/* ── Center: thread ───────────────────────────────────────── */}
            <section className="flex-1 min-w-0 flex flex-col bg-vintiga-slate-50">
              {selected && (
                <>
                  <header className="px-vintiga-lg py-vintiga-md border-b border-vintiga-slate-200 bg-vintiga-white flex items-center gap-vintiga-md">
                    <Avatar initials={selected.customer.initials} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="typo-body font-semibold text-vintiga-slate-900 truncate">
                        {selected.customer.name}
                      </p>
                      <p className="typo-caption text-vintiga-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-vintiga-green-500" />
                        WhatsApp · {selected.customer.phone}
                      </p>
                    </div>
                    <ConsentBadge consent={selected.customer.marketingConsent} />
                    <Tag
                      variant="filled"
                      tone={expired ? 'warning' : 'success'}
                      size="sm"
                    >
                      {expired ? 'Session expired' : fmtWindow(selected.windowRemainingMin)}
                    </Tag>
                  </header>

                  <div
                    ref={threadRef}
                    className="flex-1 overflow-y-auto px-vintiga-lg py-vintiga-lg flex flex-col gap-vintiga-md"
                  >
                    {[...selected.messages]
                      .sort((a, b) => b.atOffsetMin - a.atOffsetMin)
                      // Sorting puts oldest first (largest offset = furthest in the past).
                      .map((m) => (
                        <MessageBubble key={m.id} msg={m} onQuickReply={simulateQuickReply} />
                      ))}
                  </div>

                  <Composer
                    expired={expired}
                    onSendText={(body) => appendMessage(body)}
                    onOpenTemplates={() => setPicking(true)}
                  />
                </>
              )}
            </section>

            {/* ── Right: customer rail ─────────────────────────────────── */}
            {selected && <CustomerRail conv={selected} />}
          </div>
        </main>
      </div>

      <TemplatePicker
        open={picking}
        onClose={() => setPicking(false)}
        consent={selected?.customer.marketingConsent ?? 'pending'}
        onSend={(body, templateId, buttons) => appendMessage(body, templateId, buttons)}
      />
    </div>
  )
}
