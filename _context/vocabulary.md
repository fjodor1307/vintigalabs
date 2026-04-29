# Vocabulary

Shared terms so we mean the same thing across iterations. When you say one of these words, expect Claude to interpret it exactly as defined here. When Claude proposes work, expect it to use this vocabulary.

If a term we use a lot is missing or wrong, edit it here.

---

## Layout & positioning

| Term | Meaning |
| --- | --- |
| **fixed** | `position: fixed` — anchored to the viewport, **does not move on scroll**. Use this when you want a bar/button that's truly locked in place. |
| **sticky** | `position: sticky` — stays at the edge of its **scroll container** until you scroll past it. Note: sticky elements bounce on macOS overscroll. If you want zero motion, use **fixed** or move the element out of the scrolling container. |
| **absolute** | `position: absolute` — positioned relative to the nearest positioned ancestor. Used for popovers, tooltips, dropdowns. |
| **floating** | A free-standing element on top of the page (e.g. a circular FAB at top-right). Usually `fixed`. |
| **anchored** | An element that visually attaches to another (e.g. a popover anchored to its trigger). |
| **span** | "Fill the available width/height of this container." e.g. "the empty state should span the column" → make it `flex-1` / `h-full`. |
| **fill** | Same as span — take the remaining space. |
| **stretch** | The cross-axis equivalent in flex. e.g. a flex row's children stretch vertically by default. |
| **align** | Vertical or horizontal alignment within a parent. "Center the icon" → `items-center justify-center`. |
| **center** | Centered horizontally **and** vertically unless otherwise specified. |
| **flex-1** | Grow to fill the remaining space along the main axis. Only works when the flex parent has explicit height/width. |
| **h-full** | Height: 100% of parent. Use this inside the prototype shells (Shell, ProductLayout). |
| **h-screen** | Height: 100vh. **Do not use** inside the prototype shells — the prototype lives inside the App's reserved area, not the full viewport. Using `h-screen` causes 56px of overflow at the bottom (sidebar items get clipped, sticky bars drift). |
| **min-h-0** | Required on a flex child that needs to shrink below its content size when an `overflow-*` ancestor is present. |
| **scroll container** | The element with `overflow-y-auto` (or similar). Children scroll **inside** it. |

## Scroll behaviour

| Term | Meaning |
| --- | --- |
| **bounce** | The visible jitter/lag of a sticky element during macOS rubber-band overscroll. Fix: take the element out of the scrolling container (don't use sticky). |
| **scroll-hide** | Hide on scroll-down, reveal on scroll-up. Implemented with a capture-phase scroll listener + `translate-y-full`. |
| **rubber-band** | macOS's overscroll bounce animation. Affects sticky, doesn't affect fixed. |

## Component states

These are the canonical state names across the design system. Use these exact words.

| Term | Meaning |
| --- | --- |
| **default** | Normal, idle state. |
| **hover** | Pointer is over the element. |
| **selected** | Currently chosen in a list/group (ListCard, Pill, SegmentedControl). The DS handles colour propagation for `selected` automatically — leading icon, label, and trailing kebab all turn indigo. **Custom action overrides must propagate `selected` themselves.** |
| **disabled** | Non-interactive, faded. |
| **active** | Currently active/in use (e.g. a sidebar nav item for the current page). |
| **loading** / **generating** | In-progress async state. AiSuggestButton uses `generating`. |

## Visual descriptors

| Term | Meaning |
| --- | --- |
| **bordered / borderless** | Has a card border + radius, or doesn't. EmptyState takes `bordered={false}` to float without a card around it. |
| **subtle / solid / outline** | Fill style. Buttons / IconButtons / Tags use these. |
| **tone** | Colour family — `indigo`, `slate`, `amber`, `sky`, etc. |
| **size** | `sm` / `md` / `lg`. Default is `md` unless otherwise stated. |
| **variant** | A design variant within a component (e.g. `filled`, `outline`). |

## Icon positions

| Term | Meaning |
| --- | --- |
| **leading icon** | Icon on the **left** of a row/button (before the label). |
| **trailing icon** / **trailing action** | Icon/element on the **right** of a row/button. |
| **kebab** / **kebab menu** | Three-dot vertical menu (`EllipsisVerticalIcon`), usually trailing on a list row. |
| **ellipsis menu** | Three-dot horizontal menu (`EllipsisIcon`), usually trailing on a header. |

## Layout regions (in this app)

| Term | Where it lives | What it is |
| --- | --- | --- |
| **prototype navbar** / **prototype frame** | `App.tsx → ViewToggle` | The dark slate-800 bar at the very top with BackArrow + Prototype/Design/Flow segmented control. h-14 (56 px). |
| **sidebar** | `Shell.tsx`, `ProductLayout.tsx` | The left navigation column (Dashboard, Sales Chat, Products, etc.). w-60 (240 px) on desktop, overlay drawer below `lg`. |
| **topbar** | `Shell.tsx`, `ProductLayout.tsx` | The white bar with sidebar toggle + bell + Tom Cook. h-16 (64 px). Lives **outside** the scrolling `<main>`. |
| **page header** | inside the editor | The row beneath the topbar that holds breadcrumb + page actions (e.g. Cancel + Save). |
| **right rail** | `RightRail` component | The right sidebar (e.g. Status / Collections / Availability on the product editor). 360 px on desktop, stacks under main on mobile. |
| **content / main** | `<main>` | The scrolling area between the sidebar/right rail. |

---

# Component vocabulary — use the DS, don't reinvent

This is the canonical list of design-system components. **Always check this list before writing inline UI.** If a pattern matches, import the DS component instead of building it locally. If a pattern is missing, propose extracting it into the DS rather than committing an inline implementation.

> Import paths: `@ds/shared/<Name>` (= `src/design-system/shared/<Name>.tsx`). Icons: `@ds/icons/Icons`.

## Layout / shell

- **`Sidebar`** + `SidebarHeader` / `SidebarBody` / `SidebarItem` / `SidebarDivider` / `SidebarFooter` / `SidebarBadge` — composable left-nav primitives.
- **`Navbar`** — top app bar.
- **`PhoneFrame`** — mobile preview shell.
- **`RightRail`** + `RailSection` — right-side stacked rail with bordered sections.
- **`StatusBar`**, **`ScreenHeader`**, **`ScreenFooter`** — mobile screen primitives.

## Navigation

- **`Breadcrumb`** + `BreadcrumbHomeIcon` — `Home > Section > Page` trail. Always use this for breadcrumbs; never inline `<a> > <a> > <span>`.
- **`SegmentedControl`** — the `Prototype | Design | Flow` style toggle. Sizes `sm` and `md`.
- **`Tabs`** (Base UI) — full tab system; SegmentedControl for inline toggles.

## Inputs

- **`TextField`** — text input (with optional `leftIcon`).
- **`Field`** — generic label + control + helper + optional inline action (e.g. AiSuggestButton chip). Wrap any custom input in `Field`.
- **`Checkbox`** / **`Radio`** / **`Switch`**.
- **`OtpInput`** + `OtpInputGroup`.
- **`FilterDropdown`** — checkbox-list filter trigger with Clear/Apply.

## Actions

- **`Button`** — primary actions. Variants: `primary` / `outline` / `subtle`. Sizes: `sm` / `md` / `lg`.
- **`IconButton`** — icon-only button. Same variants/sizes.
- **`AiSuggestButton`** — outline button with sparkles icon + `generating` loading state. Use this everywhere AI assist is offered on a field. Drop into `<Field action={…}>`.

## Data display

- **`Card`** — basic surface container.
- **`SectionCard`** — bordered card with title + optional icon + optional action + children. Use for grouped form content (the white "Website / SEO / etc." sections in the product editor).
- **`ListCard`** — 44px bordered list-item row with leading icon + label + trailing kebab (or custom action). Three states: default / hover / selected. Selected propagates indigo to leading icon, label, and the **default** kebab. If you pass a custom `action`, propagate `selected` yourself.
- **`SelectionCard`** — radio-like pick-one card. No `size` variant in this DS; use `orientation` / `align` / `tone`.
- **`Widget`** + `WidgetHeader` / `WidgetBody` / `WidgetFooter` — dashboard widget shell.
- **`KpiCard`** — single KPI tile with label + value + delta.
- **`Avatar`** + `AvatarGroup`.
- **`Tag`** — labelled chip with tone + variant.
- **`Pill`** — selectable filter chip.
- **`Table`** + `TableHead` / `TableBody` / `TableRow` / `TableHeader` / `TableCell`.

## Overlays

- **`Modal`** + `ModalHeader` / `ModalAlertHeader` / `ModalCenteredHeader` / `ModalBody` / `ModalFooter`.
- **`BottomSheet`** — mobile bottom drawer.
- **`PopoverMenu`** — generic trigger + dropdown menu (View / Duplicate / Delete style). Use this for kebab menus that need actions.
- **`Dropdown`** + `DropdownMenu` / `DropdownItem` / `DropdownSection` / `DropdownSeparator` — lower-level dropdown primitives.
- **`Toast`** — transient notification.
- **`Tooltip`** (Base UI).

## Feedback / state

- **`AlertSoft`** — inline banner.
- **`EmptyState`** — empty-state block. Pass `bordered={false}` for a borderless float; default has a card border. Has `icon` / `title` / `description` / `action` / `secondaryAction` slots.
- **`ErrorState`** — error block with retry.
- **`Skeleton`** + `SkeletonText` / `SkeletonCard` — loading placeholders.

## Brand

- **`VintigaLogo`** — full lockup.
- **`VintigaIconIndigo`** — icon-only mark.

---

## Anti-patterns to avoid

- **Inline breadcrumbs.** Use `Breadcrumb` from `@ds/shared/Breadcrumb`.
- **Inline kebab menus.** Use `PopoverMenu` (with a button trigger) or `ListCard`'s default kebab + `onActionClick`.
- **Inline form fields with custom label markup.** Wrap with `Field`.
- **`h-screen` inside the prototype shells.** Use `h-full`.
- **Sticky topbars in `<main>`.** They bounce. Put the topbar **outside** the scrolling element.
- **Custom segmented buttons.** Use `SegmentedControl`.
- **Bordered "no card here" wrappers around `EmptyState`.** Use `<EmptyState bordered={false} />`.
- **Per-component re-implementations of the App shell.** `Shell` and `ProductLayout` are the two canonical prototype shells; new prototypes should reuse one of them or extract a shared shell into the DS.
