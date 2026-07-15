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

// The Vintiga mark — the icon-only logo. Inverts on dark backgrounds so it stays
// visible (black square on light, white square on dark).
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

// The provided vertical lockup (Logo.svg) — icon + "Vintiga" wordmark. Inverts on
// dark backgrounds. Height-driven; width follows the 40:143 aspect.
function VintigaLockup({ invert = false, className = '' }: { invert?: boolean; className?: string }) {
  const dark = invert ? '#FFFFFF' : '#0A0A0A' // icon square + wordmark
  const light = invert ? '#0A0A0A' : '#FFFFFF' // glyph
  return (
    <svg viewBox="0 0 40 143" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-auto ${className}`}>
      <rect x="6.25073e-06" y="143" width="40" height="40" rx="10" transform="rotate(-90 6.25073e-06 143)" fill={dark} />
      <path d="M21.25 123C16.4175 123 12.5 126.918 12.5 131.75L12.5 133L18.75 133C23.5825 133 27.5 129.082 27.5 124.25L27.5 123L21.25 123Z" fill={light} />
      <path d="M21.25 123C16.4175 123 12.5 119.082 12.5 114.25L12.5 113L18.75 113C23.5825 113 27.5 116.918 27.5 121.75L27.5 123L21.25 123Z" fill={light} />
      <path d="M14.3636 92.7045L23.8409 89.4659L23.8409 89.3352L14.3636 86.0966L14.3636 84.1989L26 88.3864L26 90.4148L14.3636 94.6023L14.3636 92.7045ZM26 82.6548L17.2727 82.6548L17.2727 80.956L26 80.956L26 82.6548ZM15.9261 81.7969C15.9261 82.0923 15.8277 82.3461 15.6307 82.5582C15.4299 82.7666 15.1913 82.8707 14.9148 82.8707C14.6345 82.8707 14.3958 82.7666 14.1989 82.5582C13.9981 82.3461 13.8977 82.0923 13.8977 81.7969C13.8977 81.5014 13.9981 81.2495 14.1989 81.0412C14.3958 80.8291 14.6345 80.723 14.9148 80.723C15.1913 80.723 15.4299 80.8291 15.6307 81.0412C15.8277 81.2495 15.9261 81.5014 15.9261 81.7969ZM20.8182 76.9716L26 76.9716L26 78.6705L17.2727 78.6705L17.2727 77.0398L18.6932 77.0398L18.6932 76.9318C18.2311 76.7311 17.8599 76.4167 17.5796 75.9886C17.2992 75.5568 17.1591 75.0133 17.1591 74.358C17.1591 73.7633 17.2841 73.2424 17.5341 72.7955C17.7803 72.3485 18.1477 72.0019 18.6364 71.7557C19.125 71.5095 19.7292 71.3864 20.4489 71.3864L26 71.3864L26 73.0852L20.6534 73.0852C20.0208 73.0852 19.5265 73.25 19.1705 73.5795C18.8106 73.9091 18.6307 74.3617 18.6307 74.9375C18.6307 75.3314 18.7159 75.6818 18.8864 75.9886C19.0568 76.2917 19.3068 76.5322 19.6364 76.7102C19.9621 76.8845 20.3561 76.9716 20.8182 76.9716ZM17.2727 65.0341L18.6364 65.0341L18.6364 69.8011L17.2727 69.8011L17.2727 65.0341ZM15.1818 68.5227L15.1818 66.8239L23.4375 66.8239C23.7671 66.8239 24.0152 66.7746 24.1818 66.6761C24.3447 66.5777 24.4564 66.4508 24.5171 66.2955C24.5739 66.1364 24.6023 65.964 24.6023 65.7784C24.6023 65.642 24.5928 65.5227 24.5739 65.4205C24.5549 65.3182 24.5398 65.2386 24.5284 65.1818L25.9318 64.875C25.9697 64.9735 26.0076 65.1136 26.0455 65.2955C26.0871 65.4773 26.1099 65.7045 26.1136 65.9773C26.1212 66.4242 26.0417 66.8409 25.875 67.2273C25.7083 67.6136 25.4508 67.9261 25.1023 68.1648C24.7538 68.4034 24.3163 68.5227 23.7898 68.5227L15.1818 68.5227ZM26 63.1548L17.2727 63.1548L17.2727 61.456L26 61.456L26 63.1548ZM15.9261 62.2969C15.9261 62.5923 15.8277 62.8461 15.6307 63.0582C15.4299 63.2666 15.1913 63.3707 14.9148 63.3707C14.6345 63.3707 14.3958 63.2666 14.1989 63.0582C13.9981 62.8461 13.8977 62.5923 13.8977 62.2969C13.8977 62.0014 13.9981 61.7495 14.1989 61.5412C14.3958 61.3291 14.6345 61.223 14.9148 61.223C15.1913 61.223 15.4299 61.3291 15.6307 61.5412C15.8277 61.7495 15.9261 62.0014 15.9261 62.2969ZM29.4546 55.5114C29.4546 56.2045 29.3636 56.8011 29.1818 57.3011C29 57.7973 28.7595 58.2027 28.4602 58.517C28.161 58.8314 27.8333 59.0663 27.4773 59.2216L26.875 57.7614C27.0417 57.6591 27.2178 57.5227 27.4034 57.3523C27.5928 57.178 27.7538 56.9432 27.8864 56.6477C28.0189 56.3485 28.0852 55.964 28.0852 55.4943C28.0852 54.8504 27.928 54.3182 27.6136 53.8977C27.303 53.4773 26.8068 53.267 26.125 53.267L24.4091 53.267L24.4091 53.375C24.5947 53.4773 24.8011 53.625 25.0284 53.8182C25.2557 54.0076 25.4527 54.2689 25.6193 54.6023C25.786 54.9356 25.8693 55.3693 25.8693 55.9034C25.8693 56.5928 25.7083 57.214 25.3864 57.767C25.0606 58.3163 24.5814 58.7519 23.9489 59.0739C23.3125 59.392 22.5303 59.5511 21.6023 59.5511C20.6742 59.5511 19.8788 59.3939 19.2159 59.0795C18.553 58.7614 18.0455 58.3258 17.6932 57.7727C17.3371 57.2197 17.1591 56.5928 17.1591 55.892C17.1591 55.3504 17.25 54.9129 17.4318 54.5795C17.6099 54.2462 17.8182 53.9867 18.0568 53.8011C18.2955 53.6117 18.5057 53.4659 18.6875 53.3636L18.6875 53.2386L17.2727 53.2386L17.2727 51.5739L26.1932 51.5739C26.9432 51.5739 27.5587 51.7481 28.0398 52.0966C28.5208 52.4451 28.8769 52.9167 29.108 53.5114C29.339 54.1023 29.4545 54.7689 29.4546 55.5114ZM24.4602 55.5284C24.4602 55.0398 24.3466 54.6269 24.1193 54.2898C23.8883 53.9489 23.5587 53.6913 23.1307 53.517C22.6989 53.339 22.1818 53.25 21.5795 53.25C20.9924 53.25 20.4754 53.3371 20.0284 53.5114C19.5814 53.6856 19.233 53.9413 18.983 54.2784C18.7292 54.6155 18.6023 55.0322 18.6023 55.5284C18.6023 56.0398 18.7349 56.4659 19 56.8068C19.2614 57.1477 19.6174 57.4053 20.0682 57.5795C20.5189 57.75 21.0227 57.8352 21.5796 57.8352C22.1515 57.8352 22.6534 57.7481 23.0852 57.5739C23.5171 57.3996 23.8542 57.142 24.0966 56.8011C24.339 56.4564 24.4602 56.0322 24.4602 55.5284ZM26.1932 46.7557C26.1932 47.3087 26.0909 47.8087 25.8864 48.2557C25.678 48.7027 25.3769 49.0568 24.983 49.3182C24.589 49.5758 24.1061 49.7045 23.5341 49.7045C23.0417 49.7045 22.6364 49.6098 22.3182 49.4205C22 49.2311 21.7481 48.9754 21.5625 48.6534C21.3769 48.3314 21.2367 47.9716 21.142 47.5739C21.0474 47.1761 20.9754 46.7708 20.9261 46.358C20.8655 45.8352 20.8163 45.411 20.7784 45.0852C20.7367 44.7595 20.6705 44.5227 20.5795 44.375C20.4886 44.2273 20.3409 44.1534 20.1364 44.1534L20.0966 44.1534C19.6004 44.1534 19.2159 44.2936 18.9432 44.5739C18.6705 44.8504 18.5341 45.2633 18.5341 45.8125C18.5341 46.3845 18.661 46.8352 18.9148 47.1648C19.1648 47.4905 19.4432 47.7159 19.75 47.8409L19.3864 49.4375C18.8561 49.2481 18.428 48.9716 18.1023 48.608C17.7727 48.2405 17.5341 47.8182 17.3864 47.3409C17.2349 46.8636 17.1591 46.3617 17.1591 45.8352C17.1591 45.4867 17.2008 45.1174 17.2841 44.7273C17.3636 44.3333 17.5114 43.9659 17.7273 43.625C17.9432 43.2803 18.2519 42.9981 18.6534 42.7784C19.0511 42.5587 19.5682 42.4489 20.2045 42.4489L26 42.4489L26 44.108L24.8068 44.108L24.8068 44.1761C25.0265 44.286 25.2424 44.4508 25.4545 44.6705C25.6667 44.8902 25.8428 45.1723 25.983 45.517C26.1231 45.8617 26.1932 46.2746 26.1932 46.7557ZM24.8295 46.3864C24.8295 45.9167 24.7367 45.5152 24.5511 45.1818C24.3655 44.8447 24.1231 44.589 23.8239 44.4148C23.5208 44.2367 23.197 44.1477 22.8523 44.1477L21.7273 44.1477C21.7879 44.2083 21.8447 44.3258 21.8977 44.5C21.947 44.6705 21.9905 44.8655 22.0284 45.0852C22.0625 45.3049 22.0947 45.5189 22.125 45.7273C22.1515 45.9356 22.1742 46.1098 22.1932 46.25C22.2349 46.5795 22.3049 46.8807 22.4034 47.1534C22.5019 47.4223 22.6439 47.6383 22.8295 47.8011C23.0114 47.9602 23.2538 48.0398 23.5568 48.0398C23.9773 48.0398 24.2955 47.8845 24.5114 47.5739C24.7235 47.2633 24.8295 46.8674 24.8295 46.3864ZM26 35.8153L14.3636 35.8153L14.3636 34.0597L24.4886 34.0597L24.4886 28.7869L26 28.7869L26 35.8153ZM26.1932 24.3807C26.1932 24.9337 26.0909 25.4337 25.8864 25.8807C25.678 26.3277 25.3769 26.6818 24.983 26.9432C24.589 27.2008 24.1061 27.3295 23.5341 27.3295C23.0417 27.3295 22.6364 27.2348 22.3182 27.0455C22 26.8561 21.7481 26.6004 21.5625 26.2784C21.3769 25.9564 21.2367 25.5966 21.142 25.1989C21.0474 24.8011 20.9754 24.3958 20.9261 23.983C20.8655 23.4602 20.8163 23.036 20.7784 22.7102C20.7367 22.3845 20.6705 22.1477 20.5795 22C20.4886 21.8523 20.3409 21.7784 20.1364 21.7784L20.0966 21.7784C19.6004 21.7784 19.2159 21.9186 18.9432 22.1989C18.6705 22.4754 18.5341 22.8883 18.5341 23.4375C18.5341 24.0095 18.661 24.4602 18.9148 24.7898C19.1648 25.1155 19.4432 25.3409 19.75 25.4659L19.3864 27.0625C18.8561 26.8731 18.428 26.5966 18.1023 26.233C17.7727 25.8655 17.5341 25.4432 17.3864 24.9659C17.2349 24.4886 17.1591 23.9867 17.1591 23.4602C17.1591 23.1117 17.2008 22.7424 17.2841 22.3523C17.3636 21.9583 17.5114 21.5909 17.7273 21.25C17.9432 20.9053 18.2519 20.6231 18.6534 20.4034C19.0511 20.1837 19.5682 20.0739 20.2045 20.0739L26 20.0739L26 21.733L24.8068 21.733L24.8068 21.8011C25.0265 21.911 25.2424 22.0758 25.4545 22.2955C25.6667 22.5152 25.8428 22.7973 25.983 23.142C26.1231 23.4867 26.1932 23.8996 26.1932 24.3807ZM24.8295 24.0114C24.8295 23.5417 24.7367 23.1402 24.5511 22.8068C24.3655 22.4697 24.1231 22.214 23.8239 22.0398C23.5208 21.8617 23.197 21.7727 22.8523 21.7727L21.7273 21.7727C21.7879 21.8333 21.8447 21.9508 21.8977 22.125C21.947 22.2955 21.9905 22.4905 22.0284 22.7102C22.0625 22.9299 22.0947 23.1439 22.125 23.3523C22.1515 23.5606 22.1742 23.7348 22.1932 23.875C22.2349 24.2045 22.3049 24.5057 22.4034 24.7784C22.5019 25.0473 22.6439 25.2633 22.8295 25.4261C23.0114 25.5852 23.2538 25.6648 23.5568 25.6648C23.9773 25.6648 24.2955 25.5095 24.5114 25.1989C24.7235 24.8883 24.8295 24.4924 24.8295 24.0114ZM26 17.6747L14.3636 17.6747L14.3636 15.9759L18.6875 15.9759L18.6875 15.8736C18.5057 15.7751 18.2955 15.6331 18.0568 15.4474C17.8182 15.2618 17.6099 15.0043 17.4318 14.6747C17.25 14.3452 17.1591 13.9096 17.1591 13.3679C17.1591 12.6634 17.3371 12.0346 17.6932 11.4815C18.0492 10.9285 18.5625 10.4948 19.233 10.1804C19.9034 9.86222 20.7102 9.70313 21.6534 9.70313C22.5966 9.70313 23.4053 9.86032 24.0795 10.1747C24.75 10.4891 25.267 10.9209 25.6307 11.4702C25.9905 12.0194 26.1705 12.6463 26.1705 13.3509C26.1705 13.8812 26.0814 14.3149 25.9034 14.652C25.7254 14.9853 25.517 15.2467 25.2784 15.4361C25.0398 15.6255 24.8277 15.7713 24.642 15.8736L24.642 16.0156L26 16.0156L26 17.6747ZM21.6364 16.0099C22.25 16.0099 22.7879 15.9209 23.25 15.7429C23.7121 15.5649 24.0739 15.3073 24.3352 14.9702C24.5928 14.6331 24.7216 14.2202 24.7216 13.7315C24.7216 13.224 24.5871 12.7997 24.3182 12.4588C24.0455 12.1179 23.6761 11.8603 23.2102 11.6861C22.7443 11.5081 22.2197 11.419 21.6364 11.419C21.0606 11.419 20.5436 11.5062 20.0852 11.6804C19.6269 11.8509 19.2652 12.1084 19 12.4531C18.7349 12.794 18.6023 13.2202 18.6023 13.7315C18.6023 14.224 18.7292 14.6406 18.983 14.9815C19.2367 15.3187 19.5909 15.5743 20.0455 15.7486C20.5 15.9228 21.0303 16.0099 21.6364 16.0099ZM19.4034 1.25568L19.6761 2.79546C19.4792 2.85985 19.2917 2.96212 19.1136 3.10227C18.9356 3.23864 18.7898 3.42424 18.6761 3.65909C18.5625 3.89394 18.5057 4.1875 18.5057 4.53977C18.5057 5.02083 18.6136 5.42235 18.8295 5.74432C19.0417 6.06629 19.3163 6.22727 19.6534 6.22727C19.9451 6.22727 20.1799 6.11932 20.358 5.90341C20.536 5.6875 20.6818 5.33902 20.7955 4.85796L21.1136 3.47159C21.2992 2.66856 21.5852 2.07008 21.9716 1.67614C22.358 1.2822 22.8599 1.08523 23.4773 1.08523C24 1.08523 24.4659 1.23674 24.875 1.53977C25.2803 1.83902 25.5985 2.25758 25.8295 2.79546C26.0606 3.32955 26.1761 3.94886 26.1761 4.65341C26.1761 5.63068 25.9678 6.42803 25.5511 7.04546C25.1307 7.66288 24.5341 8.04167 23.7614 8.18182L23.5114 6.53977C23.9394 6.4375 24.2633 6.22727 24.483 5.90909C24.6989 5.59091 24.8068 5.17614 24.8068 4.66477C24.8068 4.10796 24.6913 3.66288 24.4602 3.32955C24.2254 2.99621 23.9394 2.82955 23.6023 2.82955C23.3295 2.82955 23.1004 2.93182 22.9148 3.13636C22.7292 3.33712 22.589 3.64583 22.4943 4.0625L22.1705 5.53977C21.9849 6.35417 21.6894 6.95644 21.2841 7.34659C20.8788 7.73296 20.3655 7.92614 19.7443 7.92614C19.2292 7.92614 18.7784 7.7822 18.392 7.49432C18.0057 7.20644 17.7045 6.80871 17.4886 6.30114C17.2689 5.79356 17.1591 5.21212 17.1591 4.55682C17.1591 3.61364 17.3636 2.87121 17.7727 2.32955C18.178 1.78788 18.7216 1.42993 19.4034 1.25568Z" fill={dark} />
    </svg>
  )
}

// Live branded 16:9 render of the slide being edited.
function SlidePreview({ slide, index }: { slide: SlideConfig; index: number }) {
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
          <VintigaLockup invert={dark} className="h-[15%]" />
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
function buildPrompt(slides: SlideConfig[], closing: boolean): string {
  const out: string[] = []
  out.push(`Build a Vintiga presentation deck — ${slides.length} slide${slides.length === 1 ? '' : 's'}${closing ? ' plus a closing slide' : ''}.`)
  out.push('')
  out.push('Conventions: fully branded with Vintiga tokens + Inter, the same entrance animations as the existing "Vintiga Overview" deck, one dominant colour (indigo), a visual on every slide, and mobile responsive. Build from the presentation blocks in src/presentations/blocks/blocks.tsx (kicker · display title · lead · footnote · icon cards) and the glass blocks for product imagery. Add it as a new screen under src/presentations/ and register it like the other decks.')
  out.push('')
  out.push('Deck chrome: the Vintiga vertical logo lockup (icon + "Vintiga" wordmark) and the page number — shown top-left on intro slides with a top header, and down a vertical left rail (with a divider) on content slides and the left-header intro.')
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
            <SlidePreview slide={slide} index={idx} />
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
