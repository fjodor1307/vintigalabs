# Onboarding — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.

---

## 2026-04-27 — claude: rebuild dashboard as first-run empty state

Restructured `DashboardScreen` to match Figma 5029:3094 — the proper first-time-user shell:

- Page header: "Dashboard" + Woodinville location dropdown + Today date dropdown
- KPIs widget with "Set Goals" CTA holding 4 KPI cards with goal-progress bars (zero state)
- Staff Performance widget (empty state)
- Sales pace + 7-day daily breakdown bar-chart placeholder
- Three-up: Conversion / Top products / Inventory empty states
- Reviews + Customers (with primary "Add customer" / secondary "Import" CTAs)
- Bottom KPI strip (avg. ticket / repeat guests / club tier mix)

Inline `GoalKpi` and `PageDropdown` helpers — small enough to live next to the screen rather than in the DS.

---

## 2026-04-27 — claude: welcome modal on first dashboard visit

Added `WelcomeModal` (Figma 5029:3070) — hero image with floating close button + title + body copy. Auto-opens once on `#/web/onboarding/dashboard`, dismissal stored in `sessionStorage` so it doesn't keep popping up. Added a "Replay welcome" outline button in the dashboard header for quick re-testing.

---

## 2026-04-27 — claude: initial scaffold from Figma

Built the full six-screen onboarding flow from the linked Figma frames:

- `SignInScreen` — split layout, returning-user form, link to sign-up
- `SignUpScreen` (step 1/2) — credentials form with back arrow + step indicator
- `BusinessDetailsScreen` (step 2/2) — business name / type / location / phone + T&C
- `WelcomeScreen` — full-bleed acknowledgement after submit
- `EmailPreviewScreen` — welcome-email template rendered as a screen
- `DashboardScreen` — first-session app shell (Sidebar + Navbar + Widget) as the post-approval landing

Shared `SplitLayout` component handles the two-column form / hero-image pattern. Reuses DS primitives throughout (Button, TextField, Checkbox, Sidebar, Navbar, Widget, VintigaLogoIndigo). Hash routing under `#/web/onboarding/*`.
