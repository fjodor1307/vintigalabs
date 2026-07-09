import { useState, type ReactNode } from 'react'
import { HubNavbar } from '../hub/HubNavbar'
import type { Segment } from '../hub/segments'
import { Select } from '@ds/shared/Select'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { BackArrowIcon, SearchIcon, SparklesIcon, TrendingUpIcon, UsersIcon } from '@ds/icons/Icons'
import {
  BlockKicker,
  BlockTitle,
  BlockLead,
  BlockStatRow,
  BlockIconCard,
  BlockFrame,
  BlockGlassStat,
} from './blocks/blocks'

// ─── Presentations hub screens ────────────────────────────────────────────────
// Investor Decks (deck listing), Presentation Blocks (the block catalog), and a
// Page Builder placeholder. Rendered inside the hub chrome (HubNavbar), matching
// Brand / Design System sub-pages.

function goToHub() {
  localStorage.setItem('vintiga-hub-segment', 'Presentations')
  window.location.hash = '#/'
}

function PresentationsShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const [dark, setDark] = useState(false)
  return (
    <div className={`${dark ? 'dark bg-[#0a0a0a] ' : 'bg-vintiga-surface '}min-h-screen overflow-y-auto font-vintiga-body [scrollbar-gutter:stable]`}>
      <HubNavbar
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        segment={'Presentations' as Segment}
        onSelectSegment={(s) => { localStorage.setItem('vintiga-hub-segment', s); window.location.hash = '#/' }}
        onOpenUpdates={() => { window.location.hash = '#/' }}
        search={
          <a href="#/" className="flex items-center gap-2 h-10 px-3 rounded-vintiga-md border border-vintiga-border bg-vintiga-surface-element text-vintiga-foreground-muted no-underline hover:border-vintiga-surface-muted transition-colors">
            <SearchIcon className="w-4 h-4 shrink-0" />
            <span className="typo-body-sm">Search</span>
          </a>
        }
      />
      <div className="px-vintiga-lg sm:px-vintiga-2xl py-vintiga-xl">
        <button type="button" onClick={goToHub} className="inline-flex items-center gap-1.5 typo-body-sm font-semibold text-vintiga-primary hover:underline bg-transparent border-none p-0 cursor-pointer mb-vintiga-lg">
          <BackArrowIcon className="w-4 h-4" /> Presentations
        </button>
        <div className="flex flex-col gap-1 mb-vintiga-xl">
          <h1 className="typo-title-screen font-semibold text-vintiga-foreground">{title}</h1>
          <p className="typo-body text-vintiga-foreground-muted">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Investor Decks — listing ─────────────────────────────────────────────────

const INVESTOR_DECKS = [
  {
    title: 'Vintiga Overview',
    desc: 'Investor overview — the winery guest-intelligence platform.',
    href: '#/presentations/vintiga-overview',
    cover: '/brand/imagery/locations/estate-terrace.jpg',
    meta: 'July 2026 · 17 slides',
  },
  {
    title: 'Vintiga Overview Slides',
    desc: 'Investor overview — a light-themed take with an animated title.',
    href: '#/presentations/vintiga-overview-slides',
    cover: '/brand/imagery/compositions/emma-desk-03.jpg',
    meta: 'July 2026 · 17 slides',
  },
]

export function InvestorDecksScreen() {
  return (
    <PresentationsShell title="Investor Decks" subtitle="Fundraising overviews — the guest-intelligence platform.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-vintiga-lg items-start">
        {INVESTOR_DECKS.map((p) => (
          <a key={p.href} href={p.href} className="group bg-vintiga-surface border border-vintiga-border rounded-vintiga-card overflow-hidden flex flex-col hover:border-vintiga-slate-400 dark:hover:border-vintiga-surface-muted transition-colors no-underline">
            <div className="aspect-[16/9] bg-vintiga-surface-element overflow-hidden">
              <img src={p.cover} alt="" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" />
            </div>
            <div className="p-vintiga-lg flex flex-col gap-vintiga-xs">
              <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-foreground-muted">{p.meta}</span>
              <h3 className="typo-title-subsection font-semibold text-vintiga-foreground">{p.title}</h3>
              <p className="typo-body-sm text-vintiga-foreground-muted">{p.desc}</p>
              <span className="mt-vintiga-sm typo-body-sm font-semibold text-vintiga-primary">Open →</span>
            </div>
          </a>
        ))}
      </div>
    </PresentationsShell>
  )
}

// ─── Presentation Blocks — catalog ────────────────────────────────────────────

function BlockCard({ label, note, children }: { label: string; note: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-vintiga-md">
      <div className="flex flex-col gap-0.5">
        <h3 className="typo-title-subsection font-semibold text-vintiga-foreground">{label}</h3>
        <p className="typo-body-sm text-vintiga-foreground-muted">{note}</p>
      </div>
      <div className="rounded-vintiga-card border border-vintiga-border bg-vintiga-white p-vintiga-xl">
        {children}
      </div>
    </section>
  )
}

export function PresentationBlocksScreen() {
  return (
    <PresentationsShell title="Blocks" subtitle="The reusable building blocks decks are assembled from — a separate system from the app design system.">
      <div className="flex flex-col gap-vintiga-2xl">
        <BlockCard label="Title & text" note="Kicker · display title · lead paragraph.">
          <div className="flex flex-col gap-vintiga-md max-w-3xl">
            <BlockKicker>Guest Intelligence</BlockKicker>
            <BlockTitle>Powering the world's most remarkable wineries</BlockTitle>
            <BlockLead>More visitors. More members. More revenue.</BlockLead>
          </div>
        </BlockCard>

        <BlockCard label="Stat row" note="Big numbers with captions — up to four across.">
          <BlockStatRow
            stats={[
              { value: '55%', label: 'of DTC transactions happen in the tasting room' },
              { value: '47%', label: 'of new customer records created in tasting rooms' },
              { value: '39%', label: 'of DTC revenue comes from wine clubs' },
              { value: '72%', label: 'of guests leave without a digital profile' },
            ]}
          />
        </BlockCard>

        <BlockCard label="Glass stat over media" note="Frosted card layered on brand photography.">
          <BlockGlassStat />
        </BlockCard>

        <BlockCard label="Icon cards" note="Three-up feature / benefit cards.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg">
            <BlockIconCard icon={<SparklesIcon />} title="AI-powered hospitality" body="Guest intelligence once reserved for luxury brands, for every winery." />
            <BlockIconCard icon={<TrendingUpIcon />} title="Personalization is essential" body="Slower demand makes conversion and retention mission-critical." />
            <BlockIconCard icon={<UsersIcon />} title="Relationships beat volume" body="Won by better customer relationships, not more wine." />
          </div>
        </BlockCard>

        <BlockCard label="Framed media" note="Rounded, brand-consistent image frame.">
          <BlockFrame src="/brand/imagery/locations/wine-barrels.jpg" alt="Oak wine barrels in warm evening light" className="w-full max-w-xl aspect-[16/9]" />
        </BlockCard>
      </div>

      <p className="typo-body-sm text-vintiga-foreground-muted mt-vintiga-2xl">
        More blocks (tables, team, funding, dividers) get added here as the decks grow — this catalog is the source the Page Builder will assemble from.
      </p>
    </PresentationsShell>
  )
}

// ─── Page Builder ─────────────────────────────────────────────────────────────
// Pick a deck page, then compose it: every block has a dropdown to swap it for
// another block, and the page background can be white or a brand image with a
// 50% black overlay. A first pass — pages are block presets standing in for the
// live decks until those are refactored to be block-based.

type BlockKind = 'title' | 'stats' | 'icons' | 'glass' | 'frame'

const BLOCK_KINDS: { value: BlockKind; label: string }[] = [
  { value: 'title', label: 'Title & text' },
  { value: 'stats', label: 'Stat row' },
  { value: 'icons', label: 'Icon cards' },
  { value: 'glass', label: 'Glass stat' },
  { value: 'frame', label: 'Framed media' },
]

function renderBlock(kind: BlockKind) {
  switch (kind) {
    case 'title':
      return (
        <div className="flex flex-col gap-vintiga-md max-w-3xl">
          <BlockKicker>Guest Intelligence</BlockKicker>
          <BlockTitle>Powering the world's most remarkable wineries</BlockTitle>
          <BlockLead>More visitors. More members. More revenue.</BlockLead>
        </div>
      )
    case 'stats':
      return (
        <BlockStatRow stats={[
          { value: '55%', label: 'of DTC transactions in the tasting room' },
          { value: '47%', label: 'of new records created in tasting rooms' },
          { value: '39%', label: 'of DTC revenue from wine clubs' },
          { value: '72%', label: 'of guests leave without a profile' },
        ]} />
      )
    case 'icons':
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg w-full">
          <BlockIconCard icon={<SparklesIcon />} title="AI-powered hospitality" body="Guest intelligence for every winery." />
          <BlockIconCard icon={<TrendingUpIcon />} title="Personalization is essential" body="Conversion and retention are critical." />
          <BlockIconCard icon={<UsersIcon />} title="Relationships beat volume" body="Won by relationships, not more wine." />
        </div>
      )
    case 'glass':
      return <BlockGlassStat />
    case 'frame':
      return <BlockFrame src="/brand/imagery/locations/wine-barrels.jpg" alt="Oak wine barrels" className="w-full max-w-xl aspect-[16/9]" />
  }
}

interface Slot { id: string; kind: BlockKind }

const BUILDER_PAGES: { value: string; label: string; slots: Slot[] }[] = [
  { value: 'overview-title',   label: 'Vintiga Overview · Title',      slots: [{ id: 's1', kind: 'title' }, { id: 's2', kind: 'glass' }] },
  { value: 'overview-problem', label: 'Vintiga Overview · The Problem', slots: [{ id: 's1', kind: 'title' }, { id: 's2', kind: 'stats' }] },
  { value: 'overview-why',     label: 'Vintiga Overview · Why Now',     slots: [{ id: 's1', kind: 'title' }, { id: 's2', kind: 'icons' }] },
  { value: 'blank',            label: 'Blank page',                     slots: [{ id: 's1', kind: 'title' }] },
]

const BG_IMAGES = [
  { src: '/brand/imagery/locations/estate-terrace.jpg', label: 'Estate terrace' },
  { src: '/brand/imagery/locations/wine-barrels.jpg',   label: 'Wine barrels' },
  { src: '/brand/imagery/compositions/emma-desk-03.jpg', label: 'Desk' },
  { src: '/brand/imagery/locations/garden-path.jpg',    label: 'Garden path' },
]

export function PageBuilderScreen() {
  const [pageValue, setPageValue] = useState(BUILDER_PAGES[0].value)
  const [slots, setSlots] = useState<Slot[]>(BUILDER_PAGES[0].slots)
  const [bgMode, setBgMode] = useState<'white' | 'image'>('white')
  const [bgImage, setBgImage] = useState(BG_IMAGES[0].src)

  function selectPage(v: string) {
    setPageValue(v)
    setSlots(BUILDER_PAGES.find((p) => p.value === v)?.slots ?? [])
  }
  function swapBlock(id: string, kind: BlockKind) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, kind } : s)))
  }

  const onImage = bgMode === 'image'

  return (
    <PresentationsShell title="Page Builder" subtitle="Pick a page, swap its blocks, and set the background — then export.">
      <div className="flex flex-col gap-vintiga-lg">
        {/* Toolbar */}
        <div className="flex flex-wrap items-end gap-vintiga-lg rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-md">
          <label className="flex flex-col gap-1.5 min-w-[240px]">
            <span className="typo-caption font-semibold text-vintiga-foreground-muted">Page</span>
            <Select value={pageValue} onChange={(e) => selectPage(e.target.value)} options={BUILDER_PAGES.map((p) => ({ value: p.value, label: p.label }))} />
          </label>
          <div className="flex flex-col gap-1.5">
            <span className="typo-caption font-semibold text-vintiga-foreground-muted">Background</span>
            <SegmentedControl<'white' | 'image'>
              value={bgMode}
              onChange={setBgMode}
              options={[{ value: 'white', label: 'White' }, { value: 'image', label: 'Image' }]}
            />
          </div>
          {onImage && (
            <div className="flex items-center gap-vintiga-sm">
              {BG_IMAGES.map((im) => (
                <button
                  key={im.src}
                  type="button"
                  onClick={() => setBgImage(im.src)}
                  aria-label={im.label}
                  className={`w-12 h-12 rounded-vintiga-md overflow-hidden border-2 transition-colors ${bgImage === im.src ? 'border-vintiga-primary' : 'border-transparent hover:border-vintiga-border'}`}
                >
                  <img src={im.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Canvas — 16:9 slide */}
        <div className="relative w-full aspect-[16/9] rounded-vintiga-2xl overflow-hidden border border-vintiga-border bg-vintiga-white shadow-sm">
          {onImage && (
            <>
              <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
            </>
          )}
          <div className={`relative h-full overflow-y-auto px-vintiga-2xl py-vintiga-xl flex flex-col justify-center gap-vintiga-xl ${onImage ? '[&_h2]:!text-white [&_h3]:!text-white [&_p]:!text-white/85 [&_.text-vintiga-indigo-600]:!text-white' : ''}`}>
            {slots.map((s) => (
              <div key={s.id} className="group relative">
                <div className="absolute -top-2 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-52">
                    <Select value={s.kind} onChange={(e) => swapBlock(s.id, e.target.value as BlockKind)} options={BLOCK_KINDS} />
                  </div>
                </div>
                {renderBlock(s.kind)}
              </div>
            ))}
          </div>
        </div>

        <p className="typo-body-sm text-vintiga-foreground-muted">
          Hover a block to swap it. Backgrounds and block choices are per-page. Export lands here once the live decks are block-based.
        </p>
      </div>
    </PresentationsShell>
  )
}
