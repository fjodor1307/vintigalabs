# Reservations — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why.

---

## 2026-06-17 — Fedja + Claude: Guest panel + header polish

- **Bulb → "Get To Know" side panel.** Each row's bulb opens a right slide-in `GuestPanel` (identity + loyalty/orders/LTV, four preference cards, Most Purchased + Notes empty states), rebuilt from the legacy panel. Added guest contact + loyalty fields to `reservationSamples`.
- **Header polish** (feedback): the List View / More dropdown triggers now use `rounded-vintiga-md` (not a full pill), and the date pill / Today / Add / dropdown triggers are all a uniform 40px tall.

## 2026-06-17 — Fedja + Claude: Header controls wired (from legacy screenshots)

Built out the header controls to match the legacy behaviour:

- **Date picker** — the date pill opens a `MiniCalendar` month-grid popover (prev/next month, selectable day, indigo selected). Picking a day updates the label; only the sample day (Jun 23) has bookings, so other days read an empty state. **Today** resets to Jun 23.
- **Tasks** (clipboard icon) → "Your Tasks" popover ("No tasks assigned…").
- **Notes** (chat icon) → "Schedule Notes" (with edit) + "Staff Notes" popover.
- **List View** menu → List / Day / Week View with a check on the active one (label reflects the choice).
- **More** menu → Ad Hoc Reservation · Search From All Reservations · Hold Location · Block Time · Print List (with icons).
- New local `Popover` (generic content popover) + `MiniCalendar` helpers.

## 2026-06-17 — Fedja + Claude: New prototype — day-view reservations list

Rebuilt the legacy Commerce 7 Reservations screen in the Vintiga design system:

- `ReservationsScreen` — AppSidebar (Reservations active) + Navbar shell, custom header (title + live count, date pill + Today, Insights/Messages icons, List View + More menus, Add), search + Experience/status `FilterDropdown`s, the reservation `Table` (Time · Guests · Name+Avatar · Experience/area · Location/table · Status `Tag` · row Insights + **Check In**), and a slate footer summary bar.
- **Check In** flips a row to "Checked In" live; the status Tag + footer/header counts update.
- `reservationSamples.ts` — six sample bookings for Jun 23, 2026 + status→tone map.
- Wired the sidebar **Reservations** nav item to `#/web/reservations`.
