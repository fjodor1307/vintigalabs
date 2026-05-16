# Experience Timeslots — Journey

Single screen. Two regions. No modals beyond the date-override picker.

## Steps

| Step | What the operator does | Story | Status | Route |
|------|------------------------|-------|--------|-------|
| 1 | Land on the experience's Time Slots tab; sees the current weekly schedule. | EXP-TS-01 | TODO | `#/web/experience-timeslots/editor?id=e1` |
| 2 | Toggle a day on/off (e.g. close on Mondays). | EXP-TS-01 | TODO | (same) |
| 3 | Change a day's hours (`10:00 AM – 5:00 PM`). | EXP-TS-01 | TODO | (same) |
| 4 | Add a second range to a day for AM tours + PM tastings. | EXP-TS-02 | TODO | (same) |
| 5 | Click "Add date override" → pick a date, mark **Closed** or **Custom hours**. | EXP-TS-03 / EXP-TS-04 | TODO | (same — inline, no new screen) |
| 6 | Remove an override. | EXP-TS-03 | TODO | (same) |
| 7 | Save (or auto-save). | — | TODO | (same) |

## Screen plan

```
Reservation Time Slots
Set when guests can book this experience.

Weekly schedule
  Sun ☐  Closed
  Mon ☑  9:00 AM  →  5:00 PM                              [+] [🗑]
  Tue ☑  9:00 AM  →  5:00 PM                              [+] [🗑]
  Wed ☑  9:00 AM  →  12:00 PM                             [+] [🗑]
         2:00 PM  →  5:00 PM                                  [🗑]
  Thu …
  …

Date overrides
Block out or change hours for specific dates.
  [+ Add date override]
  Fri Jul 04  ·  Closed                                        [✕]
  Sun Jun 15  ·  10:00 AM – 2:00 PM only                       [✕]
```

Per-day controls:
- **Checkbox** — bookable that weekday
- **From / To** — single time range; second range expands inline when `+` is pressed
- **`+`** — add another range (max 2 for now — winery AM/PM pattern)
- **`🗑`** — clear all ranges for that day (re-enables the empty `Closed` state)

Override row:
- **Date** — single date (range support deferred — most overrides are single-day)
- **Closed / Custom hours** — radio. Custom hours reveals a time range.

## Gaps & open questions

- Copy-day-to-others (Calendly's duplicate icon) — defer to v2; users can mostly type the same hours.
- Timezone — assumed store-wide setting, not shown here.
- Conflict with bookings already on the calendar when an override is added — out of scope; flag in `NOTES.md`.
- What if every day is unchecked? Show inline "This experience isn't bookable" state.

## Wins vs the existing Products Time Slots tab

| | Current Products prototype | This prototype |
|---|---|---|
| Recurrence | Indefinitely / Until date dropdown | _gone_ — schedule is the truth |
| Per-slot online checkbox | yes | _gone_ — per-experience setting |
| Slots vs ranges | one slot at a time | full ranges |
| Blackouts vs overrides | separate concepts | one "Date overrides" list |
| Card count on screen | 3 | 2 |
