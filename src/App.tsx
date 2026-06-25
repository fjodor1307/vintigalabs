import { useState, useEffect, useMemo } from 'react'
import { Agentation } from 'agentation'
import contributorsData from './generated/contributors.json'
import { DesignSystemScreen } from './design-system/style-guide/DesignSystemScreen'
import { ReviewMode, decodeComments } from './design-system/shared/ReviewMode'
import { FilterBar } from './design-system/shared/FilterBar'
import { BackArrowIcon, DownloadIcon } from './design-system/icons/Icons'
import { SegmentedControl } from './design-system/shared/SegmentedControl'
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

type Status = 'in-progress' | 'approved'

type Contributor = {
  name: string
  email: string
  initials: string
  colour: string
  commits: number
  firstCommit: string
  lastCommit: string
}

type GeneratedData = {
  generatedAt: string
  prototypes: Record<string, { status: Status; contributors: Contributor[] }>
}

const generated = contributorsData as GeneratedData

function authorsFor(slug: string): Contributor[] {
  return generated.prototypes[slug]?.contributors ?? []
}

// Prototypes are categorised by the surface they target: web → CRM (dashboard),
// mobile → POS. The Design System is a separate tool, not a prototype.
type Category = 'CRM' | 'POS'
const CATEGORY_OPTIONS = ['CRM', 'POS', 'Design System'] as const
type Segment = 'all' | (typeof CATEGORY_OPTIONS)[number]

function categoryForFrame(frame: PrototypeFrame): Category {
  return frame === 'mobile' ? 'POS' : 'CRM'
}

function CategoryBadge({ category }: { category: Category }) {
  if (category === 'POS') {
    return (
      <span className="inline-flex items-center gap-1 typo-caption font-semibold bg-vintiga-teal-100 text-vintiga-teal-700 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-vintiga-teal-500" aria-hidden="true" />
        POS
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 typo-caption font-semibold bg-vintiga-indigo-100 text-vintiga-indigo-700 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-vintiga-indigo-500" aria-hidden="true" />
      CRM
    </span>
  )
}

function AvatarStack({ contributors }: { contributors: Contributor[] }) {
  if (contributors.length === 0) return null
  const shown = contributors.slice(0, 3)
  const remaining = contributors.length - shown.length
  return (
    <div className="flex items-center">
      {shown.map((c, idx) => (
        <div
          key={c.email}
          className={`w-6 h-6 ${idx > 0 ? '-ml-1.5' : ''} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-vintiga-surface`}
          style={{ backgroundColor: c.colour }}
          title={`${c.name} · ${c.commits} commit${c.commits === 1 ? '' : 's'}`}
        >
          <span className="text-[10px]">{c.initials}</span>
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-6 h-6 -ml-1.5 rounded-full flex items-center justify-center font-semibold bg-vintiga-surface-element text-vintiga-foreground-muted ring-2 ring-vintiga-surface">
          <span className="text-[10px]">+{remaining}</span>
        </div>
      )}
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
  const [selectedAuthors, setSelectedAuthors] = useState<Set<string>>(new Set())
  const [segment, setSegment] = useState<Segment>('all')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')

  const allAuthors = useMemo<Contributor[]>(() => {
    const byEmail = new Map<string, Contributor>()
    for (const p of allEntries) {
      for (const c of authorsFor(p.slug)) {
        if (!byEmail.has(c.email)) byEmail.set(c.email, c)
      }
    }
    return [...byEmail.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const allTags = useMemo<string[]>(() => {
    const set = new Set<string>()
    for (const e of allEntries) for (const t of e.tags) set.add(t)
    return [...set].sort()
  }, [])

  // "Design System" is a tool, not a prototype — when it's selected the
  // prototype grid is empty by design and only the Design System card shows.
  const filteredPrototypes =
    segment === 'Design System'
      ? []
      : allEntries.filter((p) => {
          const authorMatch =
            selectedAuthors.size === 0 ||
            authorsFor(p.slug).some((a) => selectedAuthors.has(a.email))
          const categoryMatch = segment === 'all' || categoryForFrame(p.frame) === segment
          const tagMatch =
            selectedTags.size === 0 || p.tags.some((t) => selectedTags.has(t))
          return authorMatch && categoryMatch && tagMatch && matchesQuery(p, query)
        })

  const showDesignSystem = segment === 'all' || segment === 'Design System'

  const hasFilters =
    selectedAuthors.size > 0 ||
    segment !== 'all' ||
    selectedTags.size > 0 ||
    query.length > 0

  function toggleFrom<T>(setFn: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) {
    setFn((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  function clearFilters() {
    setSelectedAuthors(new Set())
    setSegment('all')
    setSelectedTags(new Set())
    setQuery('')
  }

  return (
    <div className="min-h-screen bg-vintiga-surface p-vintiga-lg sm:p-vintiga-2xl font-vintiga-body">
      <header className="mb-vintiga-xl flex items-start justify-between gap-vintiga-md">
        <div>
          <h1 className="typo-display font-light text-vintiga-foreground">
            Vintiga Prototypes
          </h1>
          <p className="typo-body-lg text-vintiga-foreground-muted mt-vintiga-sm">
            Clickable prototypes for validating flows and user stories
          </p>
        </div>
        {/* Download repo as a ZIP — handy for dev handoff so the engineering
            team can grab the latest main without cloning. GitHub's
            archive URL works without auth on public repos. */}
        <a
          href="https://github.com/fjodor1307/vintigalabs/archive/refs/heads/main.zip"
          target="_blank"
          rel="noreferrer"
          aria-label="Download repository as ZIP"
          title="Download repository as ZIP"
          className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white text-vintiga-slate-600 hover:text-vintiga-slate-900 hover:border-vintiga-slate-300 transition-colors no-underline"
        >
          <DownloadIcon className="w-4 h-4" />
        </a>
      </header>

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        authors={allAuthors}
        selectedAuthors={selectedAuthors}
        onToggleAuthor={(email) => toggleFrom(setSelectedAuthors, email)}
        tags={allTags}
        selectedTags={selectedTags}
        onToggleTag={(tag) => toggleFrom(setSelectedTags, tag)}
        segments={[
          { value: 'all', label: 'All' },
          ...CATEGORY_OPTIONS.map((c) => ({ value: c, label: c })),
        ]}
        activeSegment={segment}
        onSelectSegment={(v) => setSegment(v as Segment)}
        onClear={clearFilters}
      />

      {/* Prototype grid — hidden when the Design System tab is active. */}
      {segment !== 'Design System' && (
        filteredPrototypes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-vintiga-lg">
          {filteredPrototypes.map((entry) => {
            const category = categoryForFrame(entry.frame)
            const authors = authorsFor(entry.slug)
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
                  <div>
                    <CategoryBadge category={category} />
                  </div>
                  <h2 className="typo-title-subsection font-semibold text-vintiga-foreground">
                    {entry.name}
                  </h2>
                  <p className="typo-body-sm text-vintiga-foreground-muted">
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
                  <a href={entry.path} className="typo-body-sm font-semibold text-vintiga-primary no-underline">
                    Open flow ({entry.screens} screens) →
                  </a>
                  <div className="flex items-center gap-vintiga-sm">
                    <a
                      href={reviewHash}
                      className="typo-caption font-semibold text-vintiga-foreground-muted hover:text-vintiga-primary no-underline"
                      title="Open shareable review view"
                    >
                      Review →
                    </a>
                    <AvatarStack contributors={authors} />
                  </div>
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

// Floating Prototype/Design control. Replaces the old full-width dark top bar —
// it sits over the prototype ("inside the card") as a compact pill at the
// bottom so it never overlaps the prototype's own header.
function FrameToolbar({ hashPath, view }: { hashPath: string; view: View }) {
  const setView = (next: View) => {
    window.location.hash = next === 'prototype' ? hashPath : `${hashPath}?view=overview`
  }
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 bg-vintiga-surface/95 backdrop-blur border border-vintiga-border rounded-full shadow-vintiga-lg px-1.5 py-1.5">
      <a
        href="#/"
        aria-label="Back to prototypes"
        className="w-8 h-8 rounded-full flex items-center justify-center text-vintiga-foreground-muted hover:bg-vintiga-surface-element hover:text-vintiga-foreground transition-colors no-underline"
      >
        <BackArrowIcon className="w-4 h-4" />
      </a>
      <SegmentedControl<View>
        size="sm"
        value={view}
        onChange={setView}
        options={[
          { value: 'prototype', label: 'Prototype' },
          { value: 'overview', label: 'Design' },
        ]}
        aria-label="Prototype view"
      />
    </div>
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
  const canToggle = !!flow && !hashPath.startsWith('#/web/design-system')

  if (Screen) {
    if (view === 'overview' && flow) {
      return (
        <>
          <OverviewGrid flow={flow} inPhoneFrame={showInPhoneFrame} />
          <FrameToolbar hashPath={hashPath} view="overview" />
        </>
      )
    }
    if (showInPhoneFrame) {
      return (
        <div className="min-h-screen bg-vintiga-surface-secondary flex items-center justify-center py-vintiga-xl">
          <div className="w-[390px] h-[844px] rounded-[40px] shadow-vintiga-lg overflow-hidden bg-vintiga-surface flex flex-col">
            <Screen />
          </div>
          {canToggle && <FrameToolbar hashPath={hashPath} view="prototype" />}
          {import.meta.env.DEV && <Agentation />}
        </div>
      )
    }
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-1 min-h-0">
          <Screen />
        </div>
        {canToggle && <FrameToolbar hashPath={hashPath} view="prototype" />}
        {import.meta.env.DEV && <Agentation />}
      </div>
    )
  }

  return <IndexPage />
}

export default App
