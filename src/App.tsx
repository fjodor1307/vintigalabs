import { useState, useEffect } from 'react'
import { Agentation } from 'agentation'
import { DesignSystemScreen } from './design-system/style-guide/DesignSystemScreen'
import { ReviewMode, decodeComments } from './design-system/shared/ReviewMode'
import { VintigaLogo, VintigaIconNeutral } from './design-system/shared/VintigaLogo'
import { BackArrowIcon, DownloadIcon, SearchIcon, ArrowRightIcon, SunIcon, MoonIcon, ChevronDownIcon, LayoutListIcon, Grid2x2Icon, HistoryIcon, XIcon, ExternalLinkIcon } from './design-system/icons/Icons'
import updatesData from './generated/updates.json'
import {
  allRoutes,
  allEntries,
  prototypeConfigs,
  configForPath,
  frameForPath,
  type EnrichedEntry,
  type PrototypeFrame,
} from './prototypes/_registry'

function useHashRoute() {
  const parseHash = () => {
    // Support ?figmaroute= for Figma capture (avoids hash routing conflict with capture params)
    const figmaRoute = new URLSearchParams(window.location.search).get('figmaroute')
    if (figmaRoute) return `#${figmaRoute}`
    return window.location.hash.replace(/#figmacapture.*$/, '')
  }
  const [hash, setHash] = useState(parseHash)
  useEffect(() => {
    const onHashChange = () => setHash(parseHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash
}

// Design System is a tool, not a prototype — registered directly.
const webScreens: Record<string, React.ComponentType> = {
  '#/web/design-system': DesignSystemScreen,
  ...allRoutes,
}

// Prototypes are categorised by the surface they target: web → CRM (dashboard),
// mobile → POS. The Design System is a separate tool, not a prototype.
type Category = 'CRM' | 'POS'
const CATEGORY_OPTIONS = ['CRM', 'POS', 'Design System', 'Presentations'] as const
type Segment = 'all' | (typeof CATEGORY_OPTIONS)[number]

function categoryForFrame(frame: PrototypeFrame): Category {
  return frame === 'mobile' ? 'POS' : 'CRM'
}

function CategoryBadge({ category }: { category: Category }) {
  if (category === 'POS') {
    return (
      <span className="shrink-0 inline-flex items-center typo-caption font-medium bg-vintiga-indigo-100 text-vintiga-indigo-700 px-2.5 py-1 rounded-vintiga-2xl">
        POS
      </span>
    )
  }
  return (
    <span className="shrink-0 inline-flex items-center typo-caption font-medium bg-vintiga-lime-100 text-vintiga-green-700 px-2.5 py-1 rounded-vintiga-2xl">
      CRM
    </span>
  )
}

// Shareable review-view hash for a prototype entry.
function reviewHashFor(entry: EnrichedEntry): string {
  const pathParts = entry.path.split('/')
  const flowSegment = pathParts.length >= 5 ? pathParts[3] : undefined
  return flowSegment && prototypeConfigs.find((c) => c.slug === entry.slug)?.entries && pathParts.length >= 5
    ? `#/review/${entry.slug}/${flowSegment}`
    : `#/review/${entry.slug}`
}

// Badge (+ "Latest" label on the featured card).
function CardBadgeRow({ category, featured }: { category: Category; featured?: boolean }) {
  return (
    <div className="flex items-center gap-vintiga-sm">
      <CategoryBadge category={category} />
      {featured && (
        <span className="typo-body-sm font-medium text-vintiga-foreground-muted">Latest</span>
      )}
    </div>
  )
}

function CardTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 4).map((t) => (
        <span key={t} className="typo-caption px-2 py-0.5 rounded-full bg-vintiga-surface-element text-vintiga-foreground-muted">
          #{t}
        </span>
      ))}
    </div>
  )
}

// The arrow affordance — a filled indigo square on the featured card, an
// outlined square elsewhere. Opens the shareable review view.
function CardArrow({ entry, featured }: { entry: EnrichedEntry; featured?: boolean }) {
  return (
    <a
      href={reviewHashFor(entry)}
      aria-label="Open shareable review view"
      title="Open shareable review view"
      className={[
        'shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-vintiga-md transition-colors no-underline',
        featured
          ? 'bg-vintiga-indigo-600 text-white hover:bg-vintiga-indigo-700'
          : 'border border-vintiga-border text-vintiga-foreground-muted hover:text-vintiga-foreground',
      ].join(' ')}
    >
      <ArrowRightIcon className="w-5 h-5" />
    </a>
  )
}

function PrototypeLinks({ entry }: { entry: EnrichedEntry }) {
  return (
    <div className="flex items-center gap-vintiga-md">
      <a href={entry.path} className="typo-body-sm font-semibold text-vintiga-primary no-underline hover:underline">Prototype</a>
      <a href={`${entry.path}?view=overview`} className="typo-body-sm font-semibold text-vintiga-primary no-underline hover:underline">Designs</a>
    </div>
  )
}

// Shared card body — badge, title, description, tags, and the
// Prototype / Designs links + arrow. Used by grid cards and list rows.
function CardMeta({ entry, category, featured }: { entry: EnrichedEntry; category: Category; featured?: boolean }) {
  return (
    <>
      <a href={entry.path} className="flex flex-col gap-vintiga-sm no-underline">
        <CardBadgeRow category={category} featured={featured} />
        <h2 className="typo-title-subsection font-semibold text-vintiga-foreground">{entry.name}</h2>
        <p className="typo-body-sm text-vintiga-foreground-muted line-clamp-3">{entry.description}</p>
        <div className="mt-vintiga-xs">
          <CardTags tags={entry.tags} />
        </div>
      </a>
      <div className="mt-vintiga-sm flex items-center justify-between gap-vintiga-sm">
        <PrototypeLinks entry={entry} />
        <CardArrow entry={entry} featured={featured} />
      </div>
    </>
  )
}

// A live, click-through thumbnail of one prototype screen (list view + featured
// card). Clicking launches the prototype at that screen.
function ScreenThumb({ path, frame, height = 168 }: { path: string; frame: PrototypeFrame; height?: number }) {
  const isPhone = frame === 'mobile'
  const innerW = isPhone ? 390 : 1440
  const innerH = isPhone ? 844 : 900
  const scale = height / innerH
  const outerW = Math.round(innerW * scale)
  return (
    <a
      href={path}
      aria-label="Open screen"
      className="shrink-0 block overflow-hidden rounded-vintiga-md border border-vintiga-border bg-vintiga-surface hover:border-vintiga-surface-muted transition-colors"
      style={{ width: outerW, height }}
    >
      <iframe
        src={`${window.location.pathname}${path}?thumbnail=1`}
        title=""
        tabIndex={-1}
        aria-hidden="true"
        style={{ width: innerW, height: innerH, transform: `scale(${scale})`, transformOrigin: '0 0', border: 0, pointerEvents: 'none' }}
      />
    </a>
  )
}

// Large featured "Latest" card for the grid view — indigo-tinted, with a big
// title and a row of live screen thumbnails. Spans two columns (or the full
// width when there are no side cards).
function FeaturedGridCard({ entry, spanFull }: { entry: EnrichedEntry; spanFull: boolean }) {
  const category = categoryForFrame(entry.frame)
  const screens = flowForPath(entry.path)?.paths ?? [entry.path]
  return (
    <div
      className={[
        spanFull ? 'lg:col-span-3' : 'lg:col-span-2',
        'bg-vintiga-indigo-50 dark:bg-vintiga-surface border border-vintiga-indigo-200 dark:border-vintiga-border rounded-vintiga-card p-vintiga-lg flex flex-col gap-5 overflow-hidden',
      ].join(' ')}
    >
      <a href={entry.path} className="flex flex-col gap-6 no-underline">
        <div className="flex flex-col gap-1">
          <CardBadgeRow category={category} featured />
          <h2 className="text-[30px] leading-9 font-medium text-vintiga-foreground">{entry.name}</h2>
        </div>
        <p className="typo-body text-vintiga-foreground-muted line-clamp-2">{entry.description}</p>
      </a>
      <div className="overflow-x-auto flex items-start gap-5">
        {screens.slice(0, 6).map((p) => (
          <ScreenThumb key={p} path={p} frame={entry.frame} height={244} />
        ))}
      </div>
      <div className="flex items-end justify-between gap-vintiga-md">
        <CardTags tags={entry.tags} />
        <div className="flex items-center gap-vintiga-md shrink-0">
          <PrototypeLinks entry={entry} />
          <CardArrow entry={entry} featured />
        </div>
      </div>
    </div>
  )
}

// Plain prototype card (grid side/bottom cards).
function PrototypeCard({ entry, className = '' }: { entry: EnrichedEntry; className?: string }) {
  return (
    <div
      className={`bg-vintiga-surface border border-vintiga-border rounded-vintiga-card p-vintiga-lg flex flex-col gap-vintiga-sm hover:border-vintiga-surface-muted transition-colors ${className}`}
    >
      <CardMeta entry={entry} category={categoryForFrame(entry.frame)} />
    </div>
  )
}

// Catalog filter — "Latest" (everything, newest first) or a single tag.
// `value` is 'latest' or a tag name (without the leading #).
function FilterDropdown({
  value,
  onChange,
  tags,
}: {
  value: string
  onChange: (v: string) => void
  tags: string[]
}) {
  const [open, setOpen] = useState(false)
  const itemClass = (active: boolean) =>
    [
      'w-full text-left px-3 py-2 rounded-vintiga-input typo-body-sm transition-colors',
      active
        ? 'font-semibold text-vintiga-foreground bg-vintiga-surface-element'
        : 'text-vintiga-foreground-muted hover:bg-vintiga-surface-element',
    ].join(' ')
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-vintiga-md border border-vintiga-border bg-vintiga-surface typo-body-sm font-medium text-vintiga-foreground hover:border-vintiga-surface-muted transition-colors"
      >
        {value === 'latest' ? 'Latest' : `#${value}`}
        <ChevronDownIcon className="w-4 h-4 text-vintiga-foreground-muted" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute right-0 mt-1 z-20 min-w-[160px] max-h-[60vh] overflow-y-auto rounded-vintiga-md border border-vintiga-border bg-vintiga-surface shadow-vintiga-md p-1">
            <button
              type="button"
              onClick={() => {
                onChange('latest')
                setOpen(false)
              }}
              className={itemClass(value === 'latest')}
            >
              Latest
            </button>
            {tags.length > 0 && (
              <>
                <p className="px-3 pt-2 pb-1 typo-caption font-semibold uppercase tracking-wide text-vintiga-foreground-muted">
                  Tags
                </p>
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      onChange(t)
                      setOpen(false)
                    }}
                    className={itemClass(value === t)}
                  >
                    #{t}
                  </button>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ── Latest updates modal ───────────────────────────────────────────────────
// A lightweight "what got done" feed for end-of-day reports. Data is generated
// from git history at build time (scripts/generate-updates.mjs → updates.json).
type UpdateItem = { date: string; label: string; pr: number | null; area: string }
const UPDATES = updatesData as { generatedAt: string; repoUrl: string; items: UpdateItem[] }

const AREA_FALLBACK: Record<string, { name: string; category: string }> = {
  builder: { name: 'Builder', category: 'Hub' },
  'design-system': { name: 'Design System', category: 'DS' },
}

function areaMeta(area: string): { name: string; category: string } {
  const entry = allEntries.find((e) => e.slug === area)
  if (entry) return { name: entry.name, category: categoryForFrame(entry.frame) }
  return AREA_FALLBACK[area] ?? { name: area, category: '' }
}

type UpdateRange = 'today' | 'week' | 'lastweek'

function ymd(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function LatestUpdatesModal({ onClose }: { onClose: () => void }) {
  const [range, setRange] = useState<UpdateRange>('today')
  const [area, setArea] = useState<string>('all')
  const [areaOpen, setAreaOpen] = useState(false)

  // Date boundaries (calendar weeks, Monday-start), computed from "now".
  const now = new Date()
  const todayStr = ymd(now)
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  const weekStart = ymd(monday)
  const lastMon = new Date(monday)
  lastMon.setDate(monday.getDate() - 7)
  const lastSun = new Date(monday)
  lastSun.setDate(monday.getDate() - 1)
  const lastStart = ymd(lastMon)
  const lastEnd = ymd(lastSun)

  const inRange = (d: string) =>
    range === 'today' ? d === todayStr : range === 'week' ? d >= weekStart && d <= todayStr : d >= lastStart && d <= lastEnd

  const ranges: { key: UpdateRange; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'lastweek', label: 'Last Week' },
  ]

  const rangeItems = UPDATES.items.filter((i) => inRange(i.date))
  const areasInRange = Array.from(new Set(rangeItems.map((i) => i.area))).sort((a, b) =>
    areaMeta(a).name.localeCompare(areaMeta(b).name),
  )
  // Keep the selected area only while it has items in the current range.
  const activeArea = area !== 'all' && !areasInRange.includes(area) ? 'all' : area
  const shown = activeArea === 'all' ? rangeItems : rangeItems.filter((i) => i.area === activeArea)
  const groupAreas = activeArea === 'all' ? areasInRange : [activeArea]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-vintiga-lg">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40 cursor-default" />
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-vintiga-card bg-vintiga-surface border border-vintiga-border shadow-vintiga-lg p-vintiga-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-vintiga-md">
          <h2 className="typo-title-section font-semibold text-vintiga-foreground">Latest updates</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mr-1 -mt-1 p-1 rounded-vintiga-md text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Range tabs + area dropdown */}
        <div className="mt-vintiga-lg flex items-center justify-between gap-vintiga-md">
          <div className="inline-flex bg-vintiga-surface-element rounded-vintiga-md p-0.5">
            {ranges.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                className={[
                  'px-3 py-1.5 rounded-vintiga-input typo-body-sm transition-colors',
                  range === r.key
                    ? 'bg-vintiga-surface shadow-vintiga-sm font-semibold text-vintiga-foreground'
                    : 'font-medium text-vintiga-foreground-muted hover:text-vintiga-foreground',
                ].join(' ')}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAreaOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={areaOpen}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-vintiga-md border border-vintiga-border bg-vintiga-surface typo-body-sm font-medium text-vintiga-foreground hover:border-vintiga-surface-muted transition-colors"
            >
              {activeArea === 'all' ? 'All' : areaMeta(activeArea).name}
              <ChevronDownIcon className="w-4 h-4 text-vintiga-foreground-muted" />
            </button>
            {areaOpen && (
              <>
                <button type="button" aria-hidden="true" tabIndex={-1} onClick={() => setAreaOpen(false)} className="fixed inset-0 z-10 cursor-default" />
                <div className="absolute right-0 mt-1 z-20 min-w-[180px] max-h-[50vh] overflow-y-auto rounded-vintiga-md border border-vintiga-border bg-vintiga-surface shadow-vintiga-md p-1">
                  {['all', ...areasInRange].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setArea(a)
                        setAreaOpen(false)
                      }}
                      className={[
                        'w-full text-left px-3 py-2 rounded-vintiga-input typo-body-sm transition-colors',
                        a === activeArea
                          ? 'font-semibold text-vintiga-foreground bg-vintiga-surface-element'
                          : 'text-vintiga-foreground-muted hover:bg-vintiga-surface-element',
                      ].join(' ')}
                    >
                      {a === 'all' ? 'All' : areaMeta(a).name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mt-vintiga-lg flex-1 min-h-0 overflow-y-auto">
          {shown.length === 0 ? (
            <p className="typo-body-sm text-vintiga-foreground-muted py-vintiga-xl text-center">
              Nothing shipped in this window.
            </p>
          ) : (
            <div className="flex flex-col gap-vintiga-xl">
              {groupAreas.map((a) => {
                const items = rangeItems.filter((i) => i.area === a)
                if (items.length === 0) return null
                const meta = areaMeta(a)
                const latestPr = items.reduce<number | null>((max, i) => (i.pr && (!max || i.pr > max) ? i.pr : max), null)
                return (
                  <section key={a}>
                    <h3 className="typo-title-subsection font-semibold text-vintiga-foreground">
                      {meta.name} {meta.category && <span className="text-vintiga-foreground-muted">{`{${meta.category}}`}</span>}
                    </h3>
                    <ul className="mt-vintiga-sm flex flex-col gap-1.5 list-disc pl-5">
                      {items.map((i, idx) => (
                        <li key={`${a}-${idx}`} className="typo-body-sm text-vintiga-foreground-muted">
                          {i.label}
                        </li>
                      ))}
                    </ul>
                    {latestPr && (
                      <a
                        href={`${UPDATES.repoUrl}/pull/${latestPr}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-vintiga-md inline-block typo-body-sm font-semibold text-vintiga-primary no-underline hover:underline"
                      >
                        Latest PR
                      </a>
                    )}
                  </section>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-vintiga-lg flex items-center justify-end gap-vintiga-md">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-vintiga-button border border-vintiga-border bg-vintiga-surface typo-body-sm font-semibold text-vintiga-foreground hover:border-vintiga-surface-muted transition-colors"
          >
            Close
          </button>
          <a
            href={`${UPDATES.repoUrl}/pulls?q=is%3Apr`}
            target="_blank"
            rel="noreferrer"
            className="h-10 px-4 inline-flex items-center gap-1.5 rounded-vintiga-button bg-vintiga-primary text-vintiga-primary-foreground typo-body-sm font-semibold hover:bg-vintiga-primary-hover transition-colors no-underline"
          >
            <ExternalLinkIcon className="w-4 h-4" />
            Open Github
          </a>
        </div>
      </div>
    </div>
  )
}

function matchesQuery(entry: EnrichedEntry, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    entry.name.toLowerCase().includes(q) ||
    entry.description.toLowerCase().includes(q) ||
    entry.slug.toLowerCase().includes(q) ||
    entry.tags.some((t) => t.toLowerCase().includes(q))
  )
}

function IndexPage() {
  const [segment, setSegment] = useState<Segment>('all')
  const [query, setQuery] = useState('')
  // Hub-only dark mode (neutral palette). Persisted so it survives navigation.
  const [dark, setDark] = useState(() => localStorage.getItem('vintiga-hub-dark') === '1')
  useEffect(() => {
    localStorage.setItem('vintiga-hub-dark', dark ? '1' : '0')
  }, [dark])
  // Grid (default) vs list layout for the prototype catalog.
  const [view, setView] = useState<'grid' | 'list'>(
    () => (localStorage.getItem('vintiga-hub-view') === 'list' ? 'list' : 'grid'),
  )
  useEffect(() => {
    localStorage.setItem('vintiga-hub-view', view)
  }, [view])
  // Catalog filter — 'latest' (everything) or a single tag. Persisted.
  const [filter, setFilter] = useState<string>(
    () => localStorage.getItem('vintiga-hub-filter') || 'latest',
  )
  useEffect(() => {
    localStorage.setItem('vintiga-hub-filter', filter)
  }, [filter])
  // "Latest updates" modal (end-of-day summary).
  const [updatesOpen, setUpdatesOpen] = useState(false)

  const segments: { value: Segment; label: string }[] = [
    { value: 'all', label: 'All' },
    ...CATEGORY_OPTIONS.map((c) => ({ value: c as Segment, label: c })),
  ]

  // "Design System" and "Presentations" aren't prototypes — selecting them
  // empties the prototype grid (Design System then shows only the DS card;
  // Presentations is a placeholder for now).
  const segmentPrototypes =
    segment === 'Design System' || segment === 'Presentations'
      ? []
      : allEntries.filter(
          (p) =>
            (segment === 'all' || categoryForFrame(p.frame) === segment) && matchesQuery(p, query),
        )

  // Tags available within the current segment (powers the filter dropdown).
  const availableTags = Array.from(
    new Set(segmentPrototypes.flatMap((p) => p.tags)),
  ).sort((a, b) => a.localeCompare(b))

  // If the active tag isn't present in this segment, fall back to "latest".
  const activeFilter = filter !== 'latest' && !availableTags.includes(filter) ? 'latest' : filter

  const sortedPrototypes =
    activeFilter === 'latest'
      ? segmentPrototypes
      : segmentPrototypes.filter((p) => p.tags.includes(activeFilter))

  const showDesignSystem = segment === 'all' || segment === 'Design System'
  const hasFilters = segment !== 'all' || query.length > 0
  const segmentTitle = segment === 'all' ? 'All' : segment

  function clearFilters() {
    setSegment('all')
    setQuery('')
  }

  return (
    // Own scroll container with a stable scrollbar gutter — keeps the content
    // width constant whether or not a vertical scrollbar is showing, so nothing
    // shifts horizontally when you switch tabs or scroll.
    <div className={`${dark ? 'dark bg-[#0a0a0a] ' : 'bg-vintiga-surface '}h-screen overflow-y-auto font-vintiga-body [scrollbar-gutter:stable]`}>
      {/* Fixed, frosted-glass top navbar — mirrors the Design System header. */}
      <header className="sticky top-0 z-30 flex items-center gap-vintiga-lg h-16 px-vintiga-lg sm:px-vintiga-2xl bg-vintiga-surface/75 backdrop-blur-md">
        <a href="#/" aria-label="Vintiga Prototypes" className="shrink-0 no-underline">
          {dark ? <VintigaIconNeutral size={28} /> : <VintigaLogo size={28} />}
        </a>

        <nav aria-label="Categories" className="flex items-center gap-0.5 shrink-0">
          {segments.map((s) => {
            const active = segment === s.value
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  // Design System isn't a prototype category — open it directly.
                  if (s.value === 'Design System') window.location.hash = '#/web/design-system'
                  else setSegment(s.value)
                }}
                aria-current={active ? 'page' : undefined}
                className={[
                  'px-3 py-1.5 rounded-vintiga-md typo-body-sm transition-colors',
                  active
                    ? 'font-semibold text-vintiga-foreground'
                    : 'font-medium text-vintiga-foreground-muted hover:text-vintiga-foreground',
                ].join(' ')}
              >
                {s.label}
              </button>
            )
          })}
        </nav>

        <div className="relative flex-1 min-w-0 max-w-md ml-auto">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vintiga-foreground-muted pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-vintiga-surface-element rounded-vintiga-input border border-transparent focus:border-vintiga-primary focus:outline-none pl-9 pr-3 py-2 typo-body-sm text-vintiga-foreground placeholder:text-vintiga-foreground-muted"
          />
        </div>

        {/* Dark-mode switch (hub only, neutral palette). */}
        <button
          type="button"
          role="switch"
          aria-checked={dark}
          aria-label="Toggle dark mode"
          onClick={() => setDark((d) => !d)}
          className={[
            'shrink-0 relative w-[46px] h-6 rounded-full p-0.5 flex items-center transition-colors',
            dark ? 'bg-[#262626]' : 'bg-vintiga-slate-900',
          ].join(' ')}
        >
          <span
            className={[
              'w-5 h-5 rounded-full bg-white shadow-vintiga-sm flex items-center justify-center text-vintiga-slate-700 transition-transform',
              dark ? 'translate-x-0' : 'translate-x-[22px]',
            ].join(' ')}
          >
            {dark ? <MoonIcon className="w-3 h-3" /> : <SunIcon className="w-3 h-3" />}
          </span>
        </button>

        {/* Latest updates — end-of-day summary of what shipped. */}
        <button
          type="button"
          onClick={() => setUpdatesOpen(true)}
          aria-label="Latest updates"
          title="Latest updates"
          className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-vintiga-md border border-vintiga-border bg-vintiga-surface text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors"
        >
          <HistoryIcon className="w-4 h-4" />
        </button>

        {/* Download repo as a ZIP — handy for dev handoff. */}
        <a
          href="https://github.com/fjodor1307/vintigalabs/archive/refs/heads/main.zip"
          target="_blank"
          rel="noreferrer"
          aria-label="Download repository as ZIP"
          title="Download repository as ZIP"
          className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-vintiga-md border border-vintiga-border bg-vintiga-surface text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors no-underline"
        >
          <DownloadIcon className="w-4 h-4" />
        </a>
      </header>

      <div className="px-vintiga-lg sm:px-vintiga-2xl py-vintiga-xl">

      {/* Catalog sub-header — title + sort + grid/list switch. */}
      {segment !== 'Design System' && (
        <div className="flex items-center justify-between gap-vintiga-md mb-vintiga-lg">
          <h1 className="typo-title-subsection font-semibold text-vintiga-foreground">{segmentTitle}</h1>
          <div className="flex items-center gap-vintiga-sm">
            <FilterDropdown value={activeFilter} onChange={setFilter} tags={availableTags} />
            <button
              type="button"
              onClick={() => setView((v) => (v === 'grid' ? 'list' : 'grid'))}
              aria-label={view === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
              title={view === 'grid' ? 'List view' : 'Grid view'}
              className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-vintiga-md border border-vintiga-border bg-vintiga-surface text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors"
            >
              {view === 'grid' ? <LayoutListIcon className="w-4 h-4" /> : <Grid2x2Icon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Prototype catalog — grid or list. Hidden when Design System tab is active. */}
      {segment !== 'Design System' && (
        sortedPrototypes.length > 0 ? (
        view === 'list' ? (
        <div className="flex flex-col gap-vintiga-lg">
          {sortedPrototypes.map((entry, i) => {
            const category = categoryForFrame(entry.frame)
            const featured = i === 0
            const screens = flowForPath(entry.path)?.paths ?? [entry.path]
            return (
              <div
                key={entry.path}
                className={[
                  'border rounded-vintiga-card p-vintiga-lg flex gap-vintiga-2xl transition-colors',
                  featured
                    ? 'bg-vintiga-indigo-50 dark:bg-vintiga-surface border-vintiga-indigo-100 dark:border-vintiga-border'
                    : 'bg-vintiga-surface border-vintiga-border hover:border-vintiga-surface-muted',
                ].join(' ')}
              >
                <div className="w-[280px] shrink-0 flex flex-col gap-vintiga-sm">
                  <CardMeta entry={entry} category={category} featured={featured} />
                </div>
                <div className="flex-1 min-w-0 overflow-x-auto flex items-center gap-vintiga-md">
                  {screens.slice(0, 8).map((p) => (
                    <ScreenThumb key={p} path={p} frame={entry.frame} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        ) : (
        <div className="flex flex-col gap-vintiga-lg">
          {/* Featured "Latest" card + up to two side cards. */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-vintiga-lg">
            <FeaturedGridCard entry={sortedPrototypes[0]} spanFull={sortedPrototypes.length <= 1} />
            {sortedPrototypes.length > 1 && (
              <div className="flex flex-col gap-vintiga-lg">
                {sortedPrototypes.slice(1, 3).map((entry) => (
                  <PrototypeCard key={entry.path} entry={entry} className="flex-1" />
                ))}
              </div>
            )}
          </div>
          {/* The rest, in a uniform grid. */}
          {sortedPrototypes.length > 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-vintiga-lg">
              {sortedPrototypes.slice(3).map((entry) => (
                <PrototypeCard key={entry.path} entry={entry} />
              ))}
            </div>
          )}
        </div>
        )
      ) : (
        <div className="border-2 border-dashed border-vintiga-border rounded-vintiga-card p-vintiga-3xl flex flex-col items-center justify-center text-center gap-vintiga-md">
          <p className="typo-title-subsection font-semibold text-vintiga-foreground">
            {hasFilters ? 'No prototypes match these filters' : 'No prototypes yet'}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="typo-body-sm font-semibold text-vintiga-primary hover:underline"
            >
              Clear filters
            </button>
          ) : (
            <p className="typo-body text-vintiga-foreground-muted max-w-md">
              Run <code className="typo-body-sm bg-vintiga-surface-element px-1.5 py-0.5 rounded-vintiga-input">npm run new-prototype &lt;slug&gt;</code> to scaffold one.
            </p>
          )}
        </div>
      )
      )}

      {/* Design System (its own category). */}
      {showDesignSystem && (
        <section className="mt-vintiga-2xl">
          <h2 className="typo-caption font-semibold text-vintiga-foreground-muted uppercase tracking-wide mb-vintiga-md">
            Design System
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-vintiga-lg">
            <a
              href="#/web/design-system"
              className="bg-vintiga-surface border border-vintiga-border rounded-vintiga-card p-vintiga-lg flex flex-col gap-vintiga-sm hover:border-vintiga-surface-muted transition-colors no-underline"
            >
              <h3 className="typo-title-subsection font-semibold text-vintiga-foreground">
                Design System
              </h3>
              <p className="typo-body-sm text-vintiga-foreground-muted">
                Tokens, typography, colours, components
              </p>
              <span className="typo-body-sm font-semibold text-vintiga-primary mt-vintiga-sm">
                Open →
              </span>
            </a>
          </div>
        </section>
      )}
      </div>

      {updatesOpen && <LatestUpdatesModal onClose={() => setUpdatesOpen(false)} />}
    </div>
  )
}

// Returns the flow (ordered screen paths) that contains the given hashPath, or null.
function flowForPath(hashPath: string): { prefix: string; paths: string[] } | null {
  const config = configForPath(hashPath)
  if (!config) return null
  const entry = config.entries.find((e) =>
    hashPath.startsWith(e.path.substring(0, e.path.lastIndexOf('/') + 1)),
  )
  if (!entry) return null
  const prefix = entry.path.substring(0, entry.path.lastIndexOf('/') + 1)
  const paths = Object.keys(config.routes).filter((k) => k.startsWith(prefix))
  return { prefix, paths }
}

function prettyScreenName(path: string, prefix: string): string {
  const slug = path.substring(prefix.length)
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

type View = 'prototype' | 'overview'

// The live prototype renders with no builder chrome — the Prototype / Designs
// choice lives on the home-page card. This minimal "Prototypes" back link is
// only used on the builder's own Designs (overview) page.
function BackButton() {
  return (
    <a
      href="#/"
      aria-label="Back to prototypes"
      className="fixed top-4 left-4 z-50 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-vintiga-surface border border-vintiga-border shadow-vintiga-sm typo-body-sm font-semibold text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors no-underline"
    >
      <BackArrowIcon className="w-4 h-4" />
      Prototypes
    </a>
  )
}

const PHONE_W = 390
const PHONE_H = 844
const WEB_THUMB_W = 480
const WEB_INNER_W = 1440
const WEB_INNER_H = 900

function OverviewGrid({ flow, inPhoneFrame }: { flow: { prefix: string; paths: string[] }; inPhoneFrame: boolean }) {
  const webScale = WEB_THUMB_W / WEB_INNER_W
  const webThumbH = Math.round(WEB_INNER_H * webScale)
  return (
    <div
      className="min-h-screen bg-vintiga-surface-secondary pt-vintiga-2xl px-vintiga-lg pb-28"
    >
      <div className="mx-auto">
        <div className="flex flex-wrap gap-vintiga-2xl justify-start">
          {flow.paths.map((p) => {
            const src = `${window.location.pathname}${p}?thumbnail=1`
            const outerW = inPhoneFrame ? PHONE_W : WEB_THUMB_W
            const outerH = inPhoneFrame ? PHONE_H : webThumbH
            const scale = inPhoneFrame ? 1 : webScale
            const innerW = inPhoneFrame ? PHONE_W : WEB_INNER_W
            const innerH = inPhoneFrame ? PHONE_H : WEB_INNER_H
            const frameClass = inPhoneFrame
              ? 'rounded-[40px] shadow-vintiga-lg group-hover:shadow-xl'
              : 'rounded-[20px] shadow-vintiga-md group-hover:shadow-vintiga-lg ring-1 ring-vintiga-border'
            const label = prettyScreenName(p, flow.prefix)
            return (
              <a
                key={p}
                href={p}
                aria-label={`Open ${label} screen`}
                className="group flex flex-col gap-1 cursor-pointer no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintiga-primary rounded-[4px]"
                style={{ width: outerW }}
              >
                <div
                  className={`relative bg-vintiga-surface overflow-hidden transition-shadow ${frameClass}`}
                  style={{ width: outerW, height: outerH }}
                >
                  <iframe
                    src={src}
                    title={label}
                    tabIndex={-1}
                    style={{
                      width: innerW,
                      height: innerH,
                      transform: scale === 1 ? undefined : `scale(${scale})`,
                      transformOrigin: '0 0',
                      border: 0,
                      pointerEvents: 'none',
                    }}
                  />
                  <div className="absolute inset-0" aria-hidden="true" />
                </div>
                <span className="mt-vintiga-md typo-body-sm font-semibold text-vintiga-foreground group-hover:text-vintiga-primary transition-colors">
                  {label}
                </span>
                <span className="typo-caption text-vintiga-foreground-muted">{p}</span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function App() {
  const hash = useHashRoute()
  const [rawPath, query = ''] = hash.split('?')
  const hashPath = rawPath
  const params = new URLSearchParams(query)

  // Shareable review mode: #/review/<slug>[/<flow>]
  if (rawPath.startsWith('#/review/')) {
    const [slug, flow] = rawPath.substring('#/review/'.length).split('/')
    const sharedComments = decodeComments(params.get('c'))
    return <ReviewMode slug={slug} flow={flow} sharedComments={sharedComments} />
  }

  const viewParam = params.get('view')
  const view: View = viewParam === 'overview' ? 'overview' : 'prototype'
  const isThumbnail = params.get('thumbnail') === '1'
  const Screen = webScreens[hashPath]

  const frame = frameForPath(hashPath)
  const showInPhoneFrame = frame === 'mobile'

  if (Screen && isThumbnail) {
    return (
      <div className={showInPhoneFrame ? 'w-[390px] h-[844px] flex flex-col bg-vintiga-surface' : 'w-full h-screen'}>
        <Screen />
      </div>
    )
  }

  const flow = flowForPath(hashPath)

  if (Screen) {
    // Designs (overview) — a builder page, so it keeps the "Prototypes" back link.
    if (view === 'overview' && flow) {
      return (
        <>
          <OverviewGrid flow={flow} inPhoneFrame={showInPhoneFrame} />
          <BackButton />
        </>
      )
    }
    // The live prototype renders with no builder chrome.
    if (showInPhoneFrame) {
      return (
        <div className="min-h-screen bg-vintiga-surface-secondary flex items-center justify-center py-vintiga-xl">
          <div className="w-[390px] h-[844px] rounded-[40px] shadow-vintiga-lg overflow-hidden bg-vintiga-surface flex flex-col">
            <Screen />
          </div>
          {import.meta.env.DEV && <Agentation />}
        </div>
      )
    }
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-1 min-h-0">
          <Screen />
        </div>
        {import.meta.env.DEV && <Agentation />}
      </div>
    )
  }

  return <IndexPage />
}

export default App
