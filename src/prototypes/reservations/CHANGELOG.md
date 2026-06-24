# Reservations — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why.

---

## 2026-06-17 — Fedja + Claude: New prototype — day-view reservations list

Rebuilt the legacy Commerce 7 Reservations screen in the Vintiga design system:

- `ReservationsScreen` — AppSidebar (Reservations active) + Navbar shell, custom header (title + live count, date pill + Today, Insights/Messages icons, List View + More menus, Add), search + Experience/status `FilterDropdown`s, the reservation `Table` (Time · Guests · Name+Avatar · Experience/area · Location/table · Status `Tag` · row Insights + **Check In**), and a slate footer summary bar.
- **Check In** flips a row to "Checked In" live; the status Tag + footer/header counts update.
- `reservationSamples.ts` — six sample bookings for Jun 23, 2026 + status→tone map.
- Wired the sidebar **Reservations** nav item to `#/web/reservations`.
