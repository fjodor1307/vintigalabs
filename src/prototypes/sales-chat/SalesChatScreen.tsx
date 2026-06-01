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
  type ChatSource,
} from './chatSamples'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
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

// ─── Source labelling ────────────────────────────────────────────────────────
// Drives the inline channel pill on each conversation row and the filter
// tabs above the inbox.

type InboxFilter = 'all' | ChatSource

const SOURCE_META: Record<ChatSource, { label: string; dotClass: string }> = {
  whatsapp: { label: 'WhatsApp', dotClass: 'bg-vintiga-green-500' },
  website:  { label: 'Website',  dotClass: 'bg-vintiga-indigo-500' },
  members:  { label: 'Members',  dotClass: 'bg-vintiga-violet-500' },
}

/** Tab label with a trailing unread-count chip. Hidden when the count is
 *  zero so quiet channels stay tidy. */
function ChannelLabel({ label, count, active }: { label: string; count: number; active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      {count > 0 && (
        <span className={[
          'typo-caption tabular-nums px-1 rounded-full min-w-[16px] text-center',
          // Inactive chip must contrast with the SegmentedControl's slate-100
          // container — otherwise it disappears into the background. Use white
          // on inactive, indigo-tinted on active.
          active ? 'bg-vintiga-indigo-100 text-vintiga-indigo-700' : 'bg-vintiga-white text-vintiga-slate-500 border border-vintiga-slate-200',
        ].join(' ')}>{count}</span>
      )}
    </span>
  )
}

function SourcePill({ source }: { source: ChatSource }) {
  const meta = SOURCE_META[source]
  return (
    <span className="inline-flex items-center gap-1 typo-caption text-vintiga-slate-500">
      <span className={['w-1.5 h-1.5 rounded-full', meta.dotClass].join(' ')} />
      {meta.label}
    </span>
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
          <SourcePill source={conv.source} />
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

function MessageBubble({ msg }: { msg: ChatMessage }) {
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
      // Slim strip — copy carries the call to action (text link → template
      // picker), no separate button per the May 28 review with Donna.
      <div className="border-t border-vintiga-slate-200 bg-vintiga-orange-50/40 px-vintiga-lg py-vintiga-md flex items-center gap-vintiga-sm">
        <LockIcon className="w-4 h-4 text-vintiga-orange-600 shrink-0" />
        <p className="typo-body-sm text-vintiga-slate-700">
          Session expired — templates only.{' '}
          <button
            type="button"
            onClick={onOpenTemplates}
            className="typo-body-sm font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 underline-offset-2 hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Open templates
          </button>
        </p>
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
    <aside className="hidden lg:flex w-[320px] shrink-0 border-l border-vintiga-slate-200 bg-vintiga-white flex-col">
      <div className="px-vintiga-lg py-vintiga-lg flex flex-col items-center gap-vintiga-sm border-b border-vintiga-slate-200">
        <Avatar initials={c.initials} size="xl" />
        <div className="flex flex-col items-center gap-1">
          <span className="typo-title-section font-semibold text-vintiga-slate-900">{c.name}</span>
          <span className="typo-body-sm text-vintiga-slate-500">{c.city}</span>
        </div>
        <Tag variant="filled" tone={c.segment === 'VIP' ? 'warning' : c.segment === 'Member' ? 'info' : 'default'} size="sm">
          {c.segment}
        </Tag>
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
        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={() => {
            // Carry the conversation id so the customer view can render a
            // "← Sales Chat / {conversation}" breadcrumb that routes back here.
            window.location.hash = `#/web/customers/view/overview?from=sales-chat&conv=${conv.id}`
          }}
        >
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
  const [channel,  setChannel]  = useState<InboxFilter>('all')

  const initialId = readSelectedFromHash() ?? convs[0]?.id ?? null
  const [selectedId, setSelectedId] = useState<string | null>(initialId)

  // Keep the hash in sync (one-way: state → hash, on selection change).
  // Clearing the selection on mobile (back arrow) routes back to the index.
  useEffect(() => {
    const next = selectedId ? `#/web/sales-chat/${selectedId}` : '#/web/sales-chat'
    if (window.location.hash !== next) window.location.hash = next
  }, [selectedId])

  // Counts per channel — drive the badge after each tab label so the operator
  // knows where work is queued up without flipping through tabs.
  const counts = useMemo(() => {
    const c = { all: 0, whatsapp: 0, website: 0, members: 0 } as Record<InboxFilter, number>
    convs.forEach((cv) => { c.all += cv.unread; c[cv.source] += cv.unread })
    return c
  }, [convs])

  const filtered = useMemo(() => {
    const byChannel = channel === 'all' ? convs : convs.filter((c) => c.source === channel)
    const q = search.toLowerCase().trim()
    if (!q) return byChannel
    return byChannel.filter(
      (c) =>
        c.customer.name.toLowerCase().includes(q) ||
        c.customer.phone.toLowerCase().includes(q) ||
        c.messages.some((m) => m.body.toLowerCase().includes(q)),
    )
  }, [convs, channel, search])

  // `selected` only resolves when the operator has actively chosen a thread.
  // We DON'T fall back to convs[0] anymore — on mobile that would prevent the
  // "back to inbox" gesture from clearing the thread pane.
  const selected = convs.find((c) => c.id === selectedId) ?? null
  const expired  = selected ? selected.windowRemainingMin <= 0 : false

  // Scroll the thread to the bottom when conversation changes or a message is appended.
  const threadRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight })
  }, [selectedId, selected?.messages.length])

  function appendMessage(body: string, fromTemplate?: string) {
    if (!selected) return
    const next: ChatMessage = {
      id:           `m-${selected.id}-${Date.now()}`,
      kind:         'outbound',
      body,
      atOffsetMin:  0,
      status:       'sent',
      fromTemplate,
    }
    setConvs((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, messages: [...c.messages, next], lastActivityMin: 0 } : c,
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
            {/* Mobile: shown only when no conversation is open. */}
            <aside
              className={[
                'w-full md:w-[340px] shrink-0 border-r border-vintiga-slate-200 bg-vintiga-white flex-col',
                selected ? 'hidden md:flex' : 'flex',
              ].join(' ')}
            >
              <div className="px-vintiga-lg pt-vintiga-lg pb-vintiga-md border-b border-vintiga-slate-200 flex flex-col gap-vintiga-sm">
                <h1 className="typo-title-section font-semibold text-vintiga-slate-900">
                  Sales Chat
                </h1>
                <TextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations"
                  leftIcon={<SearchIcon />}
                />
                <SegmentedControl<InboxFilter>
                  size="sm"
                  aria-label="Inbox channel"
                  value={channel}
                  onChange={setChannel}
                  options={[
                    { value: 'all',      label: <ChannelLabel label="All"     count={counts.all}      active={channel === 'all'} /> },
                    { value: 'whatsapp', label: <ChannelLabel label="Direct"  count={counts.whatsapp} active={channel === 'whatsapp'} /> },
                    { value: 'website',  label: <ChannelLabel label="Website" count={counts.website}  active={channel === 'website'} /> },
                    { value: 'members',  label: <ChannelLabel label="Members" count={counts.members}  active={channel === 'members'} /> },
                  ]}
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
            {/* Mobile: shown only when a conversation is open (no inbox visible). */}
            <section
              className={[
                'flex-1 min-w-0 flex-col bg-vintiga-slate-50',
                selected ? 'flex' : 'hidden md:flex',
              ].join(' ')}
            >
              {!selected && (
                <div className="hidden md:flex flex-1 items-center justify-center text-center px-vintiga-lg">
                  <p className="typo-body-sm text-vintiga-slate-500 max-w-xs">
                    Pick a conversation from the inbox to view it here.
                  </p>
                </div>
              )}
              {selected && (
                <>
                  <header className="px-vintiga-lg py-vintiga-md border-b border-vintiga-slate-200 bg-vintiga-white flex items-center gap-vintiga-md">
                    {/* Mobile back arrow — closes the thread and reveals the inbox. */}
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="md:hidden -ml-1 w-8 h-8 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-600 hover:bg-vintiga-slate-100 bg-transparent border-none cursor-pointer"
                      aria-label="Back to inbox"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <Avatar initials={selected.customer.initials} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="typo-body font-semibold text-vintiga-slate-900 truncate">
                        {selected.customer.name}
                      </p>
                      <p className="typo-caption text-vintiga-slate-500 flex items-center gap-1 min-w-0">
                        <SourcePill source={selected.source} />
                        {selected.customer.phone && (
                          <span className="hidden sm:inline text-vintiga-slate-400 truncate">· {selected.customer.phone}</span>
                        )}
                      </p>
                    </div>
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
                        <MessageBubble key={m.id} msg={m} />
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
        onSend={(body, templateId) => appendMessage(body, templateId)}
        customer={selected?.customer}
      />
    </div>
  )
}
