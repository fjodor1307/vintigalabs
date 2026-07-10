# Reservations — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why.

---

## 2026-07-10 — Fedja + Claude: Post-Reserve confirmed state

Wired what happens after **Reserve** on the Add screen (was a no-op):

- **Stay + edit mode** — the page stays open as the saved reservation. A green success banner ("Reservation #1004 confirmed for …") confirms it, the title gains a **Reserved** tag, the breadcrumb flips from *Add Reservation* → *Reservation #1004*, and every field stays editable so staff can immediately adjust host/table/notes.
- The rail's primary button becomes **Save changes** (flips the banner to "Changes saved"); the secondary becomes **Back to reservations**.
- **Back nav** — the confirmation banner carries a **Back to reservations** action (breadcrumbs still work too). Chosen over a header button to avoid duplicating the breadcrumb.
- Reserve is disabled until a customer (or walk-in) is selected.
- **Zero-charge only** — per the Jul 9 review, we only handle no-charge reservations right now, so every experience is priced at **0** ("No charge" across the dropdown, summary and total; the Reserve button drops the amount). The paid flow (reserve → create order → charge card on file) stays deferred in `NOTES.md`; the price model + labelling are kept so a charged experience lights up automatically later.

`AddReservationScreen.tsx`, `experienceOptions.ts`.

## 2026-07-09 — Fedja + Claude: Combined Experience/Option + Notes modal (Jul 9 review)

- **One Experience dropdown** — Experience and Option are merged into a single picker. Variants are flattened ("Wine Tasting · Premium Tasting — $55.00 / guest"); single-variant experiences show just their name (no separate option); free experiences read **"No charge"**. Shared `experienceOptions.ts` drives both the **Add** and **View** reservation screens. Add's summary/total shows "No charge" for zero-cost bookings.
- **Notes modal** — the Schedule Notes pencil in the header popover now opens a **"Notes for Today"** modal (Schedule + Staff notes). Saved notes render in the popover and light a small indicator dot on the Notes button. `NotesModal` added to `ReservationModals.tsx`.

Seeded one experience with variants (Wine Tasting, Lunch) and single-variant ones (Private Tasting, Vineyard Picnic) so both cases show. Paid-reservation order flow + host-list filtering still logged in `NOTES.md`.

## 2026-07-09 — Fedja + Claude: List-view cleanup (Jul 9 review)

Trimmed the reservations header before handing the dev ticket to Donna:

- **"More" menu** now only shows **Block Time** + **Print List**. Removed **Ad Hoc Reservation** (redundant — "Add" already covers the walk-in), **Search From All Reservations** (redundant), and **Hold Location** (unclear purpose — parked; the `HoldLocationModal` component stays in `ReservationModals.tsx`, just unused).
- **Removed the Tasks** popover — no task management yet (comes after promotions).
- **Search now spans all reservations**, not just the day in view — a text query overrides the List/Day/Week date scope. Verified: searching from an empty day surfaces bookings on other days.
- **Notes** popover kept (Schedule + Staff Notes) pending the notes redesign.

`ReservationsScreen.tsx`. Follow-ups (AI/quick-create Add, experience-option variants, host list excludes departed staff, free/paid labelling) logged in `NOTES.md`.

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
