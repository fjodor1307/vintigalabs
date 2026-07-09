import { useState, type ReactNode } from 'react'
import { HubNavbar } from '../hub/HubNavbar'
import type { Segment } from '../hub/segments'
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
      <div className="px-vintiga-lg sm:px-vintiga-2xl py-vintiga-xl max-w-[1400px] mx-auto">
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

// ─── Page Builder — placeholder ───────────────────────────────────────────────

export function PageBuilderScreen() {
  return (
    <PresentationsShell title="Page Builder" subtitle="Assemble a deck from blocks — pick pages, swap copy and imagery, export.">
      <div className="rounded-vintiga-card border border-dashed border-vintiga-border bg-vintiga-surface-element p-vintiga-2xl text-center flex flex-col items-center gap-vintiga-sm">
        <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-primary">Coming soon</span>
        <p className="typo-body font-semibold text-vintiga-foreground">Page Builder is in design</p>
        <p className="typo-body-sm text-vintiga-foreground-muted max-w-md">
          It'll let you compose a deck from the Blocks catalog, edit text and images inline, and export — without touching Figma. We'll flesh this out next.
        </p>
      </div>
    </PresentationsShell>
  )
}
