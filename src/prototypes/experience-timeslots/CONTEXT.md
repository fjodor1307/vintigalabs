# Experience Timeslots — Context

> Focused exploration of the Time Slots tab on the Experience product page.
> Goal: simplify weekly schedule + exceptions into the shortest possible flow
> for a winery operator setting up bookable reservation times.

**Source of truth:** [Vintiga design review with Jeff — May 14, 2026](../products/CONTEXT.md)
**Last synced:** 2026-05-16 by Fedja
**Owner:** Fedja (djukicfedja@gmail.com)
**Status:** in-progress

---

## Why this exists

The Time Slots editor inside the Products prototype is doing too many jobs at once (recurring schedule + weekly slots + blackouts + display-on-website toggles). Chain Reaction's PM feedback and Jeff's May 14 review both pointed to the same problem: it's hard to tell what the source of truth is at a glance. This is a side-by-side prototype where we strip the editor to the **smallest possible surface** that still answers "when is this experience bookable?" — then layer back only what's earning its keep.

## Who it's for

- **Primary persona:** Winery operator / tasting-room manager (not a developer). Knows when they're open this month, doesn't want to map it onto an abstract recurrence model.
- Secondary: Vantage / iOS POS — consumes the resolved slots, no editing.

## Key user stories

Anchored in the Vintiga experiences epic (see Products prototype `CONTEXT.md`).

- **EXP-TS-01** — As an operator, I want to set the bookable hours for each weekday so guests can book online.
- **EXP-TS-02** — As an operator, I want to set a **second range** on a day (e.g. AM tours / PM tastings) so split shifts work.
- **EXP-TS-03** — As an operator, I want to **close a specific date** (Christmas, private event) without rewriting the weekly schedule.
- **EXP-TS-04** — As an operator, I want to **override hours for a specific date** (Sunday brunch 10–2 instead of the usual 9–5) without creating a new experience.
- **EXP-TS-05** — As Vantage, I want to render the resolved schedule on the storefront so guests pick from accurate times.

## Requirements & constraints

- **Calendly-style UI** wins the Mobbin survey across Calendly, GoDaddy, Zoom, User Interviews, HoneyBook. Day rows + time ranges + "date overrides" is the simplest, most-cloned pattern.
- **No recurrence modal.** Charma / Cron / Google Calendar style "Repeats every N weeks, ends after N occurrences" is overkill for "when are we open." The schedule is the current truth; if it changes, operators edit it.
- **No separate blackout dates list.** "Date overrides" covers both "closed that day" and "different hours that day" — one mental model.
- **No display-on-website toggle per slot.** A whole experience is on/off; per-slot online toggles confused operators in the May 14 review.
- **Multiple ranges per day.** Mandatory — tasting rooms genuinely run AM tours + PM tastings.

## Out of scope (deliberately)

- Recurrence with stop date (covered by Products prototype's existing tab — we'll cross-link findings)
- Granularity / minimum-slot rules — operators decide times directly; no "15-min vs 30-min" debate
- Online/phone-only per-slot — moves to a per-experience setting if needed
- Capacity per slot — handled by seating capacity in Experience Details

## What "best UX" research turned up (Mobbin synthesis)

Searched `web` platform via Mobbin MCP — 12 references reviewed. Patterns ranked:

1. **Calendly** — Sun→Sat list, checkbox per day, time range, `+` for additional ranges, side panel of date overrides. **Cleanest.**
2. **GoDaddy Appointments** — Same as Calendly minus the date overrides. Too thin.
3. **User Interviews / Zoom** — Like Calendly with timezone + connected calendar. Overkill for a single tasting room.
4. **HoneyBook** — Calendly + override modal with full date picker. Good override pattern, borrow that.
5. **Luma / Charma / Cron / Google Calendar** — Recurrence modal pattern. Powerful but the wrong tool for "weekly hours."

Winning pick: **Calendly's pattern, trimmed.** See JOURNEY.md.

## Sources

- **Mobbin search:** `web` platform, query "weekly time slots admin editor reservations"
- **May 14 design review transcript** — see Products prototype `_context/` if archived
- **Commerce 7 Reservation Time Slots** — reference for what we're replacing
- **Sibling prototype:** [`src/prototypes/products/`](../products/) — full experience editor, includes the current Time Slots tab we're iterating away from

## Raw paste — Mobbin findings

```
Calendly: weekly hours list. Each day: checkbox + start/end + plus icon for
add range + duplicate icon. Side panel "Add date overrides" with calendar.

GoDaddy: same weekly list, no overrides. Slightly cleaner visual.

HoneyBook: weekly list on left, "Add date override" opens a modal: pick
date(s) on a calendar, then set time availability or mark closed.

Charma / Cron / Google Calendar: recurrence modal. Repeat every N, Days of
week pills, Ends Never/On/After. Powerful but the wrong tool for this.

Luma: bulk-create preview ("Repeats weekly for 6 weeks → DEC 9, DEC 16,
JAN 6 …") — keep in mind for future schedule scenarios but not for v1.
```
