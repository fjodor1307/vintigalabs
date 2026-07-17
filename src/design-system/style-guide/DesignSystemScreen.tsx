import { useState, useCallback, useEffect } from 'react'
import { PlaygroundProvider, ControlsPanel, usePlaygroundContext } from './Playground'
import { ColorPaletteSection } from './ColorPaletteSection'
import { TypographySection } from './TypographySection'
import { FontWeightSection } from './FontWeightSection'
import { SpacingSection } from './SpacingSection'
import { RadiusSection } from './RadiusSection'
import { ShadowsSection } from './ShadowsSection'
import { IconsSection } from './IconsSection'
import { LogoSection } from './LogoSection'
import { ANIMATION_PAGES } from './AnimationsSection'
import { COMPONENT_PAGES } from './ComponentsSection'
import {
  SearchIcon,
  MenuIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EyeIcon,
  BookOpenIcon,
  ArrowLeftRightIcon,
  BoxIcon,
  SparklesIcon,
  PlusIcon,
  PenIcon,
  BellIcon,
  SidebarIcon,
  ChartIcon,
  PhoneIcon,
} from '@ds/icons/Icons'
import type { LucideIcon } from 'lucide-react'

// ─── Logo ─────────────────────────────────────────────────────────────────────

import { VintigaLogo } from '@ds/shared/VintigaLogo'

function DsLogoIcon() {
  return <VintigaLogo size={24} />
}

function DsLogo() {
  return (
    <div className="flex items-center gap-2">
      <VintigaLogo size={24} />
      <span className="typo-body-sm font-semibold text-vintiga-foreground">Design System</span>
    </div>
  )
}

// ─── Nav data ─────────────────────────────────────────────────────────────────

interface NavLeaf   { id: string; label: string; icon?: LucideIcon }
interface NavSubGrp { label: string; icon?: LucideIcon; items: NavLeaf[] }
interface NavGroup  { label: string; items?: NavLeaf[]; subGroups?: NavSubGrp[] }

const NAV: NavGroup[] = [
  {
    label: 'Foundation',
    items: [
      { id: 'colors',       label: 'Colors',       icon: EyeIcon },
      { id: 'typography',   label: 'Typography',   icon: BookOpenIcon },
      { id: 'font-weight',  label: 'Font Weights', icon: PenIcon },
      { id: 'spacing',      label: 'Spacing',      icon: ArrowLeftRightIcon },
      { id: 'radius',       label: 'Radius',       icon: BoxIcon },
      { id: 'shadows',      label: 'Shadows',      icon: SparklesIcon },
    ],
    subGroups: [
      {
        label: 'Animations',
        icon: SparklesIcon,
        items: [
          { id: 'anim-guidelines',    label: 'Guidelines' },
        ],
      },
    ],
  },
  {
    label: 'Assets',
    items: [
      { id: 'logo',          label: 'Logo',         icon: SparklesIcon },
      { id: 'icons',         label: 'Icons',        icon: BoxIcon },
    ],
  },
  {
    label: 'Components',
    subGroups: [
      {
        label: 'Actions',
        icon: PlusIcon,
        items: [
          { id: 'ds-buttons',      label: 'Buttons' },
          { id: 'ds-icon-buttons', label: 'Icon Buttons' },
          { id: 'ds-ai-suggest-button', label: 'AI Suggest Button' },
        ],
      },
      {
        label: 'Inputs',
        icon: PenIcon,
        items: [
          { id: 'ds-text-fields',      label: 'Text Fields' },
          { id: 'ds-textarea',         label: 'Textarea' },
          { id: 'ds-select',           label: 'Select' },
          { id: 'ds-field',            label: 'Field' },
          { id: 'ds-checkbox',         label: 'Checkbox' },
          { id: 'ds-select-all-checkbox', label: 'Select-All Checkbox' },
          { id: 'ds-radio',            label: 'Radio Group' },
          { id: 'ds-switch',           label: 'Switch' },
          { id: 'ds-rich-text-editor', label: 'Rich Text Editor' },
        ],
      },
      {
        label: 'Feedback',
        icon: BellIcon,
        items: [
          { id: 'ds-alert-soft',   label: 'Alert' },
          { id: 'ds-toast',        label: 'Toast' },
          { id: 'ds-progress',     label: 'Progress' },
          { id: 'ds-empty-states', label: 'Empty States' },
          { id: 'ds-skeletons',    label: 'Skeletons' },
          { id: 'ds-error-states', label: 'Error States' },
          { id: 'ds-no-image-art', label: 'No-Image Placeholder' },
        ],
      },
      {
        label: 'Overlays',
        icon: SidebarIcon,
        items: [
          { id: 'ds-dialog',       label: 'Dialog' },
          { id: 'ds-tooltip',      label: 'Tooltip' },
          { id: 'ds-bottom-sheet', label: 'Bottom Sheet' },
          { id: 'ds-dropdown',     label: 'Dropdown' },
        ],
      },
      {
        label: 'Navigation',
        icon: ChevronRightIcon,
        items: [
          { id: 'ds-navbar',             label: 'Navbar' },
          { id: 'ds-sidebar',            label: 'Sidebar' },
          { id: 'ds-breadcrumb',         label: 'Breadcrumb' },
          { id: 'ds-tabs',               label: 'Tabs' },
          { id: 'ds-segmented-control',  label: 'Segmented Control' },
          { id: 'ds-separator',          label: 'Separator' },
        ],
      },
      {
        label: 'Data Display',
        icon: ChartIcon,
        items: [
          { id: 'ds-cards',    label: 'Cards' },
          { id: 'ds-section-card', label: 'Section Card' },
          { id: 'ds-list-card', label: 'List Card' },
          { id: 'ds-club-card', label: 'Club Card' },
          { id: 'ds-customer-card', label: 'Customer Card' },
          { id: 'ds-records-card', label: 'Records Card' },
          { id: 'ds-card-brand-logo', label: 'Card Brand Logo' },
          { id: 'ds-selection-card', label: 'Selection Card' },
          { id: 'ds-widget',   label: 'Widget' },
          { id: 'ds-kpi-card', label: 'KPI Card' },
          { id: 'ds-media',    label: 'Media' },
          { id: 'ds-avatars',  label: 'Avatars' },
          { id: 'ds-tags',     label: 'Tags' },
          { id: 'ds-pill',     label: 'Pill' },
          { id: 'ds-table',    label: 'Table' },
        ],
      },
      {
        label: 'Mobile Patterns',
        icon: PhoneIcon,
        items: [
          { id: 'ds-screen-header', label: 'Screen Header' },
          { id: 'ds-screen-footer', label: 'Screen Footer' },
          { id: 'ds-pos-tab-bar', label: 'POS Tab Bar' },
          { id: 'ds-pos-navbar', label: 'POS Navbar' },
          { id: 'ds-pos-cart', label: 'POS Cart Button' },
          { id: 'ds-pos-product-card', label: 'POS Product Card' },
        ],
      },
      {
        label: 'Templates',
        icon: BoxIcon,
        items: [
          { id: 'ds-page-template', label: 'Page Template' },
        ],
      },
    ],
  },
]

// ─── Page map ─────────────────────────────────────────────────────────────────

const FOUNDATION_PAGES: Record<string, React.ComponentType> = {
  colors:        ColorPaletteSection,
  typography:    TypographySection,
  'font-weight': FontWeightSection,
  spacing:       SpacingSection,
  radius:        RadiusSection,
  shadows:       ShadowsSection,
  logo:          LogoSection,
  icons:         IconsSection,
}

const PAGE_MAP: Record<string, React.ComponentType> = {
  ...FOUNDATION_PAGES,
  ...ANIMATION_PAGES,
  ...COMPONENT_PAGES,
}

// Deep-link support: the hub links to `#/web/design-system?p=<pageId>` so a
// section card (Foundation / Assets / Components) can open the DS at that place.
function getInitialPage(): string {
  if (typeof window === 'undefined') return 'colors'
  const qi = window.location.hash.indexOf('?')
  if (qi === -1) return 'colors'
  const p = new URLSearchParams(window.location.hash.slice(qi + 1)).get('p')
  return p && PAGE_MAP[p] ? p : 'colors'
}

// ─── Breadcrumb helper ────────────────────────────────────────────────────────

function getBreadcrumb(id: string): { group: string; sub?: string; label: string } | null {
  for (const group of NAV) {
    if (group.items) {
      const item = group.items.find((i) => i.id === id)
      if (item) return { group: group.label, label: item.label }
    }
    for (const sg of group.subGroups ?? []) {
      const item = sg.items.find((i) => i.id === id)
      if (item) return { group: group.label, sub: sg.label, label: item.label }
    }
  }
  return null
}

// Helper: find which subGroup label contains a given page id
function getSubGroupForPage(id: string): string | null {
  for (const group of NAV) {
    for (const sg of group.subGroups ?? []) {
      if (sg.items.some((i) => i.id === id)) return sg.label
    }
  }
  return null
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  activePage,
  onSelect,
  collapsed = false,
}: {
  activePage: string
  onSelect: (id: string) => void
  collapsed?: boolean
}) {
  const [search, setSearch] = useState('')

  // Accordion state — which Component sub-groups are open
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(() => {
    const sg = getSubGroupForPage(activePage)
    return sg ? new Set([sg]) : new Set<string>()
  })

  // Auto-expand sub-group when active page changes to something inside it
  useEffect(() => {
    const sg = getSubGroupForPage(activePage)
    if (sg) {
      setExpandedSubs((prev) => { // eslint-disable-line react-hooks/set-state-in-effect
        if (prev.has(sg)) return prev
        return new Set([...prev, sg])
      })
    }
  }, [activePage])

  const toggleSub = (label: string) => {
    setExpandedSubs((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  const q = search.toLowerCase()

  // ── Collapsed icon rail ────────────────────────────────────────────
  if (collapsed) {
    // Build flat list: Foundation/Assets items + subgroup icons
    const iconItems: { id: string; label: string; icon: LucideIcon; isSubGroup?: boolean }[] = []
    for (const group of NAV) {
      if (group.items) {
        for (const item of group.items) {
          if (item.icon) iconItems.push({ id: item.id, label: item.label, icon: item.icon })
        }
      }
      for (const sg of group.subGroups ?? []) {
        if (sg.icon && sg.items.length > 0) {
          iconItems.push({ id: sg.items[0].id, label: sg.label, icon: sg.icon, isSubGroup: true })
        }
      }
    }

    return (
      <aside className="w-[52px] shrink-0 flex flex-col items-center bg-white border-r border-[#e2e8f0] h-full">
        {/* Logo icon */}
        <div className="flex items-center justify-center h-[57px] shrink-0">
          <DsLogoIcon />
        </div>

        {/* Icon nav */}
        <nav className="flex-1 overflow-y-auto py-2 flex flex-col items-center gap-0.5 w-full px-2">
          {iconItems.map((item) => {
            const Icon = item.icon
            // Active if directly on this page, or (for subgroups) activePage is in that subgroup
            const isActive = item.isSubGroup
              ? NAV.flatMap((g) => g.subGroups ?? [])
                  .find((sg) => sg.label === item.label)
                  ?.items.some((i) => i.id === activePage) ?? false
              : activePage === item.id
            return (
              <button
                key={`${item.label}-${item.id}`}
                type="button"
                title={item.label}
                onClick={() => onSelect(item.id)}
                className={[
                  'flex items-center justify-center w-8 h-8 rounded-[6px] transition-colors cursor-pointer border-none shrink-0',
                  isActive
                    ? 'bg-[#f1f5f9] text-[#0f172a]'
                    : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]',
                ].join(' ')}
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          })}
        </nav>
      </aside>
    )
  }

  return (
    <aside className="w-[248px] shrink-0 flex flex-col bg-white border-r border-[#e2e8f0] h-full">

      {/* ── Logo ── */}
      <div className="flex items-center h-[57px] px-4 shrink-0">
        <DsLogo />
      </div>

      {/* ── Search — Vintiga DS text field style ── */}
      <div className="px-3 py-3 shrink-0">
        <label className="flex items-center gap-2 bg-[#f1f5f9] rounded-[8px] px-3 h-9 border border-transparent focus-within:border-[#0046ad] focus-within:bg-white transition-colors cursor-text">
          <SearchIcon className="w-[14px] h-[14px] text-[#94a3b8] shrink-0" />
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] outline-none min-w-0"
          />
        </label>
      </div>

      {/* ── Nav tree ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
        {NAV.map((group) => {

          /* ── Filter both flat items and sub-groups ── */
          const visibleItems = (group.items ?? []).filter((i) => !q || i.label.toLowerCase().includes(q))
          const visibleSubs  = (group.subGroups ?? [])
            .map((sg) => ({
              ...sg,
              items: sg.items.filter((i) => !q || i.label.toLowerCase().includes(q)),
            }))
            .filter((sg) => sg.items.length > 0)

          if (q && visibleItems.length === 0 && visibleSubs.length === 0) return null

          return (
            <div key={group.label}>
              {/* Group label */}
              <p className="text-[12px] font-medium text-[#64748b] px-2 mb-1 mt-1">
                {group.label}
              </p>
              <div className="space-y-0.5">

                {/* ── Flat leaf items (Colors, Typography, etc.) ── */}
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  const active = activePage === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className={[
                        'flex items-center gap-2.5 w-full text-left px-2 py-[7px] rounded-[6px]',
                        'text-[13px] leading-5 transition-colors cursor-pointer border-none',
                        active
                          ? 'bg-[#f1f5f9] text-[#0f172a] font-medium'
                          : 'text-[#374151] hover:bg-[#f8fafc] hover:text-[#0f172a] font-normal',
                      ].join(' ')}
                    >
                      {Icon && <Icon className="w-4 h-4 shrink-0 text-[#64748b]" />}
                      {item.label}
                    </button>
                  )
                })}

                {/* ── Accordion sub-groups (Animations, Components categories, etc.) ── */}
                {visibleSubs.map((sg) => {
                  const Icon = sg.icon
                  const isOpen = expandedSubs.has(sg.label) || !!q
                  const hasActive = sg.items.some((i) => i.id === activePage)

                  return (
                    <div key={sg.label}>
                      {/* Sub-group accordion header */}
                      <button
                        type="button"
                        onClick={() => !q && toggleSub(sg.label)}
                        className={[
                          'flex items-center gap-2.5 w-full text-left px-2 py-[7px] rounded-[6px]',
                          'text-[13px] leading-5 transition-colors cursor-pointer border-none',
                          hasActive && !isOpen
                            ? 'bg-[#f1f5f9] text-[#0f172a] font-medium'
                            : 'text-[#374151] hover:bg-[#f8fafc] hover:text-[#0f172a] font-normal',
                        ].join(' ')}
                      >
                        {Icon && <Icon className="w-4 h-4 shrink-0 text-[#64748b]" />}
                        <span className="flex-1">{sg.label}</span>
                        {!q && (
                          isOpen
                            ? <ChevronDownIcon className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                            : <ChevronRightIcon className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                        )}
                      </button>

                      {/* Sub-items — indented with left border */}
                      {isOpen && (
                        <div className="ml-[22px] mt-0.5 mb-1 border-l border-[#e2e8f0] pl-2.5 space-y-0.5">
                          {sg.items.map((item) => {
                            const active = activePage === item.id
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => onSelect(item.id)}
                                className={[
                                  'w-full text-left px-2 py-[6px] rounded-[6px]',
                                  'text-[13px] leading-5 transition-colors cursor-pointer border-none',
                                  active
                                    ? 'bg-[#f1f5f9] text-[#0f172a] font-medium'
                                    : 'text-[#374151] hover:bg-[#f8fafc] hover:text-[#0f172a] font-normal',
                                ].join(' ')}
                              >
                                {item.label}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}

              </div>
            </div>
          )
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="px-4 py-3 shrink-0 border-t border-[#e2e8f0]">
        <span className="text-[11px] text-[#94a3b8]">Vintiga Design System · v1.0</span>
      </div>

    </aside>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

// ─── Inner shell — needs to be inside PlaygroundProvider to use context ──────

function DesignSystemInner() {
  const [activePage, setActivePage] = useState(getInitialPage)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const playground = usePlaygroundContext()

  const isComponentPage = activePage.startsWith('ds-')

  const handleSelect = useCallback((id: string) => {
    // Clear before switching — the new section will re-register if it has a playground schema.
    // Section's useLayoutEffect runs after we set activePage, so order is: clear → mount → register.
    playground?.clearControls()
    setActivePage(id)
    setMobileOpen(false)
  }, [playground])

  const PageComponent = PAGE_MAP[activePage]
  const crumb = getBreadcrumb(activePage)

  return (
    <div className="flex h-screen overflow-hidden bg-white">

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop collapsible */}
      <div
        className="hidden lg:block shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out h-screen"
        style={{ width: sidebarOpen ? 248 : 52 }}
      >
        <Sidebar activePage={activePage} onSelect={handleSelect} collapsed={!sidebarOpen} />
      </div>

      {/* Sidebar — mobile slide-in */}
      <div
        className={[
          'fixed lg:hidden inset-y-0 left-0 z-50 h-screen transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <Sidebar activePage={activePage} onSelect={handleSelect} />
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">

        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center h-[57px] px-4 border-b border-[#e2e8f0] shrink-0 bg-white gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-[6px] text-[#374151] hover:bg-[#f1f5f9] border-none bg-transparent cursor-pointer"
            aria-label="Open navigation"
          >
            <MenuIcon className="w-4 h-4" />
          </button>
          <DsLogo />
        </div>

        {/* Content row: preview + optional controls panel */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-white" key={activePage}>
            {/* Breadcrumb bar — desktop, sticky frosted-glass header */}
            <div className="hidden lg:flex sticky top-0 z-30 items-center h-[57px] px-4 gap-3 border-b border-[#e2e8f0] bg-white/75 backdrop-blur-md">
              {/* Sidebar toggle */}
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                className="flex items-center justify-center w-7 h-7 rounded-[6px] border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors cursor-pointer shrink-0"
                aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <SidebarIcon className="w-3.5 h-3.5" />
              </button>

              {/* Vertical separator */}
              <div className="w-px h-4 bg-[#e2e8f0] shrink-0" />

              {/* Breadcrumb */}
              {crumb && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#94a3b8]">{crumb.group}</span>
                  {crumb.sub && (
                    <>
                      <ChevronRightIcon className="w-3 h-3 text-[#cbd5e1]" />
                      <span className="text-[12px] text-[#94a3b8]">{crumb.sub}</span>
                    </>
                  )}
                  <ChevronRightIcon className="w-3 h-3 text-[#cbd5e1]" />
                  <span className="text-[12px] font-medium text-[#374151]">{crumb.label}</span>
                </div>
              )}
            </div>

            <div className={[
              'animate-[fadeUp_0.2s_ease-out]',
              isComponentPage
                ? 'px-8 sm:px-10 py-10'
                : 'max-w-[896px] mx-auto px-8 sm:px-12 py-10',
            ].join(' ')}>
              {PageComponent ? <PageComponent /> : null}
            </div>
          </main>

          {/* Controls panel — only when a component section has registered controls */}
          {isComponentPage && playground?.schema && (
            <div className="hidden lg:block w-[300px] shrink-0 h-full overflow-hidden">
              <ControlsPanel
                schema={playground.schema}
                values={playground.values}
                onValueChange={playground.setValue}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── Public export ────────────────────────────────────────────────────────────

export function DesignSystemScreen() {
  return (
    <PlaygroundProvider>
      <DesignSystemInner />
    </PlaygroundProvider>
  )
}
