# Reservations — Context

> The why and the what behind this prototype. Read this before opening a screen.

**Source of truth:** Legacy Commerce 7 Reservations screen (screenshot) → rebuilt in Vintiga
**Last synced:** 2026-06-17 by Fedja
**Owner:** Fedja
**Status:** in-progress

---

## Why this exists

The current Reservations list lives in Commerce 7's blue legacy chrome. This prototype rebuilds the day-view reservation list in the Vintiga design system — same information, Vintiga sidebar / navbar / components / tokens — so the team can see how it reads in the new shell before specifying the full feature.

Success: a host can scan the day's bookings, filter by experience/status, and check a party in, all in Vintiga styling.

## Key user stories

- As a host, I see the day's reservations (time, party size, guest, experience, location, status) at a glance.
- As a host, I can search by guest or experience and filter by experience / status.
- As a host, I can check a party in from the list.

## Requirements (from the legacy screen)

- Header: title + live "{n} reservations, {g} guests" count, date control + Today, view switcher, Add, More.
- Toolbar: search + Experience filter + More Filters.
- Table columns: Time · Guests · Name · Experience (+ area) · Location (+ table) · Status · row actions (insights + Check In).
- Footer summary bar: "Reservations: {n}, Guests: {g}".

## Sources

- Legacy screenshot provided 2026-06-17.
- Figma *05. Dashboard* → **🗓️ Reservations** page.
