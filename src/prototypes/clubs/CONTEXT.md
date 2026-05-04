# Clubs — Context

> The why and the what behind this prototype. Read this before opening a screen.

**Source of truth:** Figma — [Dashboard / Clubs](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5079-44185)
**Last synced:** 2026-05-04 by fedja
**Owner:** fedja (djukicfedja@gmail.com)
**Status:** in-progress  <!-- in-progress | approved -->


---

## Why this exists

Wineries and DTC sellers run their direct-to-consumer programmes through clubs — recurring shipments, allocations, members-only releases. The Clubs surface is where the operator sees the health of every club at a glance (member counts, churn, new joiners) and drills into a specific club to manage its offering, membership list, and member-facing emails.

## Who it's for

- **Primary persona:** the winery operator / DTC manager — runs day-to-day club ops.
- Secondary: club designer (sets up tiers, allocations) and customer success (handles on-hold / cancelled members).

## Pillars this advances

- [ ] Pillar 1 — TBD (programme.md not filled in yet)

## Key user stories

- **CL-01** — As an operator I want to see every club's membership health on one screen, so I can spot churn before it spreads.
- **CL-02** — As an operator I want to see top-line counts (active / on-hold / pending / new / canceled) across all clubs, so I have a daily pulse.
- **CL-03** — As an operator I want to filter the club list by status (active / draft / archived), so I can focus on what's live.
- **CL-04** — As an operator I want to add a new club from this screen, so I don't have to dig through settings.

## Requirements & constraints

- Must use Vintiga design system tokens — no inline hex.
- KPI cards must follow the standard `KpiCard` pattern (label + value + circle icon).
- Tab navigation between Clubs / Memberships / Club Emails must preserve the page header + KPIs (shared chrome).

## Open dependencies

- Memberships and Club Emails tabs are placeholders — full screens to come once requirements land.
- Club detail / editor screen is not in this iteration.

## Sources

- **Figma frame:** https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5079-44185
- **Programme pillars:** `_context/programme.md` (not filled in yet)
