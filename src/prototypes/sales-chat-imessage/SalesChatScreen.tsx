import { useEffect, useMemo, useRef, useState } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { Avatar } from '@ds/shared/Avatar'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Switch } from '@ds/shared/Switch'
import { Tag } from '@ds/shared/Tag'
import { TextField } from '@ds/shared/TextField'
import {
  SearchIcon,
  SendIcon,
  PlusIcon,
  SparklesIcon,
  MicIcon,
  PhoneIcon,
  CalendarIcon,
  BotIcon,
  EllipsisVerticalIcon,
  ClockIcon,
  PackageIcon,
  CheckCircleIcon,
  InfoIcon,
} from '@ds/icons/Icons'
import {
  CONVERSATIONS,
  channelLabel,
  tapbackEmoji,
  type ChatConversation,
  type ChatMessage,
  type ChatChannel,
} from './chatSamples'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { QuickReplyPicker } from './QuickReplyPicker'

// ─── SalesChatScreen (iMessage / Sendblue) ───────────────────────────────────
// Three-pane inbox modeled on Sendblue's product. iMessage outbound = blue
// bubble, SMS outbound = green bubble (true Apple Messages convention). A
// single thread can mix channels because iMessage transparently falls back
// to SMS when the recipient is unreachable. The composer's channel pill
// shows what the NEXT outgoing message will be, sourced from the contact's
// last `evaluate_service` result.

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtAgo(min: number): string {
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  return `${d}d`
}

function fmtClock(min: number): string {
  // Render a fake "9:42 AM"-style timestamp anchored to a 9:30 baseline so
  // the thread reads naturally. Offset is "minutes ago from now".
  const now = new Date('2026-06-12T11:30:00')
  const t = new Date(now.getTime() - min * 60_000)
  return t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function lastMessagePreview(c: ChatConversation): string {
  const last = c.messages[c.messages.length - 1]
  if (!last) return ''
  if (last.type === 'text')    return last.body
  if (last.type === 'image')   return '📷 Photo'
  if (last.type === 'voice')   return '🎙 Voice message'
  if (last.type === 'link')    return `🔗 ${last.preview.title}`
  if (last.type === 'contact') return `👤 Contact: ${last.contact.name}`
  return ''
}

// ─── Inbox row ───────────────────────────────────────────────────────────────

function ChannelDot({ channel }: { channel: ChatChannel }) {
  const cls =
    channel === 'imessage'
      ? 'bg-vintiga-blue-500'
      : channel === 'rcs'
      ? 'bg-vintiga-sky-500'
      : 'bg-vintiga-green-500'
  return <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cls}`} aria-hidden />
}

interface InboxRowProps {
  conv: ChatConversation
  active: boolean
  onClick: () => void
}
function InboxRow({ conv, active, onClick }: InboxRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full text-left px-vintiga-md py-vintiga-sm flex items-start gap-vintiga-sm',
        'bg-transparent border-none border-l-[3px] cursor-pointer transition-colors',
        active
          ? 'border-l-vintiga-indigo-600 bg-vintiga-indigo-50/60'
          : 'border-l-transparent hover:bg-vintiga-slate-50',
      ].join(' ')}
    >
      <Avatar name={conv.contact.name} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5">
          <span className="typo-body-sm font-semibold text-vintiga-slate-900 truncate flex items-center gap-1.5">
            {conv.pinned && <span className="text-vintiga-slate-400" aria-hidden>📌</span>}
            {conv.contact.name}
          </span>
          <span className="typo-caption text-vintiga-slate-500 shrink-0 tabular-nums">
            {fmtAgo(conv.lastActivityMin)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <ChannelDot channel={conv.lastChannel} />
          <span className="typo-caption text-vintiga-slate-500 truncate flex-1">
            {lastMessagePreview(conv)}
          </span>
          {conv.unread > 0 && (
            <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-vintiga-indigo-600 text-vintiga-white inline-flex items-center justify-center typo-caption font-semibold tabular-nums">
              {conv.unread}
            </span>
          )}
        </div>
        {conv.aiAgent && (
          <div className="mt-1 inline-flex items-center gap-1 typo-caption text-vintiga-indigo-600">
            <BotIcon className="w-3 h-3" />
            AI handling
          </div>
        )}
      </div>
    </button>
  )
}

// ─── Bubbles ────────────────────────────────────────────────────────────────

function bubbleClasses(message: ChatMessage): string {
  if (message.kind === 'inbound') {
    return 'bg-vintiga-gray-200 text-vintiga-slate-900 rounded-vintiga-card rounded-bl-sm'
  }
  // Outbound — colour by channel.
  if (message.channel === 'sms') {
    return 'bg-vintiga-green-500 text-vintiga-white rounded-vintiga-card rounded-br-sm'
  }
  return 'bg-vintiga-blue-500 text-vintiga-white rounded-vintiga-card rounded-br-sm'
}

function ReactionBadge({ reactions, side }: { reactions: ChatMessage['reactions']; side: 'left' | 'right' }) {
  if (!reactions || reactions.length === 0) return null
  return (
    <div
      className={[
        'absolute -top-2 z-10 flex',
        side === 'left' ? '-left-1' : '-right-1',
      ].join(' ')}
    >
      {reactions.map((r, i) => (
        <span
          key={i}
          title={`${r.by === 'agent' ? 'You' : 'Customer'} reacted with ${r.type}`}
          className="w-6 h-6 rounded-full bg-vintiga-white border border-vintiga-slate-200 shadow-vintiga-sm inline-flex items-center justify-center text-xs"
        >
          {tapbackEmoji(r.type)}
        </span>
      ))}
    </div>
  )
}

function VoiceBubble({ message, outbound }: { message: ChatMessage & { type: 'voice' }; outbound: boolean }) {
  // Fake waveform — 22 bars with varying heights, tailored colour per bubble.
  const heights = useMemo(
    () => Array.from({ length: 22 }, (_, i) => {
      // Deterministic pseudo-random based on id + i so it renders consistently.
      const seed = message.id.charCodeAt(message.id.length - 1) + i * 7
      return ((seed * 9301 + 49297) % 233281) / 233281
    }),
    [message.id],
  )
  const barColor = outbound ? 'bg-white/70' : 'bg-vintiga-slate-400'
  return (
    <div className="flex items-center gap-2 min-w-[180px]">
      <button
        type="button"
        className={[
          'w-8 h-8 rounded-full inline-flex items-center justify-center border-none cursor-pointer shrink-0',
          outbound ? 'bg-white/20 text-white' : 'bg-vintiga-white text-vintiga-slate-700',
        ].join(' ')}
        aria-label="Play voice message"
      >
        ▶
      </button>
      <div className="flex items-center gap-0.5 flex-1 h-6">
        {heights.map((h, i) => (
          <span
            key={i}
            className={`block w-1 ${barColor} rounded-full`}
            style={{ height: `${20 + h * 80}%` }}
          />
        ))}
      </div>
      <span className={`typo-caption tabular-nums ${outbound ? 'text-white/80' : 'text-vintiga-slate-500'}`}>
        0:{String(message.durationSec).padStart(2, '0')}
      </span>
    </div>
  )
}

function LinkPreview({ message }: { message: ChatMessage & { type: 'link' } }) {
  return (
    <div className="rounded-vintiga-md overflow-hidden bg-vintiga-white/10 max-w-xs">
      {message.preview.thumbnail && (
        <img
          src={message.preview.thumbnail}
          alt=""
          className="w-full h-32 object-cover"
        />
      )}
      <div className="px-vintiga-sm py-vintiga-sm">
        <div className="typo-body-sm font-semibold leading-snug">{message.preview.title}</div>
        {message.preview.description && (
          <p className="mt-0.5 typo-caption opacity-80 line-clamp-2">{message.preview.description}</p>
        )}
        <div className="mt-1 typo-caption opacity-70">{message.preview.host}</div>
      </div>
    </div>
  )
}

function ContactCard({ message, outbound }: { message: ChatMessage & { type: 'contact' }; outbound: boolean }) {
  return (
    <div className={[
      'rounded-vintiga-md p-vintiga-sm flex items-center gap-vintiga-sm max-w-xs',
      outbound ? 'bg-white/15' : 'bg-vintiga-white border border-vintiga-slate-200',
    ].join(' ')}>
      <span className="w-9 h-9 rounded-full bg-vintiga-slate-200 inline-flex items-center justify-center typo-body-sm font-semibold text-vintiga-slate-700">
        {message.contact.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`typo-body-sm font-semibold ${outbound ? 'text-white' : 'text-vintiga-slate-900'}`}>
          {message.contact.name}
        </div>
        {message.contact.phone && (
          <div className={`typo-caption ${outbound ? 'text-white/80' : 'text-vintiga-slate-500'}`}>
            {message.contact.phone}
          </div>
        )}
      </div>
    </div>
  )
}

interface BubbleProps {
  message: ChatMessage
  showTimestamp: boolean
}
function Bubble({ message, showTimestamp }: BubbleProps) {
  const outbound = message.kind === 'outbound'
  const side = outbound ? 'right' : 'left'
  return (
    <div className={`w-full flex ${outbound ? 'justify-end' : 'justify-start'} mt-0.5`}>
      <div className="relative max-w-[75%] flex flex-col items-end">
        <div className={['px-3 py-2 leading-snug', bubbleClasses(message)].join(' ')}>
          <ReactionBadge reactions={message.reactions} side={side} />
          {message.type === 'text'    && <span className="typo-body-sm whitespace-pre-wrap">{message.body}</span>}
          {message.type === 'image'   && (
            <div className="-m-1">
              <img src={message.src} alt={message.caption ?? ''} className="rounded-vintiga-md max-w-xs max-h-72 object-cover" />
              {message.caption && (
                <p className={`px-2 pt-1 typo-caption ${outbound ? 'text-white/90' : 'text-vintiga-slate-700'}`}>
                  {message.caption}
                </p>
              )}
            </div>
          )}
          {message.type === 'voice'   && <VoiceBubble message={message} outbound={outbound} />}
          {message.type === 'link'    && <LinkPreview message={message} />}
          {message.type === 'contact' && <ContactCard message={message} outbound={outbound} />}
        </div>

        {/* Metadata row under the bubble — timestamp, AI-sent badge, channel
            fallback marker. Aligned to bubble side. */}
        {(showTimestamp || message.fromAi) && (
          <div className={`mt-1 flex items-center gap-1.5 typo-caption text-vintiga-slate-500 ${outbound ? 'self-end' : 'self-start'}`}>
            {message.fromAi && (
              <span className="inline-flex items-center gap-1 text-vintiga-indigo-600">
                <BotIcon className="w-3 h-3" /> AI
              </span>
            )}
            {showTimestamp && <span>{fmtClock(message.atOffsetMin)}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="w-full flex justify-start mt-1">
      <div className="px-3 py-2.5 rounded-vintiga-card rounded-bl-sm bg-vintiga-gray-200">
        <span className="inline-flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-vintiga-slate-400 animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-vintiga-slate-400 animate-pulse" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-vintiga-slate-400 animate-pulse" style={{ animationDelay: '300ms' }} />
        </span>
      </div>
    </div>
  )
}

// ─── Right rail (contact context) ────────────────────────────────────────────

function ContactRail({ conv }: { conv: ChatConversation }) {
  const c = conv.contact
  return (
    <aside className="w-[320px] shrink-0 border-l border-vintiga-slate-200 bg-vintiga-white overflow-y-auto">
      <div className="p-vintiga-lg flex flex-col items-center text-center border-b border-vintiga-slate-200">
        <Avatar name={c.name} size="xl" />
        <h3 className="mt-vintiga-sm typo-body font-semibold text-vintiga-slate-900">{c.name}</h3>
        <p className="typo-caption text-vintiga-slate-500">{c.phone}</p>
        <div className="mt-vintiga-sm">
          <Tag tone={c.segment === 'VIP' ? 'violet' : c.segment === 'Member' ? 'success' : 'default'} size="sm">
            {c.segment}
          </Tag>
        </div>

        <div className="mt-vintiga-md w-full flex gap-vintiga-sm">
          <Button variant="outline" size="sm" leftIcon={<PhoneIcon />} fullWidth>
            Call
          </Button>
          <Button variant="outline" size="sm" leftIcon={<InfoIcon />} fullWidth>
            Profile
          </Button>
        </div>
      </div>

      <RailSection title="Messaging">
        <RailRow label="Channel">
          {c.iMessageCapable ? (
            <Tag tone="info" size="sm" leftIcon={<ChannelDot channel="imessage" />}>
              iMessage
            </Tag>
          ) : (
            <Tag tone="success" size="sm" leftIcon={<ChannelDot channel="sms" />}>
              SMS only
            </Tag>
          )}
        </RailRow>
        <RailRow label="City">{c.city}</RailRow>
        {c.tags && c.tags.length > 0 && (
          <RailRow label="Tags">
            <div className="flex flex-wrap gap-1 justify-end">
              {c.tags.map((t) => (
                <Tag key={t} variant="outline" size="sm">{t}</Tag>
              ))}
            </div>
          </RailRow>
        )}
      </RailSection>

      <RailSection title="Lifetime value">
        <RailRow label="Total spend">
          <span className="font-semibold">${c.lifetimeSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </RailRow>
        <RailRow label="Orders">{c.ordersCount}</RailRow>
      </RailSection>

      <RailSection title="Quick actions">
        <button type="button" className="w-full text-left px-vintiga-md py-vintiga-sm typo-body-sm text-vintiga-slate-700 hover:bg-vintiga-slate-50 bg-transparent border-none cursor-pointer flex items-center gap-vintiga-sm">
          <PackageIcon className="w-4 h-4 text-vintiga-slate-400" /> Create order
        </button>
        <button type="button" className="w-full text-left px-vintiga-md py-vintiga-sm typo-body-sm text-vintiga-slate-700 hover:bg-vintiga-slate-50 bg-transparent border-none cursor-pointer flex items-center gap-vintiga-sm">
          <CalendarIcon className="w-4 h-4 text-vintiga-slate-400" /> Book experience
        </button>
        <button type="button" className="w-full text-left px-vintiga-md py-vintiga-sm typo-body-sm text-vintiga-slate-700 hover:bg-vintiga-slate-50 bg-transparent border-none cursor-pointer flex items-center gap-vintiga-sm">
          <CheckCircleIcon className="w-4 h-4 text-vintiga-slate-400" /> Add note
        </button>
      </RailSection>
    </aside>
  )
}

function RailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-vintiga-slate-200 py-vintiga-md">
      <h4 className="px-vintiga-md typo-caption font-semibold uppercase tracking-wide text-vintiga-slate-500">{title}</h4>
      <div className="mt-vintiga-sm">{children}</div>
    </section>
  )
}

function RailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-vintiga-md py-1.5 flex items-center justify-between gap-vintiga-sm">
      <span className="typo-caption text-vintiga-slate-500">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-900 text-right">{children}</span>
    </div>
  )
}

// ─── Composer ────────────────────────────────────────────────────────────────

interface ComposerProps {
  conv: ChatConversation
  draft: string
  setDraft: (s: string) => void
  onSend: () => void
}
function Composer({ conv, draft, setDraft, onSend }: ComposerProps) {
  const [quickOpen, setQuickOpen] = useState(false)
  const channel = conv.contact.iMessageCapable ? 'imessage' : 'sms'
  const channelBg =
    channel === 'imessage'
      ? 'bg-vintiga-blue-50 text-vintiga-blue-700 border-vintiga-blue-200'
      : 'bg-vintiga-green-100 text-vintiga-green-700 border-vintiga-green-200'

  return (
    <div className="relative border-t border-vintiga-slate-200 bg-vintiga-white px-vintiga-md py-vintiga-sm">
      {/* Channel pill above the composer */}
      <div className="flex items-center justify-between mb-vintiga-xs">
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border typo-caption font-medium ${channelBg}`}>
          <ChannelDot channel={channel} />
          Will send as {channelLabel(channel)}
          {!conv.contact.iMessageCapable && (
            <span className="text-vintiga-green-700/70"> · Android</span>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 typo-caption text-vintiga-slate-500 hover:text-vintiga-slate-700 bg-transparent border-none cursor-pointer"
        >
          <ClockIcon className="w-3.5 h-3.5" /> Schedule send
        </button>
      </div>

      <QuickReplyPicker
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        onPick={(qr) => setDraft(draft ? `${draft} ${qr.body}` : qr.body)}
      />

      <div className="flex items-end gap-vintiga-sm">
        <IconButton
          variant="outline"
          size="md"
          icon={<PlusIcon />}
          aria-label="Add attachment"
          onClick={() => {}}
        />
        <IconButton
          variant="outline"
          size="md"
          icon={<SparklesIcon />}
          aria-label="Quick replies"
          onClick={() => setQuickOpen((v) => !v)}
        />
        <div className="flex-1">
          <TextField
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`iMessage ${conv.contact.name.split(' ')[0]}`}
          />
        </div>
        {draft.trim().length > 0 ? (
          <IconButton
            variant="solid"
            tone="primary"
            size="md"
            icon={<SendIcon />}
            aria-label="Send"
            onClick={onSend}
          />
        ) : (
          <IconButton
            variant="outline"
            size="md"
            icon={<MicIcon />}
            aria-label="Record voice memo"
            onClick={() => {}}
          />
        )}
      </div>
    </div>
  )
}

// ─── Main screen ────────────────────────────────────────────────────────────

type InboxFilter = 'all' | 'imessage' | 'sms' | 'unread'

function readActiveId(): string | null {
  if (typeof window === 'undefined') return null
  const m = window.location.hash.match(/^#\/web\/sales-chat-imessage\/([^/?]+)/)
  return m ? m[1] : null
}

export function SalesChatScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()
  const [filter, setFilter] = useState<InboxFilter>('all')
  const [search, setSearch] = useState('')
  const [activeId, setActiveId] = useState<string | null>(readActiveId() ?? CONVERSATIONS[0].id)
  const [draft, setDraft] = useState('')
  const [conversations, setConversations] = useState<ChatConversation[]>(CONVERSATIONS)
  const threadRef = useRef<HTMLDivElement>(null)

  // Keep hash + active in sync.
  useEffect(() => {
    if (activeId) window.location.hash = `#/web/sales-chat-imessage/${activeId}`
  }, [activeId])

  const conv = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [conversations, activeId],
  )

  // Filter + search the inbox.
  const inbox = useMemo(() => {
    const q = search.trim().toLowerCase()
    return conversations
      .filter((c) => {
        if (filter === 'imessage') return c.lastChannel === 'imessage'
        if (filter === 'sms')      return c.lastChannel === 'sms'
        if (filter === 'unread')   return c.unread > 0
        return true
      })
      .filter((c) => (q ? c.contact.name.toLowerCase().includes(q) : true))
      .sort((a, b) => {
        // Pinned first, then by last activity (lower = more recent).
        if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
        return a.lastActivityMin - b.lastActivityMin
      })
  }, [conversations, filter, search])

  // Auto-scroll thread to bottom on conversation change / new draft.
  useEffect(() => {
    const el = threadRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [conv?.id, conv?.messages.length])

  function handleSend() {
    const body = draft.trim()
    if (!body || !conv) return
    const channel: ChatChannel = conv.contact.iMessageCapable ? 'imessage' : 'sms'
    const next: ChatMessage = {
      id: `new-${Date.now()}`,
      kind: 'outbound',
      channel,
      type: 'text',
      body,
      atOffsetMin: 0,
      status: 'sent',
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id
          ? { ...c, messages: [...c.messages, next], lastActivityMin: 0, lastChannel: channel }
          : c,
      ),
    )
    setDraft('')
  }

  function toggleAiAgent(on: boolean) {
    if (!conv) return
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, aiAgent: on } : c)))
  }

  // Find index of the latest outbound `read` message — used to render the
  // "Read 9:42 AM" receipt just under it.
  const lastReadOutboundIdx = useMemo(() => {
    if (!conv) return -1
    for (let i = conv.messages.length - 1; i >= 0; i--) {
      const m = conv.messages[i]
      if (m.kind === 'outbound' && m.status === 'read') return i
    }
    return -1
  }, [conv])

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

        <div className="flex-1 pt-16 flex min-h-0">
          {/* ── Inbox column ──────────────────────────────────────────── */}
          <section className="w-[320px] shrink-0 border-r border-vintiga-slate-200 flex flex-col min-h-0">
            <div className="p-vintiga-md flex flex-col gap-vintiga-sm border-b border-vintiga-slate-200">
              <div className="flex items-center justify-between gap-vintiga-sm">
                <h2 className="typo-title-section font-semibold text-vintiga-slate-900">Inbox</h2>
                <Tag tone="info" size="sm" leftIcon={<SparklesIcon className="w-3 h-3" />}>
                  Sendblue
                </Tag>
              </div>
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or number"
                leftIcon={<SearchIcon className="w-4 h-4" />}
              />
              <SegmentedControl<InboxFilter>
                value={filter}
                onChange={setFilter}
                size="sm"
                aria-label="Inbox filter"
                options={[
                  { value: 'all',      label: 'All' },
                  { value: 'imessage', label: 'iMessage' },
                  { value: 'sms',      label: 'SMS' },
                  { value: 'unread',   label: 'Unread' },
                ]}
              />
            </div>
            <div className="flex-1 overflow-y-auto py-vintiga-xs">
              {inbox.length === 0 ? (
                <p className="px-vintiga-md py-vintiga-lg typo-body-sm text-vintiga-slate-500 text-center">
                  No conversations match this filter.
                </p>
              ) : (
                inbox.map((c) => (
                  <InboxRow
                    key={c.id}
                    conv={c}
                    active={c.id === conv?.id}
                    onClick={() => setActiveId(c.id)}
                  />
                ))
              )}
            </div>
          </section>

          {/* ── Thread column ─────────────────────────────────────────── */}
          {conv ? (
            <section className="flex-1 flex flex-col min-w-0">
              {/* Thread header */}
              <header className="px-vintiga-lg py-vintiga-md border-b border-vintiga-slate-200 bg-vintiga-white flex items-center gap-vintiga-md">
                <Avatar name={conv.contact.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="typo-body font-semibold text-vintiga-slate-900">{conv.contact.name}</div>
                  <div className="typo-caption text-vintiga-slate-500 flex items-center gap-1.5">
                    <ChannelDot channel={conv.contact.iMessageCapable ? 'imessage' : 'sms'} />
                    {conv.contact.iMessageCapable ? 'iMessage · falls back to SMS' : 'SMS only · Android device'}
                  </div>
                </div>

                <div className="flex items-center gap-vintiga-sm">
                  <div className="flex items-center gap-2 px-vintiga-sm py-1 rounded-vintiga-input bg-vintiga-slate-50">
                    <BotIcon className="w-4 h-4 text-vintiga-indigo-500" />
                    <span className="typo-caption text-vintiga-slate-700">AI agent</span>
                    <Switch checked={conv.aiAgent} onChange={toggleAiAgent} size="sm" />
                  </div>
                  <IconButton variant="outline" size="md" icon={<PhoneIcon />} aria-label="Call" />
                  <IconButton variant="outline" size="md" icon={<EllipsisVerticalIcon />} aria-label="More" />
                </div>
              </header>

              {/* Message list */}
              <div
                ref={threadRef}
                className="flex-1 overflow-y-auto px-vintiga-lg py-vintiga-md bg-vintiga-slate-50/40"
              >
                {conv.messages.map((m, idx) => {
                  const next = conv.messages[idx + 1]
                  // Show timestamp only on the last message in a same-sender cluster.
                  const isLastInCluster = !next || next.kind !== m.kind
                  return (
                    <div key={m.id}>
                      <Bubble message={m} showTimestamp={isLastInCluster} />
                      {/* Read receipt under the latest read outbound message */}
                      {idx === lastReadOutboundIdx && (
                        <div className="flex justify-end pr-1 mt-0.5">
                          <span className="typo-caption text-vintiga-slate-500">
                            Read · {fmtClock(m.atOffsetMin - 1)}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
                {conv.typing && <TypingBubble />}
              </div>

              <Composer conv={conv} draft={draft} setDraft={setDraft} onSend={handleSend} />
            </section>
          ) : (
            <section className="flex-1 flex items-center justify-center text-vintiga-slate-500 typo-body">
              Select a conversation to start
            </section>
          )}

          {/* ── Contact rail ─────────────────────────────────────────── */}
          {conv && <ContactRail conv={conv} />}
        </div>
      </div>
    </div>
  )
}

