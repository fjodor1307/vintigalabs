# Membership Lifecycle — spec for the next cycle

> Raised by **Dejan** (dev) — the original ticket left the status transitions
> under-specified. This doc unifies the gaps so engineering can implement the
> state machine without guessing. Statuses marked **Decided** are reflected in
> the prototype today; **Proposed** items need a PM 👍 before they're built.
>
> Last updated: 2026-06-13 · Owner: Fedja + Jim

---

## 1. The four statuses

A membership stores a **base status** plus optional **hold dates** and a
**join date**. The *displayed* status is derived from those — it's never stored
as "on hold" directly (see [`holdStatus.ts`](holdStatus.ts)).

| Status | Meaning | Stored or derived? |
|--------|---------|--------------------|
| **Pending** | Signed up but not yet earning benefits — either outstanding requirements, or a future join date. | Stored (base) |
| **Active** | Live membership: receives allocations, member pricing, club releases. | Stored (base) |
| **On Hold** | Temporarily paused. Derived from hold dates (see §4). | Derived |
| **Cancelled** | Ended. No future releases. | Stored (base) |

---

## 2. When is a membership created Pending vs Active?  *(the main gap)*

**Proposed rule** — a membership is **Active on creation** only when *all* of
these are true:

1. **Join date is today or in the past** (see §3 for future dates)
2. **A payment method is on file** (or the club is fee-free / pay-in-person)
3. **Age is verified** (US alcohol compliance — already modelled via `ageVerified`)
4. Any club-specific signup requirements are satisfied

If *any* is unmet, it's created **Pending**, with a **reason** so staff know
what's blocking:

- `Pending · Outstanding requirements` — missing card, unverified age, incomplete signup
- `Pending · Scheduled to start {join date}` — everything's set, just waiting for the date (see §3)

> The prototype already hints at this: a Pending member shows the "No card on
> file" empty state on the Payment Method card. We're formalising *why* a
> membership is Pending into an explicit reason.

**Open for PM:** is age-verification a hard gate for Active, or can a membership
go Active and get flagged for verification at first pickup? (Affects whether
tasting-room signups are Active immediately.)

### 2.1 Create-time behaviour by club type  *(decided Jun 24 review)*

The active/pending decision and whether money moves *on create* depends on the
club type:

| Club type | Charges on create? | Active on create when… | Otherwise Pending |
|-----------|--------------------|------------------------|-------------------|
| **Member Choice** (account-credit) | **Yes** — first contribution charged immediately | card on file **and** charge succeeds | no card → Pending · card declined → Pending (card stays on file) |
| **Curated Bottle** (curated) | No — charges per release | Pickup + card · Shipping + card + address | Pickup no card · Shipping missing card **or** address |
| **Rewards** (membership) | No on create — fee taken on activation | same requirement rules as Curated | missing requirements |
| **Traditional** (Commerce 7) | n/a | — excluded from the Vintiga enrolment picker | — |

**Member Choice is the only club that charges the moment you hit Create.** The
charge fires regardless of join date (past or future) — staff may pick a date
purely to set the billing cycle, but we still verify the card works *now*. The
create action therefore shows a confirmation modal naming the card + amount; a
declined card still creates the membership in **Pending** (card on file) so the
charge can be retried by saving.

**Activation is Save-driven.** Adding a card to a pending membership doesn't
activate it — it makes it "ready". Hitting **Save** prompts the charge-&-activate
confirmation. This keeps charging a deliberate, top-level action rather than a
side-effect of editing.

---

## 3. Future join date  *(Dejan's question)*

> *"If membership join date is in the future I assume we should create it in
> pending state and then move it to active when the date comes?"*

**Yes — with one clarification.** Create it **Pending**, because the member
should not receive allocations or member pricing before the start date. On the
join date a **system** transition flips it to **Active** (logged in history as
"Activated · by System").

To keep Pending from conflating two very different situations, tag the reason:

- Future join date, everything else complete → **`Pending · Scheduled to start {join date}`** (not "outstanding requirements")
- Future join date **and** missing requirements → show both reasons; it can't auto-activate until the requirements are also met *and* the date arrives.

This mirrors the hold model exactly: **date-driven transitions are System
events.** A future *hold* keeps a membership Active until its start; a future
*join* keeps it Pending until its start. The membership "isn't really a
membership yet" before the join date, so Pending (not Active) is the honest
state.

**Edge case for PM:** if the join date passes but requirements are still unmet,
it stays Pending (blocked) and does **not** auto-activate. Confirm that's the
desired behaviour.

---

## 4. How "On Hold" works  *(Decided — shipped in the prototype)*

A hold has a **start** date and an optional **end** date. Status is derived
from where today sits:

| Start | End | Displayed | Filter bucket | Membership receiving releases? |
|-------|-----|-----------|---------------|-------------------------------|
| Past | set | **Hold Until {end}** | On Hold | No — resumes on end date |
| Past | — | **On Hold** | On Hold | No — until lifted |
| Future | set | **Active** + "Hold scheduled {range}" | Active | Yes, until start |
| Future | — | **Active** + "Hold from {start}" | Active | Yes, until start |

- A **future-dated hold leaves the membership Active** until the start arrives.
- **Auto-resume:** a hold with an end date flips back to Active on that date (System event).
- **Lift hold:** staff can remove a hold manually anytime (resumes immediately).
- Editing the hold dates is captured in **Membership History** (Put on Hold / Future Hold Scheduled / Hold Updated / Hold Lifted) with before→after dates.

**Open for PM:**
- When a hold auto-resumes, do skipped releases get **back-filled** or are they
  simply missed? (Most wineries skip — confirm.)
- Can a membership be **cancelled while on hold**, or must it resume first?

---

## 5. How "Cancel" works  *(partly Decided)*

- Cancelling sets base status → **Cancelled** with a **cancellation date** and a
  **reason + notes** (the History sample already shows "Other; new partner
  objects to drinking").
- Cancelled is terminal for auto-processing — no future releases.

**Open for PM:**
- Is there a **Re-Activate** path from Cancelled (the History sample implies
  yes — "Re-Activated by Jim Secord"), and does it require re-collecting
  requirements (card, age)?
- Is cancellation **immediate**, or effective at the **end of the current
  commitment / billing period**? (Commerce 7 supports end-of-term cancels.)

---

## 6. State machine (proposed)

```
                    requirements met
                    + join date ≤ today
   ┌──────────┐  ───────────────────────▶  ┌──────────┐
   │ PENDING  │                             │  ACTIVE  │
   │          │  ◀───────────────────────   │          │
   └──────────┘    (never goes back to       └──────────┘
        │           pending once active)       │   ▲
        │                                       │   │ auto-resume (end date)
        │ join date in future                   │   │ or lift hold
        │ → stays Pending, auto-                ▼   │
        │   activates on date (System)     ┌──────────┐
        │                                  │ ON HOLD  │  (derived from hold
        │                                  │          │   dates; future hold
        │                                  └──────────┘   still shows Active)
        ▼                                       │
   ┌──────────┐  ◀──────────────────────────────┘
   │CANCELLED │   cancel (immediate or end-of-term — TBD §5)
   └──────────┘
        │
        └─ Re-Activate? (TBD §5) ──▶ ACTIVE / PENDING
```

Transitions triggered by **System** (date-driven, auto-logged): future join →
Active, hold start → On Hold, hold end → Active. Everything else is a **staff**
action and logged with the operator's name.

---

## 7. Summary of open questions for PM

1. **Active gate:** is age-verification a hard requirement for Active, or verify-at-first-pickup? (§2)
2. **Stuck-pending:** future join date passes but requirements unmet → stays Pending, no auto-activate. Confirm. (§3)
3. **Skipped releases on hold:** back-filled or missed on auto-resume? (§4)
4. **Cancel while on hold:** allowed, or must resume first? (§4)
5. **Re-Activate from Cancelled:** supported? Re-collect requirements? (§5)
6. **Cancel timing:** immediate vs end-of-term? (§5)

Once PM answers these, the state machine in §6 is fully specified and the
remaining transitions can be built in the next cycle.
