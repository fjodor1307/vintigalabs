# Sales Chat — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why.

---

## 2026-05-11 — Fedja + Claude: Template buttons + marketing opt-in

Two of the highest-impact gaps from the v1 scaffold:

- **Interactive buttons on templates.** `MessageTemplate` now carries up to 3 buttons (quick-reply or CTA URL/phone). Outbound bubbles render them — CTAs are real anchors that open in a new tab, quick-replies are clickable in the prototype so we can simulate the customer tapping one. A simulated tap appends an inbound message and resets the 24h window.
- **Marketing consent on customers.** `ChatCustomer.marketingConsent` (`opted-in` / `opted-out` / `pending`) drives a new badge in the thread header + right rail, and gates the `marketing` category in the Template Picker — marketing templates are disabled with a "Blocked — needs marketing opt-in" hint when the customer hasn't opted in. Added a new utility template "Marketing opt-in request" the agent can send to ask. Tapping its "Yes, opt me in" / "No thanks" quick-replies flips the customer's consent state.

Fixture coverage: Jane (opted-in), Marcus (opted-in), Sofía (opted-out), Ethan (pending) — so a tester can land on each state.

Why: these were the two most visible WhatsApp Business Platform rules missing from v1 — marketers won't trust the prototype without consent enforcement, and templates without buttons feel like SMS, not WhatsApp.

---

## 2026-05-11 — Fedja + Claude: Scaffold Sales Chat (WhatsApp Cloud API model)

First pass at a WhatsApp Business–style agent inbox. Three-pane layout: conversation list (left) · message thread (center) · customer context (right). Composer behavior is gated by the 24h customer service window:

- Inside the window — free-form text input, send button, attachment / emoji / mic placeholders.
- Outside the window — composer is locked with an inline notice; the only path is opening the **Template Picker** modal, which lists pre-approved templates by category (marketing / utility / authentication / service), surfaces variables `{{1}}`, `{{2}}` for the agent to fill in, and previews the rendered message before sending.

Status ticks (sent / delivered / read) render on outgoing bubbles using `CheckIcon` / `CheckCheckIcon`. Read state uses `vintiga-indigo-500` to stay on-brand.

The prototype is pure UI — no real BSP wiring. Fixture data lives in `chatSamples.ts` with three conversations: one inside the window, one with a few minutes left, one fully expired.

Why: we want to feel the Cloud API's hard constraints (24h window, template-only outbound after expiry) before committing to an integration.
