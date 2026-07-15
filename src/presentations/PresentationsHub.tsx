import { useState, type ReactNode } from 'react'
import { HubNavbar } from '../hub/HubNavbar'
import type { Segment } from '../hub/segments'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { BackArrowIcon, SearchIcon, SparklesIcon, TrendingUpIcon, UsersIcon, CopyIcon, CheckIcon, ArrowRightIcon } from '@ds/icons/Icons'
import {
  BlockKicker,
  BlockTitle,
  BlockLead,
  BlockStatRow,
  BlockIconCard,
  BlockFrame,
  BlockGlassStat,
  BlockGlassRevenue,
  BlockAvatarsPill,
} from './blocks/blocks'

// ─── Presentations hub screens ────────────────────────────────────────────────
// Investor Decks (deck listing), Presentation Blocks (the block catalog), and a
// Deck Builder placeholder. Rendered inside the hub chrome (HubNavbar), matching
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

        <BlockCard label="Glass & blur (Figma 5270:645)" note="Frosted overlays — Total Revenue card (two radii) + avatars pill. Real backdrop-blur, so shown over media.">
          <div className="relative rounded-vintiga-2xl overflow-hidden aspect-[16/9] bg-vintiga-slate-800">
            <img src="/brand/imagery/compositions/emma-desk-03.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 p-vintiga-lg flex flex-col justify-between gap-vintiga-md">
              <div className="flex flex-wrap gap-vintiga-md items-start">
                <BlockGlassRevenue />
                <BlockGlassRevenue rounded />
              </div>
              <BlockAvatarsPill />
            </div>
          </div>
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
        More blocks (tables, team, funding, dividers) get added here as the decks grow — this catalog is the source the Deck Builder will assemble from.
      </p>
    </PresentationsShell>
  )
}

// ─── Deck Builder ─────────────────────────────────────────────────────────────
// A questionnaire that ends in a copy-ready prompt (we can't build decks live
// yet): pick a page count, then compose each slide — layout, background and its
// content fields — with a live branded preview, then export the spec. Modelled
// on Figma 5339:8004.

type SlideBg = 'white' | 'black' | 'indigo' | 'image'
type SlideLayout = 'text-media' | 'media-text' | 'centered' | 'full-media'

interface SlideConfig {
  layout: SlideLayout
  bg: SlideBg
  bgImage: string
  caption: string
  headline: string
  description: string
  footnote: string
  image: string
}

const BG_IMAGES = [
  { src: '/brand/imagery/locations/estate-terrace.jpg', label: 'Estate terrace' },
  { src: '/brand/imagery/locations/wine-barrels.jpg',   label: 'Wine barrels' },
  { src: '/brand/imagery/compositions/emma-desk-03.jpg', label: 'Desk' },
  { src: '/brand/imagery/locations/garden-path.jpg',    label: 'Garden path' },
]

const PAGE_COUNTS = [5, 10, 20]

const LAYOUTS: { value: SlideLayout; label: string }[] = [
  { value: 'text-media', label: 'Text left · media right' },
  { value: 'media-text', label: 'Media left · text right' },
  { value: 'centered',   label: 'Centered text' },
  { value: 'full-media', label: 'Full-bleed media' },
]

const BG_LABEL: Record<SlideBg, string> = { white: 'White', black: 'Black', indigo: 'Indigo', image: 'Image + 65% overlay' }

const DEFAULT_SLIDE: SlideConfig = {
  layout: 'text-media',
  bg: 'white',
  bgImage: BG_IMAGES[0].src,
  caption: 'Guest Intelligence',
  headline: "Powering the world's most remarkable wineries",
  description: 'More visitors. More members. More revenue.',
  footnote: 'Jim Secord, Founder, VintigaLabs.com, jim@vintigalabs.com',
  image: '/brand/imagery/compositions/emma-desk-03.jpg',
}

const slideName = (i: number) => (i === 0 ? 'Intro Slide' : `Slide ${i + 1}`)

// A 24×24 mini-diagram of the slide arrangement, tinted by `currentColor`.
function LayoutGlyph({ kind }: { kind: SlideLayout }) {
  if (kind === 'centered') {
    return (
      <span className="flex flex-col items-center justify-center gap-1 w-6 h-6 [&>i]:h-[3px] [&>i]:rounded-[1px] [&>i]:bg-current">
        <i className="w-3" /><i className="w-4" /><i className="w-2.5" />
      </span>
    )
  }
  if (kind === 'full-media') {
    return (
      <span className="relative w-6 h-6 rounded-[2px] bg-current/40 flex items-end p-1">
        <span className="w-3 h-[3px] rounded-[1px] bg-current" />
      </span>
    )
  }
  const text = (
    <span className="flex-1 flex flex-col justify-center gap-1 [&>i]:h-[3px] [&>i]:rounded-[1px] [&>i]:bg-current">
      <i className="w-full" /><i className="w-3/4" /><i className="w-1/2" />
    </span>
  )
  const media = <span className="flex-1 h-full rounded-[2px] bg-current/40" />
  return (
    <span className="flex items-stretch gap-1 w-6 h-6">
      {kind === 'text-media' ? <>{text}{media}</> : <>{media}{text}</>}
    </span>
  )
}

const BG_THEME: Record<SlideBg, { wrap: string; text: string; kicker: string; sub: string; foot: string }> = {
  white:  { wrap: 'bg-white',              text: 'text-vintiga-slate-900', kicker: 'text-vintiga-indigo-600', sub: 'text-vintiga-indigo-600', foot: 'text-vintiga-slate-500' },
  black:  { wrap: 'bg-[#0a0a12]',          text: 'text-white',             kicker: 'text-vintiga-indigo-300', sub: 'text-vintiga-indigo-200', foot: 'text-white/55' },
  indigo: { wrap: 'bg-vintiga-indigo-700', text: 'text-white',             kicker: 'text-white/75',          sub: 'text-white',             foot: 'text-white/75' },
  image:  { wrap: 'bg-vintiga-slate-900',  text: 'text-white',             kicker: 'text-vintiga-indigo-200', sub: 'text-white',             foot: 'text-white/75' },
}

type Theme = (typeof BG_THEME)[SlideBg]

function SlideText({ slide, theme, align = 'left' }: { slide: SlideConfig; theme: Theme; align?: 'left' | 'center' }) {
  return (
    <div className={`flex flex-col h-full justify-center gap-[3%] ${align === 'center' ? 'items-center text-center' : ''}`}>
      {slide.caption && <span className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${theme.kicker}`}>{slide.caption}</span>}
      {slide.headline && <h3 className={`font-vintiga-display font-light leading-[1.06] text-[clamp(15px,2.6vw,30px)] ${theme.text}`}>{slide.headline}</h3>}
      {slide.description && <p className={`text-[clamp(9px,1.1vw,14px)] leading-snug ${theme.sub}`}>{slide.description}</p>}
      {slide.footnote && <p className={`text-[8px] leading-snug mt-[6%] ${theme.foot}`}>{slide.footnote}</p>}
    </div>
  )
}

// Photo + glass revenue card + avatars pill — the product composition from the deck.
function SlideMedia({ slide }: { slide: SlideConfig }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[84%] aspect-[4/5] max-h-[88%] rounded-[10px] overflow-hidden bg-vintiga-slate-100 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.5)]">
        <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="absolute left-[4%] top-[46%] w-[64%] origin-top-left scale-[0.6]"><BlockGlassRevenue rounded /></div>
      <div className="absolute right-0 bottom-[10%] origin-bottom-right scale-[0.6]"><BlockAvatarsPill /></div>
    </div>
  )
}

// Live branded 16:9 render of the slide being edited.
function SlidePreview({ slide }: { slide: SlideConfig }) {
  const theme = BG_THEME[slide.bg]
  return (
    <div className={`relative w-full aspect-[16/9] rounded-vintiga-2xl overflow-hidden border border-vintiga-border shadow-sm ${theme.wrap}`}>
      {slide.bg === 'image' && (
        <>
          <img src={slide.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      {/* deck chrome — the little logo mark, top-left */}
      <div className="absolute left-[3%] top-[5%]">
        <span className={`block w-[14px] h-[14px] rounded-[3px] ${slide.bg === 'white' ? 'bg-vintiga-slate-900' : 'bg-white'}`} />
      </div>

      {slide.layout === 'full-media' ? (
        <div className="absolute inset-0 flex items-end p-[6%]">
          <div className="w-[72%]"><SlideText slide={slide} theme={theme} /></div>
        </div>
      ) : slide.layout === 'centered' ? (
        <div className="absolute inset-0 px-[12%] py-[12%]"><SlideText slide={slide} theme={theme} align="center" /></div>
      ) : (
        <div className="absolute inset-0 grid grid-cols-2 gap-[4%] px-[6%] py-[9%]">
          {slide.layout === 'media-text'
            ? <><SlideMedia slide={slide} /><SlideText slide={slide} theme={theme} /></>
            : <><SlideText slide={slide} theme={theme} /><SlideMedia slide={slide} /></>}
        </div>
      )}
    </div>
  )
}

// Turn the answers into a precise, copy-ready spec for Claude Code to build from.
function buildPrompt(slides: SlideConfig[], closing: boolean): string {
  const out: string[] = []
  out.push(`Build a Vintiga presentation deck — ${slides.length} slide${slides.length === 1 ? '' : 's'}${closing ? ' plus a closing slide' : ''}.`)
  out.push('')
  out.push('Conventions: fully branded with Vintiga tokens + Inter, the same entrance animations as the existing "Vintiga Overview" deck, one dominant colour (indigo), a visual on every slide, and mobile responsive. Build the text from the presentation blocks in src/presentations/blocks/blocks.tsx (kicker · display title · lead · footnote) and use the glass blocks for product imagery. Add it as a new screen under src/presentations/ and register it like the other decks.')
  out.push('')
  slides.forEach((s, i) => {
    out.push(`Slide ${i + 1} — ${LAYOUTS.find((l) => l.value === s.layout)?.label}`)
    out.push(s.bg === 'image'
      ? `- Background: image (${s.bgImage}) under a 65% black overlay; text in white.`
      : `- Background: ${BG_LABEL[s.bg]}.`)
    if (s.caption)     out.push(`- Caption (kicker): ${s.caption}`)
    if (s.headline)    out.push(`- Headline: ${s.headline}`)
    if (s.description) out.push(`- Description: ${s.description}`)
    if (s.footnote)    out.push(`- Footnote: ${s.footnote}`)
    if (s.image && s.layout !== 'centered') out.push(`- Media: ${s.image}`)
    out.push('')
  })
  if (closing) {
    out.push(`Closing slide (slide ${slides.length + 1})`)
    out.push('- A short, calm sign-off written from the themes above — one line like "That\'s Vintiga." with a single summarizing sentence. No new data; echo the story the slides tell.')
    out.push('')
  }
  return out.join('\n').trimEnd()
}

// A questionnaire, not a live editor (we can't build decks live yet). Walks you
// through page count → per-page background + elements (with a live preview) → an
// optional auto-written closing slide → a copy-ready PROMPT to paste into Claude
// Code, which then builds the real deck.
// Deep-link the wizard step from the query string so each screen is directly
// reachable (shareable steps + lets the Figma capture hit each one):
//   ?pb=pages&pbn=5&pbi=1   → page-by-page, 5 pages, on page 1
//   ?pb=prompt&pbn=5        → the generated prompt
const pbInit = (() => {
  const q = new URLSearchParams(window.location.search)
  const pb = q.get('pb')
  const n = Number(q.get('pbn'))
  if ((pb === 'pages' || pb === 'prompt') && n > 0) {
    return { phase: pb as 'pages' | 'prompt', count: n, idx: Math.min(Math.max(1, Number(q.get('pbi')) || 1) - 1, n - 1) }
  }
  return { phase: 'setup' as const, count: null as number | null, idx: 0 }
})()

export function PageBuilderScreen() {
  const [phase, setPhase] = useState<'setup' | 'pages' | 'prompt'>(pbInit.phase)
  const [count, setCount] = useState<number | null>(pbInit.count)
  const [slides, setSlides] = useState<SlideConfig[]>(() =>
    pbInit.count ? Array.from({ length: pbInit.count }, () => ({ ...DEFAULT_SLIDE })) : [],
  )
  const [idx, setIdx] = useState(pbInit.idx)
  const [closing, setClosing] = useState(true)
  const [copied, setCopied] = useState(false)

  function begin() {
    if (!count) return
    setSlides(Array.from({ length: count }, () => ({ ...DEFAULT_SLIDE })))
    setIdx(0)
    setPhase('pages')
  }
  function update(patch: Partial<SlideConfig>) {
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)))
  }
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(buildPrompt(slides, closing))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked — user can still select the text */ }
  }

  // ── Step 1 · how many pages ──────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <PresentationsShell title="Deck Builder" subtitle="Answer a few questions and get a copy-ready prompt for Claude Code — it can't build the deck live yet, so this hands you the exact spec.">
        <div className="max-w-xl flex flex-col gap-vintiga-lg rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-xl">
          <div className="flex flex-col gap-1">
            <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-primary">Step 1 of 3</span>
            <h2 className="typo-title-section font-semibold text-vintiga-foreground">How many pages do you want?</h2>
            <p className="typo-body-sm text-vintiga-foreground-muted">You'll set the layout, background and content for each slide next.</p>
          </div>
          <div className="grid grid-cols-3 gap-vintiga-md">
            {PAGE_COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-vintiga-card border-2 p-vintiga-lg transition-colors cursor-pointer ${count === n ? 'border-vintiga-primary bg-vintiga-primary-soft' : 'border-vintiga-border bg-vintiga-white hover:border-vintiga-slate-400'}`}
              >
                <span className="typo-display font-light text-vintiga-foreground">{n}</span>
                <span className="typo-body-sm text-vintiga-foreground-muted">pages</span>
              </button>
            ))}
          </div>
          <Button disabled={!count} onClick={begin}>Continue</Button>
        </div>
      </PresentationsShell>
    )
  }

  // ── Step 3 · the prompt ──────────────────────────────────────────────────────
  if (phase === 'prompt') {
    return (
      <PresentationsShell title="Deck Builder" subtitle="The exact spec for your deck — paste it into Claude Code.">
        <div className="max-w-3xl flex flex-col gap-vintiga-lg">
          <div className="flex flex-col gap-1">
            <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-primary">Step 3 of 3 · Your prompt</span>
            <h2 className="typo-title-section font-semibold text-vintiga-foreground">Paste this into Claude Code</h2>
            <p className="typo-body-sm text-vintiga-foreground-muted">
              We can't build the deck live yet — this is the spec for {slides.length} slide{slides.length === 1 ? '' : 's'}{closing ? ' plus a closing slide' : ''}. Claude Code follows it to build the presentation.
            </p>
          </div>
          <div className="rounded-vintiga-card border border-vintiga-border bg-vintiga-slate-900 p-vintiga-lg">
            <pre className="whitespace-pre-wrap font-mono typo-body-sm text-vintiga-slate-100 leading-relaxed overflow-x-auto">{buildPrompt(slides, closing)}</pre>
          </div>
          <div className="flex flex-wrap items-center gap-vintiga-sm">
            <Button leftIcon={copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />} onClick={copyPrompt}>{copied ? 'Copied' : 'Copy prompt'}</Button>
            <Button variant="outline" leftIcon={<BackArrowIcon className="w-4 h-4" />} onClick={() => { setPhase('pages'); setIdx(slides.length - 1) }}>Back to pages</Button>
            <Button variant="outline" onClick={() => { setPhase('setup'); setCount(null) }}>Start over</Button>
          </div>
        </div>
      </PresentationsShell>
    )
  }

  // ── Step 2 · slide by slide ──────────────────────────────────────────────────
  const slide = slides[idx]
  const isLast = idx === slides.length - 1
  const onImage = slide.bg === 'image'

  const FIELDS: { key: 'caption' | 'headline' | 'description' | 'footnote' | 'image'; label: string; placeholder: string }[] = [
    { key: 'caption',     label: 'Caption',                 placeholder: 'Guest Intelligence' },
    { key: 'headline',    label: 'Headline',                placeholder: "Powering the world's most remarkable wineries" },
    { key: 'description', label: 'Description',             placeholder: 'More visitors. More members. More revenue.' },
    { key: 'footnote',    label: 'Footnote',                placeholder: 'Name, role, site, email' },
    { key: 'image',       label: 'Image link or component', placeholder: '/brand/imagery/…' },
  ]

  return (
    <PresentationsShell title="Deck Builder" subtitle="Set each slide's layout, background and content. The preview updates as you go.">
      <div className="flex flex-col gap-vintiga-lg">
        {/* Progress */}
        <div className="flex items-center justify-between gap-vintiga-md">
          <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-primary">Step 2 of 3 · Page {idx + 1} of {slides.length}</span>
          <div className="flex items-center gap-1">
            {slides.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-vintiga-primary' : 'w-1.5 bg-vintiga-border'}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-vintiga-xl items-start">
          {/* Controls */}
          <div className="flex flex-col gap-vintiga-lg">
            <h2 className="typo-title-section font-semibold text-vintiga-foreground">{slideName(idx)}</h2>

            {/* Layout + Background */}
            <div className="flex flex-col sm:flex-row gap-vintiga-md">
              <div className="flex flex-col gap-vintiga-sm rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-lg">
                <span className="typo-caption font-semibold text-vintiga-foreground-muted">Layout</span>
                <div className="flex items-center gap-vintiga-sm">
                  {LAYOUTS.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => update({ layout: l.value })}
                      aria-label={l.label}
                      title={l.label}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-vintiga-md border transition-colors ${slide.layout === l.value ? 'border-vintiga-primary bg-vintiga-primary-soft text-vintiga-primary' : 'border-vintiga-border text-vintiga-foreground-muted hover:border-vintiga-slate-400'}`}
                    >
                      <LayoutGlyph kind={l.value} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-vintiga-sm rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-lg">
                <span className="typo-caption font-semibold text-vintiga-foreground-muted">Background</span>
                <SegmentedControl<SlideBg>
                  value={slide.bg}
                  onChange={(v) => update({ bg: v })}
                  options={[
                    { value: 'white', label: 'White' },
                    { value: 'black', label: 'Black' },
                    { value: 'indigo', label: 'Indigo' },
                    { value: 'image', label: 'Image + 65% overlay' },
                  ]}
                />
                {onImage && (
                  <div className="flex flex-wrap gap-vintiga-sm mt-1">
                    {BG_IMAGES.map((im) => (
                      <button
                        key={im.src}
                        type="button"
                        onClick={() => update({ bgImage: im.src })}
                        aria-label={im.label}
                        className={`w-12 h-12 rounded-vintiga-md overflow-hidden border-2 transition-colors ${slide.bgImage === im.src ? 'border-vintiga-primary' : 'border-transparent hover:border-vintiga-border'}`}
                      >
                        <img src={im.src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-vintiga-md rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-lg">
              <span className="typo-caption font-semibold text-vintiga-foreground-muted">Content</span>
              {FIELDS.map((f) => (
                <label key={f.key} className="flex flex-col gap-1.5">
                  <span className="typo-caption font-semibold text-vintiga-foreground">{f.label}</span>
                  <TextField value={slide[f.key]} onChange={(e) => update({ [f.key]: e.target.value } as Partial<SlideConfig>)} placeholder={f.placeholder} />
                </label>
              ))}
            </div>

            {isLast && (
              <div className="flex flex-col gap-vintiga-sm rounded-vintiga-card border-2 border-vintiga-primary/40 bg-vintiga-primary-soft p-vintiga-lg">
                <span className="inline-flex items-center gap-1.5 typo-body-sm font-semibold text-vintiga-primary"><SparklesIcon className="w-4 h-4" />This is your last slide</span>
                <p className="typo-body-sm text-vintiga-foreground-muted">Want a closing slide written for you? It'll be a short "the end" sign-off drawn from everything you picked.</p>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={closing} onChange={(e) => setClosing(e.target.checked)} className="w-4 h-4 accent-vintiga-primary" />
                  <span className="typo-body-sm text-vintiga-foreground">Yes, add a closing slide</span>
                </label>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-vintiga-lg flex flex-col gap-vintiga-sm">
            <span className="typo-caption font-semibold text-vintiga-foreground-muted">Preview · page {idx + 1}</span>
            <SlidePreview slide={slide} />
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between border-t border-vintiga-border pt-vintiga-lg">
          <Button variant="outline" leftIcon={<BackArrowIcon className="w-4 h-4" />} onClick={() => (idx === 0 ? setPhase('setup') : setIdx(idx - 1))}>
            {idx === 0 ? 'Start over' : 'Previous'}
          </Button>
          {isLast
            ? <Button leftIcon={<SparklesIcon className="w-4 h-4" />} onClick={() => setPhase('prompt')}>Generate prompt</Button>
            : <Button leftIcon={<ArrowRightIcon className="w-4 h-4" />} onClick={() => setIdx(idx + 1)}>Next page</Button>}
        </div>
      </div>
    </PresentationsShell>
  )
}
