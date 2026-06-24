# Reservations — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why.

---

## 2026-06-24 — Fedja + Claude: Notes editor modal + trim the More menu

- **Notes are now editable.** Clicking **Schedule Notes** / **Staff Notes** (or the pencil) in the Notes popover opens a **"Notes for {date}"** modal with both note fields + **Cancel / Save Notes**. Saved text shows back in the popover; the modal edits a draft so Cancel discards.
- **Removed "Search From All Reservations"** from the More menu (now: Ad Hoc Reservation · Hold Location · Block Time · Print List).

## 2026-06-24 — Fedja + Claude: Day View + Week View calendar

The **List View / Day View / Week View** toggle is now live — the first two were stubs, now they render a time-grid calendar (`ReservationCalendar.tsx`):

- **Day View** — a single day column. **Week View** — Sun–Sat columns for the week containing the active date.
- Fixed business-hours window (9am–6pm, 30-min slots) down a left time gutter; reservations render as blocks placed by start time + a 90-min default duration (the sample bookings carry no end time).
- **Overlap layout** — concurrent reservations split into side-by-side lanes (classic calendar packing), so the 11:00 / 11:30 / 12:00 cluster reads clearly.
- The header count + scope follow the view: a single day (List / Day) or the whole week (Week). The dark footer summary stays list-only.
- Clicking a block opens the Reservation View page; clicking a day header in Week View drills into that day.

## 2026-06-17 — Fedja + Claude: Add Reservation + Reservation View + hold/block modals

Built the rest of the reservations flow from the Figma designs:

- **Add Reservation page** (`#/web/reservations/add`, Figma 4783-39358/40812) — customer search/select (or walk-in) → reservation details (experience · option · date · time · guests · host · table · location · occasion · notes) with a **live Reservation Summary** rail (customer, experience, date/time, guests, location, total, guest-capacity bar, Reserve/Cancel).
- **Reservation View page** (`#/web/reservations/view`, Figma 4781-28789) — Reservation Details + Order Items table + Order Summary in the main column, a customer card in the rail, Check In + actions menu in the header.
- **Hold Location** (4781-19418) + **Block a Reservation Time** (4781-19163) modals, wired to the More menu.
- New `ResControls` (Select / Stepper / TimeField / TextInput) shared by these.
- Wiring: list **Add** → add page, **row click** → view page, **More → Hold Location / Block Time** → modals. Also `overflow-x-hidden` on the scroll areas as a horizontal-scroll guard.

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
