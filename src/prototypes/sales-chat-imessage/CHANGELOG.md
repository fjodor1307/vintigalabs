# Sales Chat (iMessage / Sendblue) — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why.

## 2026-06-12 — Fedja + Claude: Pivot from WhatsApp to iMessage / Sendblue (Jun 4 design review)

Cloned the legacy `sales-chat` prototype (WhatsApp Business shape) into `sales-chat-imessage` and rebuilt it end-to-end against Sendblue's product model. Per the Jun 4 review, WhatsApp doesn't fit the North American winery audience — iMessage does. CONTEXT.md documents the Sendblue Mac-mini-farm approach and the Apple ToS caveat.

**Data layer (`chatSamples.ts`)** — every message carries a `channel` (iMessage / SMS / RCS) so a single thread can transparently mix bubble colours when fallback happens. Contacts carry `iMessageCapable` (mirrors Sendblue's `evaluate_service`). New message variants: `text`, `image`, `voice` (with `durationSec`), `link` (with Open Graph preview), `contact` (vCard). Reactions are Apple's six tapbacks. AI-sent messages flagged via `fromAi`.

**Screen (`SalesChatScreen.tsx`)**:
- **Inbox column** — search + filter tabs (All / iMessage / SMS / Unread). Row shows avatar, channel dot, last-message preview, unread badge, "AI handling" sub-line when the agent is on.
- **Thread** — blue bubbles for iMessage outbound, green for SMS outbound, gray for inbound. Tapback reactions render as overlapping pill badges on bubble corners. Voice memo bubbles show a play button + simulated waveform + duration. Image messages render as rounded thumbnails with an optional caption. Link messages render an OG-style preview card with thumbnail + title + description + host. Contact messages render a vCard block. Typing-indicator bubble (three bouncing dots) when the customer is typing. Read receipt ("Read · 11:14 AM") under the latest read outbound message.
- **Composer** — channel pill above the input ("Will send as iMessage" blue / "Will send as SMS · Android" green) auto-derived from the contact. Plus / Quick-replies / Mic icon buttons; send button only when there's a draft. "Schedule send" affordance pinned top-right.
- **Header** — AI agent toggle (per-conversation switch), call + more buttons, capability subtitle ("iMessage · falls back to SMS" or "SMS only · Android device").
- **Right rail** — contact card with avatar, segment chip, Call/Profile actions, Messaging section (channel, city, tags), Lifetime value (spend + orders), Quick actions list.

**Quick replies (`QuickReplyPicker.tsx`)** — replaces the WhatsApp `TemplatePicker`. Sendblue-style snippet library with category tabs (Greeting / Sales / Service / Club / Compliance) and a search box. No `{{1}}` variables — quick replies are plain text the operator can edit after insertion.

**Removed** — the WhatsApp 24-hour customer-service window (no equivalent in iMessage/SMS), template variable system, WhatsApp channel filter.

---

## 2026-05-28 — Fedja + Claude: Channel tabs, Compliance templates, responsive shell

Follow-ups from the May 28 review with Donna.

**Channels.** `ChatConversation` gains `source: 'whatsapp' | 'website' | 'members'`. A `SegmentedControl` above the inbox (**All · Direct · Website · Members**) filters by source with per-tab unread badges. Each conversation row's pill now reflects its actual source instead of the hard-coded "WhatsApp" — green dot for direct WhatsApp, indigo for the website chat widget, violet for the members My Account page. Seeded two new conversations: an anonymous *Website visitor* asking about shipping + gift wrap (Website channel) and *Priya Iyer* asking about her June allocation (Members channel).

**Templates.**
- New `compliance` category + **Age verification** template pinned to the top: *"Hi {{1}}, before we chat about anything alcohol-related — can you confirm you're over 21? Reply YES to continue."* — covers the wine-compliance gating Donna raised.
- `MessageTemplate.variables` refactored from a flat `string[]` into structured `{ label, fillFrom? }[]`. The picker reads `fillFrom` on open and seeds the input from the active customer's profile (first name, full name, city, phone, segment). Pre-filled fields show an *"Auto-filled from customer profile — edit if needed"* helper so the operator knows where the value came from.
- Category badges on the picker now cover the new Compliance tone (amber).

**Composer.** When the 24-hour service window is expired we now show a slim *"Session expired — templates only. **Open templates**"* strip instead of the full-width orange CTA + button — cleaner per Donna's *"simpler the better"* note.

**Responsive.** Below `md` (768px) the layout drops to a one-pane stack: inbox only, tap a conversation → thread (with a back arrow that clears the selection and routes the hash back to `/sales-chat`). Right rail hides below `lg` (1024px); the in-rail *View customer profile* button stays as the path to the customer page. Desktop layout unchanged.

---

## 2026-05-11 — Fedja + Claude: Scaffold Sales Chat (WhatsApp Cloud API model)

First pass at a WhatsApp Business–style agent inbox. Three-pane layout: conversation list (left) · message thread (center) · customer context (right). Composer behavior is gated by the 24h customer service window:

- Inside the window — free-form text input, send button, attachment / emoji / mic placeholders.
- Outside the window — composer is locked with an inline notice; the only path is opening the **Template Picker** modal, which lists pre-approved templates by category (marketing / utility / authentication / service), surfaces variables `{{1}}`, `{{2}}` for the agent to fill in, and previews the rendered message before sending.

Status ticks (sent / delivered / read) render on outgoing bubbles using `CheckIcon` / `CheckCheckIcon`. Read state uses `vintiga-indigo-500` to stay on-brand.

The prototype is pure UI — no real BSP wiring. Fixture data lives in `chatSamples.ts` with three conversations: one inside the window, one with a few minutes left, one fully expired.

Why: we want to feel the Cloud API's hard constraints (24h window, template-only outbound after expiry) before committing to an integration.

## 2026-06-10 — Cloned from `sales-chat`

Created as an iteration clone via `npm run clone-prototype`.
