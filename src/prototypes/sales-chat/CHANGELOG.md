# Sales Chat — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why.

---

## 2026-05-11 — Fedja + Claude: Scaffold Sales Chat (WhatsApp Cloud API model)

First pass at a WhatsApp Business–style agent inbox. Three-pane layout: conversation list (left) · message thread (center) · customer context (right). Composer behavior is gated by the 24h customer service window:

- Inside the window — free-form text input, send button, attachment / emoji / mic placeholders.
- Outside the window — composer is locked with an inline notice; the only path is opening the **Template Picker** modal, which lists pre-approved templates by category (marketing / utility / authentication / service), surfaces variables `{{1}}`, `{{2}}` for the agent to fill in, and previews the rendered message before sending.

Status ticks (sent / delivered / read) render on outgoing bubbles using `CheckIcon` / `CheckCheckIcon`. Read state uses `vintiga-indigo-500` to stay on-brand.

The prototype is pure UI — no real BSP wiring. Fixture data lives in `chatSamples.ts` with three conversations: one inside the window, one with a few minutes left, one fully expired.

Why: we want to feel the Cloud API's hard constraints (24h window, template-only outbound after expiry) before committing to an integration.
