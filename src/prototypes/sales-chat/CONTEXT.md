# Sales Chat — Context

> WhatsApp Business Platform–style agent inbox for the Vintiga merchant.

**Source of truth:** N/A — exploratory prototype to test the WhatsApp Cloud API model in our shell.
**Last synced:** 2026-05-11 by Fedja
**Owner:** Fedja Djukic (djukicfedja@gmail.com)
**Status:** in-progress

---

## Why this exists

We want to validate whether running sales conversations through WhatsApp's Business Platform (Cloud API) feels right inside the Vintiga dashboard — both for inbound replies and for outbound, template-driven re-engagement. The prototype mirrors the constraints the real API imposes so a merchant can feel them before we commit.

## Who it's for

- **Primary persona:** the Vintiga merchant / shop agent handling 1:1 customer conversations
- Secondary: marketing user who configures the templates the agent picks from

## Pillars this advances

- Direct-to-consumer relationship — sales chat is where high-intent customers land

## Key WhatsApp Business Platform constraints we surface

The prototype is designed around the actual rules of the Cloud API, so the feel transfers:

1. **24-hour customer service window.** Once a customer messages the business, the agent has 24 hours of free-form replies. After that, only pre-approved **template messages** can be sent until the customer replies again.
2. **Template categories.** Each template belongs to a category (`marketing`, `utility`, `authentication`, `service`) — pricing and approval rules differ per category. We surface category on the template picker.
3. **Variables.** Templates contain `{{1}}`, `{{2}}` placeholders the agent fills before sending. We render a tiny form for that.
4. **Delivery + read receipts.** Single / double / blue double-check semantics. We render them.

## Out of scope (for now)

- Real BSP wiring (Twilio / 360dialog) — pure UI prototype
- Template authoring / submission flow — the catalog is static
- Media (image / document) outbound — placeholder icon only
- Multi-agent assignment / SLAs

## Sources

- Meta — WhatsApp Business Platform docs (Cloud API, message templates, conversation pricing)
