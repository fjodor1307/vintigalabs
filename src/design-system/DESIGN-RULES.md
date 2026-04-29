# Vintiga Design System — Design Rules

Rules and patterns for creating new prototype screens. Follow these to maintain visual consistency across all prototypes.

---

## Project Structure

```
src/
├── design-system/          ← shared tokens, components, icons
│   ├── tokens.css          ← all design tokens
│   ├── components/         ← branded Base UI components
│   ├── icons/Icons.tsx     ← Lucide-based icon set
│   ├── shared/             ← ScreenHeader, StatusBar, PhoneFrame, primitives
│   └── style-guide/        ← Design System viewer at #/web/design-system
├── prototypes/             ← one folder per flow (none yet — run `npm run new-prototype`)
├── App.tsx
└── index.css
```

**Import rule:** Prototypes import from `@ds/` (alias for `src/design-system/`), never from other prototypes. When something in a prototype is reusable, promote it to `design-system/components/`.

---

## Layout Templates

### Web Dashboard (sidebar + navbar + content)

```tsx
<div className="flex h-full bg-vintiga-surface font-vintiga-body">
  <Sidebar />
  <div className="flex-1 flex flex-col overflow-hidden">
    <Navbar onMenuToggle={...} />
    <main className="flex-1 overflow-y-auto px-vintiga-lg pb-vintiga-lg">
      {/* sections with gap-vintiga-xl between them */}
    </main>
  </div>
</div>
```

### Web Two-Panel (onboarding / landing pages)

```tsx
<div className="min-h-screen bg-vintiga-surface flex flex-col">
  <nav className="px-vintiga-3xl py-vintiga-lg">{/* logo + nav */}</nav>
  <div className="flex-1 flex items-stretch px-vintiga-3xl py-vintiga-lg gap-vintiga-3xl">
    <div className="w-[480px] shrink-0 flex flex-col px-vintiga-lg">
      {/* Left panel: content vertically centered */}
      <div className="flex-1 flex flex-col justify-center">
        {/* heading, description, CTAs */}
      </div>
    </div>
    <div className="flex-1 bg-vintiga-primary rounded-[32px] flex items-center justify-center">
      {/* Right panel: illustration or visual */}
    </div>
  </div>
</div>
```

### Mobile Screen

```tsx
<div className="flex flex-col h-full bg-vintiga-surface">
  <StatusBar variant="light" />
  <ScreenHeader progress={33} />
  <div className="flex-1 px-vintiga-lg pb-vintiga-lg overflow-y-auto">
    {/* scrollable content */}
  </div>
  <div className="px-vintiga-lg py-vintiga-lg bg-vintiga-surface">
    <button className="w-full bg-vintiga-primary text-vintiga-primary-foreground rounded-vintiga-button py-3.5 typo-body-sm font-semibold">
      Continue
    </button>
  </div>
</div>
```

---

## Spacing

Only use the vintiga spacing scale:

| Token | Value | Usage |
|-------|-------|-------|
| `vintiga-xs` | 4px | Tiny gaps |
| `vintiga-sm` | 8px | Small gaps, button groups |
| `vintiga-md` | 16px | Card gaps, form field gaps, icon+text |
| `vintiga-lg` | 24px | Page padding, card padding |
| `vintiga-xl` | 32px | Major section gaps |
| `vintiga-2xl` | 48px | Large vertical spacing |
| `vintiga-3xl` | 64px | Two-panel outer padding |

**Key patterns:**
- Page content: `px-vintiga-lg pb-vintiga-lg`
- Between major sections: `gap-vintiga-xl`
- Between cards/list items: `gap-vintiga-md`
- Card internal padding: `p-vintiga-lg` (standard) or `p-vintiga-md` (compact)

---

## Typography

| Purpose | Classes |
|---------|---------|
| Page title | `typo-display font-light` |
| Screen title | `typo-title-screen` |
| Section heading | `typo-title-section font-semibold` |
| Subsection | `typo-title-subsection font-semibold` |
| Body text | `typo-body` or `typo-body-sm` |
| Button text | `typo-body-sm font-semibold` |
| Form label | `typo-caption font-semibold` |
| Helper/meta | `typo-caption text-vintiga-foreground-muted` |
| Overline | `typo-caption font-semibold uppercase tracking-wider` |
| Link | `typo-body font-semibold underline text-vintiga-primary` |

**Fonts:** Currently system fonts for both display (`font-vintiga-display`) and body (`font-vintiga-body`). Replace with the Vintiga brand typefaces in `src/design-system/tokens.css` when the brand is set.

---

## Components

### Buttons

| Variant | Classes |
|---------|---------|
| Primary | `bg-vintiga-primary text-vintiga-primary-foreground rounded-vintiga-button px-6 py-2.5 typo-body-sm font-semibold hover:bg-vintiga-primary-hover active:bg-vintiga-primary-active transition-colors` |
| Secondary | `border border-vintiga-primary text-vintiga-primary rounded-vintiga-button px-6 py-2.5 typo-body-sm font-semibold hover:bg-vintiga-primary-soft transition-colors` |
| Ghost | `text-vintiga-primary rounded-vintiga-button px-6 py-2.5 typo-body-sm font-semibold hover:bg-vintiga-surface-element transition-colors` |
| Destructive | `bg-vintiga-accent text-white rounded-vintiga-button px-6 py-2.5 typo-body-sm font-semibold hover:opacity-90 transition-colors` |

All buttons are **pill-shaped** (`rounded-vintiga-button`). Add `opacity-50 cursor-not-allowed` for disabled state.

### Inputs

```
w-full bg-vintiga-surface-element border border-transparent rounded-vintiga-input
px-3 py-2.5 typo-body text-vintiga-foreground placeholder:text-vintiga-foreground-muted
focus:outline-none focus:border-vintiga-primary transition-colors
```

No visible border by default. Border appears on focus.

### Cards

```
border border-vintiga-border rounded-vintiga-card p-vintiga-lg
```

No shadow by default (flat design). Only use shadows for elevation (modals, dropdowns, popovers).

### Icon Circles

```
w-10 h-10 rounded-full bg-vintiga-surface-element flex items-center justify-center
```

Inline icons: `w-5 h-5`. All icons are Lucide-based from `@ds/icons/Icons.tsx`.

### Status Badges

```
inline-flex items-center gap-1.5 px-2.5 py-1 rounded-vintiga-button typo-caption font-semibold
```

- Active: `bg-vintiga-success-soft text-vintiga-success`
- Pending: `bg-vintiga-warning-soft text-vintiga-warning`
- Error: `bg-vintiga-error-soft text-vintiga-error`
- Info: `bg-vintiga-info-soft text-vintiga-info`

---

## Colors

**Never hardcode hex values.** Always use semantic tokens.

| Purpose | Token |
|---------|-------|
| Default background | `bg-vintiga-surface` |
| Element background | `bg-vintiga-surface-element` |
| Secondary background | `bg-vintiga-surface-secondary` |
| Primary text | `text-vintiga-foreground` |
| Muted text | `text-vintiga-foreground-muted` |
| All borders | `border-vintiga-border` |
| Primary action | `bg-vintiga-primary` / `text-vintiga-primary` |
| Accent (destructive) | `bg-vintiga-accent` |

---

## Animations

- **Entrance fade-up:** `animate-[fadeUp_0.5s_ease-out]`
- **Staggered:** Add delay in 0.1s increments: `animate-[fadeUp_0.5s_ease-out_0.1s_both]`
- **Mobile sidebar:** `animate-slide-in-left`
- **Interactive states:** `transition-colors` only (no keyframe animations on hover/active)
- **Hero elements:** `cubic-bezier(0.16, 1, 0.3, 1)` for bouncy card/pill entrances

---

## Responsive Breakpoints

| Breakpoint | Width | Key behavior |
|------------|-------|-------------|
| Below `md` | < 768px | **Mobile view** — full-width, single column, StatusBar + ScreenHeader, fixed bottom CTA |
| `md` and above | ≥ 768px | **Desktop view** — content centered with `max-w-[480px]` (forms/flows) or `max-w-4xl` (dashboards), no StatusBar, desktop header/nav, CTA inline not fixed |
| `lg` | ≥ 1024px | Sidebar collapsible, wider content areas |
| `xl` | ≥ 1280px | Wider grids, more columns |

### Mobile vs Desktop behaviour

Every screen must define **both** mobile and desktop layouts:

**Mobile (below md):**
- Full-width content, single column
- StatusBar + ScreenHeader at top
- Fixed bottom CTA bar
- Touch-sized tap targets (min 44px)

**Desktop (md+):**
- Content constrained: `max-w-[480px] mx-auto` for step-by-step flows, `max-w-4xl mx-auto` for dashboards/overviews
- No StatusBar (desktop doesn't need phone chrome)
- Standard page header or sidebar navigation
- CTA inline within the content, not fixed to bottom
- Can use multi-column layouts (side-by-side cards, two-panel)

### Layout pattern for flows (subscription, onboarding, etc.)

```tsx
{/* Mobile */}
<div className="md:hidden flex flex-col h-full bg-vintiga-surface">
  <StatusBar variant="light" />
  <ScreenHeader progress={33} />
  <div className="flex-1 px-vintiga-lg pb-vintiga-lg overflow-y-auto">
    {/* content */}
  </div>
  <div className="px-vintiga-lg py-vintiga-lg bg-vintiga-surface border-t border-vintiga-border">
    <button className="w-full ...">Continue</button>
  </div>
</div>

{/* Desktop */}
<div className="hidden md:flex flex-col min-h-screen bg-vintiga-surface">
  <header className="px-vintiga-2xl py-vintiga-lg border-b border-vintiga-border">
    {/* logo + progress or breadcrumb */}
  </header>
  <main className="flex-1 w-full max-w-[480px] mx-auto px-vintiga-lg py-vintiga-2xl">
    {/* same content as mobile */}
    <button className="w-full mt-vintiga-xl ...">Continue</button>
  </main>
</div>
```

**Key rule:** Extract the shared content into a component, then wrap it in mobile or desktop layout shells. Don't duplicate the form/content logic.

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-vintiga-none` | 0 | — |
| `rounded-vintiga-input` | 8px | Inputs, alerts, small cards |
| `rounded-vintiga-card` | 16px | Cards, panels, modals |
| `rounded-vintiga-button` | 9999px | Buttons, badges (pill) |

---

## Checklist for New Screens

- [ ] CONTEXT.md exists in the prototype folder with epic, key user stories, and source links
- [ ] JOURNEY.md exists in the prototype folder with all steps mapped
- [ ] Screen route matches the route listed in JOURNEY.md
- [ ] Gaps, open questions, and improvements logged in the prototype's `NOTES.md`
- [ ] Correct layout template (dashboard / two-panel / mobile)
- [ ] Imports from `@ds/`, not from other prototypes
- [ ] All spacing from vintiga scale (no custom px values)
- [ ] All colors from semantic tokens (no hex)
- [ ] Buttons: pill-shaped | Inputs: 8px radius | Cards: 16px radius
- [ ] Typography uses `typo-*` utility classes
- [ ] Mobile: StatusBar + ScreenHeader + fixed bottom CTA
- [ ] Entrance animations: fadeUp with staggered delays
- [ ] Responsive: mobile-first, then `md:` / `lg:` breakpoints for desktop
- [ ] Desktop: content max-width constrained, layout adapts (e.g. side-by-side panels, wider cards)
