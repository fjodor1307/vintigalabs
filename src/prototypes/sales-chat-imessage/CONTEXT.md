# Sales Chat (iMessage / Sendblue) — Context

> iMessage-first sales chat for Vintiga, modelled on Sendblue's API. Replaces the older WhatsApp-style prototype.

**Source of truth:** Jun 4 2026 Design Review — Jim/Geoff/Fedja agreed to pivot from WhatsApp to iMessage / Sendblue
**Last synced:** 2026-06-12 by Fedja
**Owner:** Fedja (djukicfedja@gmail.com)
**Status:** in-progress

---

## Why this exists

Wineries' customers are overwhelmingly on iPhone — iMessage outperforms SMS on both deliverability (~70–80% read rate vs SMS) and engagement, and skips the US 10DLC SMS-marketing compliance overhead. We pivot the sales-chat prototype to iMessage-first with SMS auto-fallback for Android contacts.

Quote from the Jun 4 review:

> *Jim:* "Get rid of the WhatsApp integration and focus on Send Blue or iMessage. Apple-first audience. We get away from all the SMS rules and regulations we have to adhere to."

## How iMessage from a CRM actually works (the ToS caveat — read this)

Apple does **not** offer a public iMessage Business API. Sendblue and similar providers (Beeper, iMess) run **farms of Mac minis** signed into Apple IDs that send/receive iMessage via Messages.app automation. The CRM hits their REST API; the Mac actually sends the iMessage.

- **Pro:** real blue bubbles, tapback reactions, read receipts, voice memos, group chat, link previews, contact cards — the full Apple Messages UX.
- **Pro:** automatic SMS fallback when the recipient isn't iMessage-reachable.
- **Con:** technically against Apple's Terms of Service. Apple could in principle shut down sender accounts. Hasn't happened at scale (Sendblue has run since ~2020) but it's a real operational risk Legal should sign off on.
- **Alternative paths considered but rejected:**
  - **Messages for Business** (Apple-official) — *inbound-only*, customer must initiate from Apple Maps/Spotlight. Doesn't fit Vintiga's outbound sales-chat use case.
  - **SMS-only via Twilio** — no ToS risk but loses blue bubbles + adds 10DLC compliance.

The team accepted the Sendblue trade-off on Jun 4. This prototype is built against that decision.

## Who it's for

- **Primary persona:** the Vintiga winery agent / tasting-room host handling 1:1 customer conversations
- Secondary: marketing user who configures quick replies and (later) AI agent prompts

## Pillars this advances

- **Direct-to-consumer relationship** — sales chat is where high-intent customers land
- **Apple-first platform** — congruous with the wider product positioning

## What's modelled (Sendblue feature parity)

The data shape and UI map to real Sendblue API concepts:

| Sendblue concept | Where it appears in the prototype |
|---|---|
| `evaluate_service` (iMessage reachable?) | `ChatContact.iMessageCapable` — drives composer pill colour, header subtitle, and right-rail channel chip |
| Per-message channel (iMessage / SMS / RCS) | `ChatMessage.channel` — bubble colour is blue for iMessage outbound, green for SMS outbound |
| Automatic SMS fallback | A single thread renders mixed iMessage + SMS bubbles when fallback happened |
| Tapback reactions (heart / 👍 / 👎 / 😂 / ‼️ / ❓) | `ChatMessage.reactions[]` — rendered as overlapping circle badges on the bubble corner |
| Read receipts | `MessageStatus = 'read'` — "Read · 11:14 AM" line under the latest read outbound message |
| Typing indicators | `ChatConversation.typing` — bouncing three-dot bubble |
| Voice memos | `VoiceMessage.durationSec` — playback bubble with simulated waveform |
| Photo attachments | `ImageMessage.src` + caption |
| Link previews (Open Graph) | `LinkMessage.preview` — thumbnail + title + description + host |
| Contact sharing (vCard) | `ContactMessage.contact` — embedded vCard-style block |
| Scheduled send | "Schedule send" affordance in the composer (UI only — not wired) |
| AI agent on iMessage | Per-conversation `aiAgent` toggle in the thread header; `ChatMessage.fromAi` flags messages the agent sent |
| Quick replies (snippet library) | `QUICK_REPLIES[]` + the `QuickReplyPicker` — replaces WhatsApp's variable-templating |

## What's NOT modelled (yet)

- Real Sendblue API wiring (this is a pure UI prototype)
- Group iMessage / SMS — only 1:1 threads
- Tapback authoring (long-press menu) — reactions render when present in fixtures, but the agent can't add new ones in the UI
- Voice-memo recording — the mic button is decorative
- Attachment composer (photos / contacts) — the `+` button is decorative
- Schedule-send picker — the button is a stub
- Workflow builder / multi-step AI agent flows
- Analytics dashboards

## Open dependencies

- **Sendblue commercial / Apple ToS review** — owner: Jim. Required before this leaves prototype.
- **Backend integration design** (which CRM events trigger outbound, how inbound webhooks land in the inbox, conversation assignment) — owner: Geoff / Milad.
- **AI agent product design** — what prompts ship, where the agent gates, how the human takes over mid-thread.

## Sources

- Jun 4 2026 design review transcript
- Sendblue product page — https://www.sendblue.com
- Sendblue docs — https://docs.sendblue.com
- Internal: legacy `sales-chat` prototype (WhatsApp Business shape) — keep for reference, deprecated

## Deeper materials → `_context/` subfolder

Not populated yet — drop API integration notes, screenshots from Sendblue's product, and any legal sign-off correspondence in `_context/` once they exist.
