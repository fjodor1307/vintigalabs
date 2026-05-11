---
name: vintiga-tov
description: Vintiga tone-of-voice rules for UI copy. Trigger when writing button labels, error messages, empty states, screen titles, notifications, microcopy, or any user-facing text inside this repo — especially in `src/prototypes/**` and `src/design-system/**`. Skip for: code comments, commit messages, README/CONTRIBUTING/CHANGELOG docs, and internal notes.
---

# Vintiga tone of voice

Voice distilled from [vintigalabs.com](https://www.vintigalabs.com/). Vintiga talks like an operator who has run the floor — direct, confident, hospitality-aware. Never markety, never patronising.

## Four principles

1. **Pragmatic authority** — sound like you know the work. "Turn every visit into revenue.", not "Drive your KPIs to new heights."
2. **Stakes-clear, not alarmist** — name the problem plainly, then point to the fix. "Disconnected tools quietly leak revenue every shift." Don't shout, don't hedge.
3. **Staff- and guest-first** — write about *your team*, *your managers*, *your guests*. The product serves the room, not the dashboard.
4. **Short, then long** — alternate a punchy line with one explanatory sentence. Avoids both telegram-speak and corporate sprawl.

## Hard rules

- **Sentence case everywhere** — buttons, headers, titles, alerts. Only proper nouns and feature names (Mobile POS, Wine Club, CRM) get caps.
- **Active voice.** "We sent the invoice." not "The invoice has been sent."
- **No jargon, no filler.** Cut "please ensure", "kindly", "in order to", "at this time", "going forward".
- **No exclamation marks** outside genuinely celebratory moments (booking confirmed, membership signed). One per screen, max.
- **Verbs in button labels** — say what happens next. "Book a demo", "View report", "Send invoice". Avoid "Submit", "OK", "Click here".
- **Numbers as numerals** in UI: "3 guests", "€42", "Day 1". Spell out only when starting a sentence.

## Length budgets

| Surface | Budget |
|---|---|
| Button label | ≤ 3 words |
| Screen title | ≤ 5 words |
| Section header | ≤ 6 words |
| Alert / toast title | ≤ 6 words |
| Empty-state headline | ≤ 8 words |
| Empty-state body | ≤ 2 sentences |
| Error message | 1 sentence + 1 recovery action |

## Voice samples to imitate

- Headline: **"Turn every visit into revenue."**
- Section: **"More than just POS, Clubs & Reservations"**
- Body: **"Disconnected tools quietly leak revenue every shift."**
- Confidence beat: **"Built in 2024 with zero technical debt."**
- Operator perspective: **"…build the system from the tasting room out — starting with how staff actually work."**

Notice: declarative, no qualifiers, the user (operator) is the hero.

## Word swaps

See [`references/word-swaps.md`](references/word-swaps.md) for the avoid → use table. Apply it before shipping any user-facing string.

## What this skill enforces when writing copy

1. Run the proposed string against `references/word-swaps.md` — replace any avoid-list phrase.
2. Check capitalisation is sentence case.
3. Check length budget for the surface.
4. Confirm the voice is operator-direct, not marketing-fluffy. If a sentence could appear on any SaaS landing page, rewrite it.
