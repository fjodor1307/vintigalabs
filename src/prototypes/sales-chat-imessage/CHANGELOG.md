# Sales Chat — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why.

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
