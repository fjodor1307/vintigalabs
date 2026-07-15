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

type SlideBg = 'white' | 'black' | 'indigo' | 'image' | 'image-plain'
type IntroHeader = 'top' | 'left'
type IntroMedia = 'composition' | 'image' | 'none'
type ContentLayout = 'content-image' | 'cards' | 'text-media' | 'centered'

interface Bullet { point: string; detail: string }
interface Card { heading: string; body: string }

// The intro slide is the distinctive one — it carries a header-position control
// (top / left). Content slides (2+) keep a simpler layout picker. Both share the
// background + text fields.
interface SlideConfig {
  kind: 'intro' | 'content'
  bg: SlideBg
  bgImage: string
  header: IntroHeader   // intro only
  media: IntroMedia     // intro only
  layout: ContentLayout // content only
  caption: string
  headline: string
  description: string
  footnote: string
  image: string
  bullets: Bullet[]     // content-image layout
  cards: Card[]         // cards layout
}

const BG_IMAGES = [
  { src: '/brand/imagery/locations/estate-terrace.jpg', label: 'Estate terrace' },
  { src: '/brand/imagery/locations/wine-barrels.jpg',   label: 'Wine barrels' },
  { src: '/brand/imagery/compositions/emma-desk-03.jpg', label: 'Desk' },
  { src: '/brand/imagery/locations/garden-path.jpg',    label: 'Garden path' },
]

const PAGE_COUNTS = [5, 10, 20]

const CONTENT_LAYOUTS: { value: ContentLayout; label: string }[] = [
  { value: 'content-image', label: 'Title + points, image right' },
  { value: 'cards',         label: 'Title + 3 cards' },
  { value: 'text-media',    label: 'Text + media' },
  { value: 'centered',      label: 'Centered text' },
]

const BG_LABEL: Record<SlideBg, string> = { white: 'White', black: 'Black', indigo: 'Indigo', image: 'Image + 65% overlay', 'image-plain': 'Image' }

const DEFAULT_BULLETS: Bullet[] = [
  { point: 'U.S. wine sales down ~20% from peak', detail: 'A prolonged, industry-wide demand slowdown.' },
  { point: 'Tasting-room visitation is falling', detail: 'Wineries are cutting fees and adding promotions just to attract guests.' },
  { point: 'Club growth & retention under pressure', detail: 'Fewer visitors mean fewer chances to acquire loyal members.' },
]
const DEFAULT_CARDS: Card[] = [
  { heading: 'AI-powered hospitality', body: 'Guest intelligence once reserved for luxury brands, for every winery.' },
  { heading: 'Personalization is essential', body: 'Slower demand makes conversion and retention mission-critical.' },
  { heading: 'Relationships beat volume', body: 'Won by better customer relationships, not more wine.' },
]

function introSlide(): SlideConfig {
  return {
    kind: 'intro', bg: 'white', bgImage: BG_IMAGES[0].src, header: 'top', media: 'composition', layout: 'content-image',
    caption: 'Guest Intelligence', headline: "Powering the world's most remarkable wineries",
    description: 'More visitors. More members. More revenue.',
    footnote: 'Jim Secord, Founder, VintigaLabs.com, jim@vintigalabs.com',
    image: '/brand/imagery/compositions/emma-desk-03.jpg', bullets: DEFAULT_BULLETS, cards: DEFAULT_CARDS,
  }
}
function contentSlide(): SlideConfig {
  return {
    ...introSlide(), kind: 'content', layout: 'content-image',
    caption: 'The Problem', headline: 'The winery growth crisis',
    description: 'Wineries are facing unprecedented headwinds.', footnote: '',
    image: '/brand/imagery/locations/wine-barrels.jpg',
  }
}
// First slide is always the intro; the rest are content slides.
const makeSlides = (n: number) => Array.from({ length: n }, (_, i) => (i === 0 ? introSlide() : contentSlide()))

const slideName = (i: number) => (i === 0 ? 'Intro Slide' : `Slide ${i + 1}`)

// A 24×24 mini-diagram of a layout / header option, tinted by `currentColor`.
function Glyph({ kind }: { kind: ContentLayout | IntroHeader }) {
  const lines = (n: number) => (
    <span className="flex-1 flex flex-col justify-center gap-[3px] [&>i]:h-[2.5px] [&>i]:rounded-[1px] [&>i]:bg-current">
      {Array.from({ length: n }, (_, k) => <i key={k} className={k === 0 ? 'w-2/3' : 'w-full'} />)}
    </span>
  )
  const media = <span className="flex-1 h-full rounded-[2px] bg-current/40" />
  if (kind === 'top') {
    return <span className="flex flex-col gap-1 w-6 h-6"><i className="h-[5px] rounded-[1px] bg-current/40" />{lines(2)}</span>
  }
  if (kind === 'left') {
    return <span className="flex gap-1 w-6 h-6"><i className="w-[5px] rounded-[1px] bg-current/40" />{lines(2)}</span>
  }
  if (kind === 'centered') {
    return (
      <span className="flex flex-col items-center justify-center gap-1 w-6 h-6 [&>i]:h-[3px] [&>i]:rounded-[1px] [&>i]:bg-current">
        <i className="w-3" /><i className="w-4" /><i className="w-2.5" />
      </span>
    )
  }
  if (kind === 'cards') {
    return <span className="flex items-center gap-1 w-6 h-6 [&>i]:flex-1 [&>i]:h-3.5 [&>i]:rounded-[2px] [&>i]:bg-current/40"><i /><i /><i /></span>
  }
  // content-image / text-media: text left + media right
  return <span className="flex items-stretch gap-1 w-6 h-6">{lines(kind === 'content-image' ? 3 : 2)}{media}</span>
}

const BG_THEME: Record<SlideBg, { wrap: string; text: string; kicker: string; sub: string; foot: string; card: string }> = {
  white:  { wrap: 'bg-white',              text: 'text-vintiga-slate-900', kicker: 'text-vintiga-indigo-600', sub: 'text-vintiga-indigo-600', foot: 'text-vintiga-slate-500', card: 'border-vintiga-slate-200' },
  black:  { wrap: 'bg-[#0a0a12]',          text: 'text-white',             kicker: 'text-vintiga-indigo-300', sub: 'text-vintiga-indigo-200', foot: 'text-white/55',          card: 'border-white/15' },
  indigo: { wrap: 'bg-vintiga-indigo-700', text: 'text-white',             kicker: 'text-white/75',          sub: 'text-white',             foot: 'text-white/75',          card: 'border-white/25' },
  image:  { wrap: 'bg-vintiga-slate-900',  text: 'text-white',             kicker: 'text-vintiga-indigo-200', sub: 'text-white',             foot: 'text-white/75',          card: 'border-white/25' },
  'image-plain': { wrap: 'bg-vintiga-slate-900', text: 'text-white',       kicker: 'text-vintiga-indigo-200', sub: 'text-white',             foot: 'text-white/75',          card: 'border-white/25' },
}

type Theme = (typeof BG_THEME)[SlideBg]

function SlideText({ slide, theme, align = 'left', big = false }: { slide: SlideConfig; theme: Theme; align?: 'left' | 'center'; big?: boolean }) {
  return (
    <div className={`flex flex-col h-full justify-center gap-[3%] ${align === 'center' ? 'items-center text-center' : ''}`}>
      {slide.caption && <span className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${theme.kicker}`}>{slide.caption}</span>}
      {slide.headline && <h3 className={`font-vintiga-display font-light leading-[1.06] ${big ? 'text-[clamp(20px,3.6vw,42px)]' : 'text-[clamp(15px,2.6vw,30px)]'} ${theme.text}`}>{slide.headline}</h3>}
      {slide.description && <p className={`text-[clamp(9px,1.1vw,14px)] leading-snug ${theme.sub}`}>{slide.description}</p>}
      {slide.footnote && <p className={`text-[8px] leading-snug mt-[6%] ${theme.foot}`}>{slide.footnote}</p>}
    </div>
  )
}

// Title + subtitle + a list of point / detail rows (the "growth crisis" layout).
function BulletBody({ slide, theme }: { slide: SlideConfig; theme: Theme }) {
  return (
    <div className="flex flex-col h-full justify-center gap-[3%]">
      {slide.caption && <span className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${theme.kicker}`}>{slide.caption}</span>}
      {slide.headline && <h3 className={`font-vintiga-display font-light leading-[1.05] text-[clamp(14px,2.2vw,26px)] ${theme.text}`}>{slide.headline}</h3>}
      {slide.description && <p className={`text-[clamp(8px,1vw,12px)] ${theme.sub}`}>{slide.description}</p>}
      <div className="flex flex-col gap-[2.5%] mt-[3%]">
        {slide.bullets.map((b, k) => (
          <div key={k} className="flex flex-col gap-0.5">
            <p className={`text-[clamp(8px,1vw,12px)] font-semibold ${theme.text}`}>{b.point}</p>
            <p className={`text-[7px] leading-snug ${theme.foot}`}>{b.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Title + three icon cards ("the winery business has fundamentally changed").
function CardsBody({ slide, theme }: { slide: SlideConfig; theme: Theme }) {
  const icons = [<SparklesIcon key="s" />, <TrendingUpIcon key="t" />, <UsersIcon key="u" />]
  return (
    <div className="flex flex-col h-full justify-center gap-[6%] px-[6%] py-[9%]">
      <div className="flex flex-col gap-[2%] max-w-[70%]">
        {slide.caption && <span className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${theme.kicker}`}>{slide.caption}</span>}
        {slide.headline && <h3 className={`font-vintiga-display font-light leading-[1.05] text-[clamp(14px,2.2vw,26px)] ${theme.text}`}>{slide.headline}</h3>}
      </div>
      <div className="grid grid-cols-3 gap-[3%]">
        {slide.cards.slice(0, 3).map((c, k) => (
          <div key={k} className={`flex flex-col gap-[10%] rounded-[8px] border p-[9%] ${theme.card}`}>
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${slide.bg === 'white' ? 'bg-vintiga-indigo-50 text-vintiga-indigo-600' : 'bg-white/10 text-white'} [&>svg]:w-3.5 [&>svg]:h-3.5`}>{icons[k]}</span>
            <p className={`text-[clamp(8px,1vw,12px)] font-semibold ${theme.text}`}>{c.heading}</p>
            <p className={`text-[7px] leading-snug ${theme.foot}`}>{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Photo + glass revenue card + avatars pill — the product composition.
function CompositionMedia({ slide }: { slide: SlideConfig }) {
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

// A plain framed image (no glass overlays).
function PlainMedia({ slide }: { slide: SlideConfig }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[86%] aspect-[4/5] max-h-[90%] rounded-[10px] overflow-hidden bg-vintiga-slate-100 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.5)]">
        <img src={slide.image} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}

// The Vintiga mark — the provided icon-only logo. Inverts on dark backgrounds so
// it stays visible (black square on light, white square on dark).
function VintigaMark({ size = 20, invert = false }: { size?: number; invert?: boolean }) {
  const square = invert ? '#FFFFFF' : '#0A0A0A'
  const glyph = invert ? '#0A0A0A' : '#FFFFFF'
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect width="40" height="40" rx="10" fill={square} />
      <path d="M20 21.25C20 16.4175 16.0825 12.5 11.25 12.5H10L10 18.75C10 23.5825 13.9175 27.5 18.75 27.5H20L20 21.25Z" fill={glyph} />
      <path d="M20 21.25C20 16.4175 23.9175 12.5 28.75 12.5H30V18.75C30 23.5825 26.0825 27.5 21.25 27.5H20L20 21.25Z" fill={glyph} />
    </svg>
  )
}

// Live branded 16:9 render of the slide being edited.
function SlidePreview({ slide, index, storeName }: { slide: SlideConfig; index: number; storeName: string }) {
  const theme = BG_THEME[slide.bg]
  const dark = slide.bg !== 'white'
  // Intro with a top header shows a small mark; content slides (and intro-left)
  // use the vertical rail — store name + logo + page number.
  const useRail = slide.kind === 'content' || (slide.kind === 'intro' && slide.header === 'left')

  let body: ReactNode
  if (slide.kind === 'intro') {
    if (slide.media === 'none') {
      body = <div className="absolute inset-0 flex flex-col justify-center px-[7%] py-[10%]"><SlideText slide={slide} theme={theme} big /></div>
    } else {
      const mediaEl = slide.media === 'composition' ? <CompositionMedia slide={slide} /> : <PlainMedia slide={slide} />
      body = (
        <div className="absolute inset-0 grid grid-cols-2 gap-[4%] px-[6%] py-[9%]">
          <SlideText slide={slide} theme={theme} />{mediaEl}
        </div>
      )
    }
  } else if (slide.layout === 'content-image') {
    body = (
      <div className="absolute inset-0 grid grid-cols-2 gap-[4%] px-[6%] py-[9%]">
        <BulletBody slide={slide} theme={theme} /><PlainMedia slide={slide} />
      </div>
    )
  } else if (slide.layout === 'cards') {
    body = <div className="absolute inset-0"><CardsBody slide={slide} theme={theme} /></div>
  } else if (slide.layout === 'centered') {
    body = <div className="absolute inset-0 px-[12%] py-[12%]"><SlideText slide={slide} theme={theme} align="center" /></div>
  } else {
    body = (
      <div className="absolute inset-0 grid grid-cols-2 gap-[4%] px-[6%] py-[9%]">
        <SlideText slide={slide} theme={theme} /><CompositionMedia slide={slide} />
      </div>
    )
  }

  return (
    <div className={`relative w-full aspect-[16/9] rounded-vintiga-2xl overflow-hidden border border-vintiga-border shadow-sm ${theme.wrap}`}>
      {(slide.bg === 'image' || slide.bg === 'image-plain') && (
        <>
          <img src={slide.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          {slide.bg === 'image' && <div className="absolute inset-0 bg-black/65" />}
        </>
      )}

      {useRail ? (
        <div className={`absolute left-0 inset-y-0 w-[8%] border-r ${theme.card} flex flex-col items-center justify-between py-[6%] z-10`}>
          <div className="flex flex-col items-center gap-3">
            <span className={`[writing-mode:vertical-rl] rotate-180 text-[9px] tracking-wide whitespace-nowrap ${theme.text}`}>{storeName}</span>
            <VintigaMark size={20} invert={dark} />
          </div>
          <span className={`text-[9px] tabular-nums ${theme.foot}`}>{String(index + 1).padStart(2, '0')}</span>
        </div>
      ) : (
        <div className="absolute left-[3%] top-[4%] z-10"><VintigaMark size={20} invert={dark} /></div>
      )}

      <div className={useRail ? 'absolute inset-0 left-[8%]' : 'contents'}>{body}</div>
    </div>
  )
}

// Turn the answers into a precise, copy-ready spec for Claude Code to build from.
function buildPrompt(slides: SlideConfig[], closing: boolean, storeName: string): string {
  const out: string[] = []
  out.push(`Build a Vintiga presentation deck — ${slides.length} slide${slides.length === 1 ? '' : 's'}${closing ? ' plus a closing slide' : ''}.`)
  out.push('')
  out.push('Conventions: fully branded with Vintiga tokens + Inter, the same entrance animations as the existing "Vintiga Overview" deck, one dominant colour (indigo), a visual on every slide, and mobile responsive. Build from the presentation blocks in src/presentations/blocks/blocks.tsx (kicker · display title · lead · footnote · icon cards) and the glass blocks for product imagery. Add it as a new screen under src/presentations/ and register it like the other decks.')
  out.push('')
  out.push(`Deck chrome: the Vintiga icon mark, the store name "${storeName}", and the page number — shown top-left on intro slides with a top header, and down a vertical left rail on content slides (and the left-header intro).`)
  out.push('')
  slides.forEach((s, i) => {
    const bgLine =
      s.bg === 'image' ? `image (${s.bgImage}) under a 65% black overlay; text in white`
      : s.bg === 'image-plain' ? `image (${s.bgImage}) as a full background, no overlay; text in white`
      : BG_LABEL[s.bg]
    if (s.kind === 'intro') {
      out.push(`Slide ${i + 1} — Intro · header ${s.header === 'left' ? 'on the left (vertical)' : 'across the top'}`)
      out.push(`- Background: ${bgLine}.`)
      out.push(`- Media: ${s.media === 'none' ? 'none — full-width headline' : s.media === 'composition' ? `product composition over ${s.image} (glass revenue card + avatars pill)` : `plain image (${s.image})`}`)
      if (s.caption)     out.push(`- Caption (kicker): ${s.caption}`)
      if (s.headline)    out.push(`- Headline: ${s.headline}`)
      if (s.description) out.push(`- Description: ${s.description}`)
      if (s.footnote)    out.push(`- Footnote: ${s.footnote}`)
    } else {
      out.push(`Slide ${i + 1} — ${CONTENT_LAYOUTS.find((l) => l.value === s.layout)?.label}`)
      out.push(`- Background: ${bgLine}.`)
      if (s.caption)  out.push(`- Eyebrow: ${s.caption}`)
      if (s.headline) out.push(`- Title: ${s.headline}`)
      if (s.description && s.layout !== 'cards') out.push(`- Subtitle: ${s.description}`)
      if (s.layout === 'content-image') {
        out.push(`- Image: ${s.image}`)
        s.bullets.forEach((b) => out.push(`- Point: ${b.point} — ${b.detail}`))
      } else if (s.layout === 'cards') {
        s.cards.slice(0, 3).forEach((c) => out.push(`- Card: ${c.heading} — ${c.body}`))
      } else if (s.layout === 'text-media') {
        out.push(`- Media: product composition over ${s.image}`)
      }
    }
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
  const [slides, setSlides] = useState<SlideConfig[]>(() => (pbInit.count ? makeSlides(pbInit.count) : []))
  const [idx, setIdx] = useState(pbInit.idx)
  const [closing, setClosing] = useState(true)
  const [copied, setCopied] = useState(false)
  const [storeName, setStoreName] = useState('Vintiga Labs, LLC')

  function begin() {
    if (!count) return
    setSlides(makeSlides(count))
    setIdx(0)
    setPhase('pages')
  }
  function update(patch: Partial<SlideConfig>) {
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)))
  }
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(buildPrompt(slides, closing, storeName))
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
            <pre className="whitespace-pre-wrap font-mono typo-body-sm text-vintiga-slate-100 leading-relaxed overflow-x-auto">{buildPrompt(slides, closing, storeName)}</pre>
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
  const isIntro = slide.kind === 'intro'
  const onImage = slide.bg === 'image' || slide.bg === 'image-plain'

  const updateBullet = (k: number, patch: Partial<Bullet>) =>
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, bullets: s.bullets.map((b, j) => (j === k ? { ...b, ...patch } : b)) } : s)))
  const updateCard = (k: number, patch: Partial<Card>) =>
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, cards: s.cards.map((c, j) => (j === k ? { ...c, ...patch } : c)) } : s)))

  const field = (k: 'caption' | 'headline' | 'description' | 'footnote' | 'image', label: string, placeholder: string) => (
    <label className="flex flex-col gap-1.5">
      <span className="typo-caption font-semibold text-vintiga-foreground">{label}</span>
      <TextField value={slide[k]} onChange={(e) => update({ [k]: e.target.value } as Partial<SlideConfig>)} placeholder={placeholder} />
    </label>
  )

  const optionBtn = <T extends string>(value: T, current: T, onClick: () => void, label: string, kind: ContentLayout | IntroHeader) => (
    <button key={value} type="button" onClick={onClick} aria-label={label} title={label}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-vintiga-md border transition-colors ${current === value ? 'border-vintiga-primary bg-vintiga-primary-soft text-vintiga-primary' : 'border-vintiga-border text-vintiga-foreground-muted hover:border-vintiga-slate-400'}`}>
      <Glyph kind={kind} />
    </button>
  )

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
            <div className="flex items-center gap-vintiga-sm">
              <h2 className="typo-title-section font-semibold text-vintiga-foreground">{slideName(idx)}</h2>
              {isIntro && <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-primary bg-vintiga-primary-soft rounded-full px-2 py-0.5">Intro</span>}
            </div>

            {/* Header (intro) / Layout (content) + Background */}
            <div className="flex flex-col sm:flex-row gap-vintiga-md">
              <div className="flex flex-col gap-vintiga-sm rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-lg">
                <span className="typo-caption font-semibold text-vintiga-foreground-muted">{isIntro ? 'Header' : 'Layout'}</span>
                <div className="flex items-center gap-vintiga-sm">
                  {isIntro
                    ? (['top', 'left'] as IntroHeader[]).map((h) => optionBtn(h, slide.header, () => update({ header: h }), h === 'top' ? 'Header across the top' : 'Header on the left', h))
                    : CONTENT_LAYOUTS.map((l) => optionBtn(l.value, slide.layout, () => update({ layout: l.value }), l.label, l.value))}
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
                    { value: 'image-plain', label: 'Image' },
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

            {/* Media — intro only */}
            {isIntro && (
              <div className="flex flex-col gap-vintiga-sm rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-lg">
                <span className="typo-caption font-semibold text-vintiga-foreground-muted">Media</span>
                <SegmentedControl<IntroMedia>
                  value={slide.media}
                  onChange={(v) => update({ media: v })}
                  options={[{ value: 'composition', label: 'Composition' }, { value: 'image', label: 'Image' }, { value: 'none', label: 'None' }]}
                />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col gap-vintiga-md rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-lg">
              <span className="typo-caption font-semibold text-vintiga-foreground-muted">Content</span>
              {isIntro ? (
                <>
                  <label className="flex flex-col gap-1.5">
                    <span className="typo-caption font-semibold text-vintiga-foreground">Store name <span className="text-vintiga-foreground-muted font-normal">(logo, all slides)</span></span>
                    <TextField value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Vintiga Labs, LLC" />
                  </label>
                  {field('caption', 'Caption', 'Guest Intelligence')}
                  {field('headline', 'Headline', "Powering the world's most remarkable wineries")}
                  {field('description', 'Description', 'More visitors. More members. More revenue.')}
                  {field('footnote', 'Footnote', 'Name, role, site, email')}
                  {slide.media !== 'none' && field('image', 'Image link', '/brand/imagery/…')}
                </>
              ) : slide.layout === 'cards' ? (
                <>
                  {field('caption', 'Eyebrow', 'Why Vintiga Now?')}
                  {field('headline', 'Title', 'The winery business has fundamentally changed')}
                  <div className="flex flex-col gap-vintiga-sm">
                    <span className="typo-caption font-semibold text-vintiga-foreground">Cards</span>
                    {slide.cards.slice(0, 3).map((c, k) => (
                      <div key={k} className="flex flex-col gap-1.5 rounded-vintiga-md border border-vintiga-border p-vintiga-sm">
                        <TextField value={c.heading} onChange={(e) => updateCard(k, { heading: e.target.value })} placeholder={`Card ${k + 1} heading`} />
                        <TextField value={c.body} onChange={(e) => updateCard(k, { body: e.target.value })} placeholder="Card body" />
                      </div>
                    ))}
                  </div>
                </>
              ) : slide.layout === 'content-image' ? (
                <>
                  {field('caption', 'Eyebrow', 'The Problem')}
                  {field('headline', 'Title', 'The winery growth crisis')}
                  {field('description', 'Subtitle', 'Wineries are facing unprecedented headwinds.')}
                  {field('image', 'Image link', '/brand/imagery/…')}
                  <div className="flex flex-col gap-vintiga-sm">
                    <span className="typo-caption font-semibold text-vintiga-foreground">Points</span>
                    {slide.bullets.map((b, k) => (
                      <div key={k} className="flex flex-col gap-1.5 rounded-vintiga-md border border-vintiga-border p-vintiga-sm">
                        <TextField value={b.point} onChange={(e) => updateBullet(k, { point: e.target.value })} placeholder={`Point ${k + 1}`} />
                        <TextField value={b.detail} onChange={(e) => updateBullet(k, { detail: e.target.value })} placeholder="Detail" />
                      </div>
                    ))}
                  </div>
                </>
              ) : slide.layout === 'centered' ? (
                <>
                  {field('caption', 'Caption', 'Guest Intelligence')}
                  {field('headline', 'Headline', 'Headline')}
                  {field('description', 'Description', 'Supporting line')}
                </>
              ) : (
                <>
                  {field('caption', 'Caption', 'Guest Intelligence')}
                  {field('headline', 'Headline', 'Headline')}
                  {field('description', 'Description', 'Supporting line')}
                  {field('footnote', 'Footnote', 'Name, role, site, email')}
                  {field('image', 'Image link', '/brand/imagery/…')}
                </>
              )}
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
            <SlidePreview slide={slide} index={idx} storeName={storeName} />
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
