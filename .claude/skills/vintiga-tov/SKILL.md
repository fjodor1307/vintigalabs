---
name: vintiga-tov
description: Vintiga tone-of-voice rules for UI copy. Trigger when writing button labels, error messages, empty states, screen titles, notifications, microcopy, or any user-facing text inside this repo — especially in `src/prototypes/**` and `src/design-system/**`. Skip for: code comments, commit messages, README/CONTRIBUTING/CHANGELOG docs, and internal notes.
---

# Vintiga tone of voice

Voice distilled from [vintigalabs.com](https://www.vintigalabs.com/) (refreshed 2026-07-06). Vintiga talks like an operator who has run the floor — direct, confident, hospitality-aware. Every line promises an outcome. Never markety, never patronising.

## Four principles

1. **Outcome-first** — every headline names what the operator gets, not what the software does. "Serve More Guests, Faster." "Fill More Tastings." "Bring Guests Back." Features are the supporting sentence, never the promise.
2. **Pragmatic authority** — sound like you've run the floor. "…build the system from the tasting room out — starting with how staff actually work, how guests actually buy." Name a problem in one plain sentence, then point to the fix: "Most wineries manage disconnected tools."
3. **Staff- and guest-first** — write about *your team*, *your guests*, *every employee*. "Help every employee deliver a more personal experience." The product serves the room, not the dashboard.
4. **Short, then long** — alternate a punchy line with one explanatory sentence. Avoids both telegram-speak and corporate sprawl.

## Signature constructions

These shapes recur across the site — reach for them before inventing new ones:

- **Turn X into Y** — the house move. "Turn every visit into revenue." "Turn visits into membership." "Turn Great Experiences Into Five-Star Reviews."
- **Verb-first outcome headline** — open with Serve / Know / Fill / Grow / Bring / Delight / Keep + the outcome: "Know Every Guest", "Keep the Conversation Going".
- **Em-dash qualifier** — make the promise, then defuse the objection after an em dash: "Drive more from every transaction—without slowing down service." "…all powered by your guest data."
- **Two-beat punch** — two short mirrored sentences: "Spend Less. Sell More." "More Than a Tech Stack. A Growth Platform."
- **The independence run** — a plain "No X. No Y. No Z." when drawing a line: "No PE rollup. No forced migrations. No decisions made by shareholders who've never set foot in a tasting room."

## Hard rules

- **Title Case for headings, buttons, CTAs, and feature names** — "Book a Demo", "See Your Savings", "Grow Wine Club Membership", "Membership, Reimagined". Short connector words (a, and, for, in, of, the, to, with) stay lowercase mid-title: "View Vintiga in Action".
- **Sentence case for body copy and narrative subheads.** Story-style subheads read as sentences and take a period: "Guests discover your winery." "Deliver an unforgettable tasting."
- **Active voice.** "We sent the invoice." not "The invoice has been sent."
- **No jargon, no filler.** Cut "please ensure", "kindly", "in order to", "at this time", "going forward".
- **No exclamation marks** outside genuinely celebratory moments (booking confirmed, membership signed). One per screen, max.
- **Verbs in button labels** — say what happens next. "Book a Demo", "View Pricing", "See Your Savings". Avoid "Submit", "OK", "Click here".
- **Numbers as numerals** in UI: "3rd visit", "$4,820", "14 visits", "Day 1". Spell out only when starting a sentence.

## Length budgets

| Surface | Budget |
|---|---|
| Button label (in-product) | ≤ 3 words |
| Marketing CTA | ≤ 5 words ("View Vintiga in Action") |
| Screen title | ≤ 5 words |
| Section header | ≤ 6 words |
| Alert / toast title | ≤ 6 words |
| Empty-state headline | ≤ 8 words |
| Empty-state body | ≤ 2 sentences |
| Error message | 1 sentence + 1 recovery action |

## Voice samples to imitate

- Hero eyebrow: **"Turn every visit into revenue."**
- Headline: **"The Guest Experience Platform for Wineries"**
- Outcome headline: **"Serve More Guests, Faster"**
- Body with qualifier: **"Drive more from every transaction—without slowing down service."**
- Confidence beat: **"Built in 2026 with zero technical debt."**
- Independence: **"No PE rollup. No forced migrations."**
- Operator perspective: **"…build the system from the tasting room out—starting with how staff actually work, how guests actually buy."**

Notice: declarative, no hedging, the operator is the hero, and every promise is concrete (guests, visits, revenue — not "value").

## Word swaps

See [`references/word-swaps.md`](references/word-swaps.md) for the avoid → use table. Apply it before shipping any user-facing string.

## What this skill enforces when writing copy

1. Run the proposed string against `references/word-swaps.md` — replace any avoid-list phrase.
2. Check capitalisation: Title Case for headings/buttons/CTAs/feature names, sentence case for body and narrative subheads.
3. Check length budget for the surface.
4. Prefer a signature construction (Turn X into Y, verb-first outcome, em-dash qualifier) over a novel phrasing.
5. Confirm the voice is operator-direct, not marketing-fluffy. If a sentence could appear on any SaaS landing page, rewrite it.
