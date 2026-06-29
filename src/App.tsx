import { useState, useEffect } from 'react'
import { Agentation } from 'agentation'
import { DesignSystemScreen } from './design-system/style-guide/DesignSystemScreen'
import { ReviewMode, decodeComments } from './design-system/shared/ReviewMode'
import { VintigaLogo, VintigaIconNeutral } from './design-system/shared/VintigaLogo'
import { BackArrowIcon, DownloadIcon, SearchIcon, ArrowRightIcon, SunIcon, MoonIcon } from './design-system/icons/Icons'
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

  const segments: { value: Segment; label: string }[] = [
    { value: 'all', label: 'All' },
    ...CATEGORY_OPTIONS.map((c) => ({ value: c as Segment, label: c })),
  ]

  // "Design System" and "Presentations" aren't prototypes — selecting them
  // empties the prototype grid (Design System then shows only the DS card;
  // Presentations is a placeholder for now).
  const filteredPrototypes =
    segment === 'Design System' || segment === 'Presentations'
      ? []
      : allEntries.filter(
          (p) =>
            (segment === 'all' || categoryForFrame(p.frame) === segment) && matchesQuery(p, query),
        )

  const showDesignSystem = segment === 'all' || segment === 'Design System'
  const hasFilters = segment !== 'all' || query.length > 0

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

      {/* Prototype grid — hidden when the Design System tab is active. */}
      {segment !== 'Design System' && (
        filteredPrototypes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-vintiga-lg">
          {filteredPrototypes.map((entry) => {
            const category = categoryForFrame(entry.frame)
            // Derive the flow segment from the path — e.g. `#/web/subscription-v2/a/choose-plan` → `a`
            const pathParts = entry.path.split('/')
            const flowSegment = pathParts.length >= 5 ? pathParts[3] : undefined
            const reviewHash = flowSegment && prototypeConfigs.find((c) => c.slug === entry.slug)?.entries && entry.path.split('/').length >= 5
              ? `#/review/${entry.slug}/${flowSegment}`
              : `#/review/${entry.slug}`
            return (
              <div
                key={entry.path}
                className="relative bg-vintiga-surface border border-vintiga-border rounded-vintiga-card p-vintiga-xl flex flex-col gap-vintiga-sm hover:border-vintiga-primary transition-colors"
              >
                <a href={entry.path} className="flex flex-col gap-vintiga-sm no-underline">
                  <div className="flex items-start gap-vintiga-sm">
                    <h2 className="flex-1 min-w-0 typo-title-subsection font-semibold text-vintiga-foreground">
                      {entry.name}
                    </h2>
                    <CategoryBadge category={category} />
                  </div>
                  <p className="typo-body-sm text-vintiga-foreground-muted line-clamp-3">
                    {entry.description}
                  </p>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-vintiga-xs">
                      {entry.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="typo-caption text-vintiga-foreground-muted bg-vintiga-surface-element px-2 py-0.5 rounded-full"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
                <div className="mt-vintiga-sm flex items-center justify-between gap-vintiga-sm">
                  <div className="flex items-center gap-vintiga-md">
                    <a href={entry.path} className="typo-body-sm font-semibold text-vintiga-primary no-underline hover:underline">
                      Prototype
                    </a>
                    <a href={`${entry.path}?view=overview`} className="typo-body-sm font-semibold text-vintiga-primary no-underline hover:underline">
                      Designs
                    </a>
                  </div>
                  <a
                    href={reviewHash}
                    aria-label="Open shareable review view"
                    title="Open shareable review view"
                    className="text-vintiga-foreground-muted hover:text-vintiga-primary no-underline"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
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
              className="bg-vintiga-surface border border-vintiga-border rounded-vintiga-card p-vintiga-xl flex flex-col gap-vintiga-sm hover:border-vintiga-primary transition-colors no-underline"
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
