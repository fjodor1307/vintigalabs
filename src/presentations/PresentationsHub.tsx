import { useState, type ReactNode } from 'react'
import { HubNavbar } from '../hub/HubNavbar'
import type { Segment } from '../hub/segments'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { Button } from '@ds/shared/Button'
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

type BlockKind = 'title' | 'stats' | 'icons' | 'glass' | 'revenue' | 'avatars' | 'frame'

const BLOCK_KINDS: { value: BlockKind; label: string }[] = [
  { value: 'title', label: 'Title & text' },
  { value: 'stats', label: 'Stat row' },
  { value: 'icons', label: 'Icon cards' },
  { value: 'glass', label: 'Glass stat' },
  { value: 'revenue', label: 'Glass revenue card' },
  { value: 'avatars', label: 'Glass avatars pill' },
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
    case 'revenue':
      return <BlockGlassRevenue rounded />
    case 'avatars':
      return <BlockAvatarsPill />
    case 'frame':
      return <BlockFrame src="/brand/imagery/locations/wine-barrels.jpg" alt="Oak wine barrels" className="w-full max-w-xl aspect-[16/9]" />
  }
}

const BG_IMAGES = [
  { src: '/brand/imagery/locations/estate-terrace.jpg', label: 'Estate terrace' },
  { src: '/brand/imagery/locations/wine-barrels.jpg',   label: 'Wine barrels' },
  { src: '/brand/imagery/compositions/emma-desk-03.jpg', label: 'Desk' },
  { src: '/brand/imagery/locations/garden-path.jpg',    label: 'Garden path' },
]

const PAGE_COUNTS = [5, 10, 20]

interface PageConfig { bg: 'white' | 'image'; bgImage: string; blocks: BlockKind[] }

const blockLabel = (k: BlockKind) => BLOCK_KINDS.find((b) => b.value === k)?.label ?? k
const bgLabelOf = (src: string) => BG_IMAGES.find((i) => i.src === src)?.label ?? src

// Turn the answers into a precise, copy-ready spec for Claude Code to build from.
function buildPrompt(pages: PageConfig[], closing: boolean): string {
  const out: string[] = []
  out.push(`Build a Vintiga presentation deck — ${pages.length} page${pages.length === 1 ? '' : 's'}${closing ? ' plus a closing slide' : ''}.`)
  out.push('')
  out.push('Conventions: fully branded with Vintiga tokens, dark cinematic imagery where used, the same entrance animations as the existing "Vintiga Overview" deck, and mobile responsive. Assemble every page ONLY from the presentation blocks in src/presentations/blocks/blocks.tsx — Title & text, Stat row, Icon cards, Glass stat, Glass revenue card, Glass avatars pill, Framed media. Add it as a new screen under src/presentations/ and register it like the other decks.')
  out.push('')
  pages.forEach((p, i) => {
    out.push(`Page ${i + 1}`)
    out.push(p.bg === 'image'
      ? `- Background: image "${bgLabelOf(p.bgImage)}" (${p.bgImage}) under a 50% black overlay; render text in white.`
      : '- Background: solid white.')
    out.push(`- Elements, top to bottom: ${p.blocks.length ? p.blocks.map(blockLabel).join(', ') : '(none selected — leave a blank section)'}.`)
    out.push('')
  })
  if (closing) {
    out.push(`Closing slide (page ${pages.length + 1})`)
    out.push('- A short, calm sign-off written from the themes above — one line like "That\'s Vintiga." with a single summarizing sentence. No new data; echo the story the pages tell.')
    out.push('')
  }
  return out.join('\n').trimEnd()
}

// A questionnaire, not a live editor (we can't build decks live yet). Walks you
// through page count → per-page background + elements (with a live preview) → an
// optional auto-written closing slide → a copy-ready PROMPT to paste into Claude
// Code, which then builds the real deck.
export function PageBuilderScreen() {
  const [phase, setPhase] = useState<'setup' | 'pages' | 'prompt'>('setup')
  const [count, setCount] = useState<number | null>(null)
  const [pages, setPages] = useState<PageConfig[]>([])
  const [idx, setIdx] = useState(0)
  const [closing, setClosing] = useState(true)
  const [copied, setCopied] = useState(false)

  function begin() {
    if (!count) return
    setPages(Array.from({ length: count }, () => ({ bg: 'white', bgImage: BG_IMAGES[0].src, blocks: ['title'] as BlockKind[] })))
    setIdx(0)
    setPhase('pages')
  }
  function update(patch: Partial<PageConfig>) {
    setPages((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)))
  }
  function toggleBlock(k: BlockKind) {
    setPages((prev) => prev.map((p, i) => {
      if (i !== idx) return p
      return { ...p, blocks: p.blocks.includes(k) ? p.blocks.filter((b) => b !== k) : [...p.blocks, k] }
    }))
  }
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(buildPrompt(pages, closing))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked — user can still select the text */ }
  }

  // ── Step 1 · how many pages ──────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <PresentationsShell title="Page Builder" subtitle="Answer a few questions and get a copy-ready prompt for Claude Code — it can't build the deck live yet, so this hands you the exact spec.">
        <div className="max-w-xl flex flex-col gap-vintiga-lg rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-xl">
          <div className="flex flex-col gap-1">
            <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-primary">Step 1 of 3</span>
            <h2 className="typo-title-section font-semibold text-vintiga-foreground">How many pages do you want?</h2>
            <p className="typo-body-sm text-vintiga-foreground-muted">You'll set the background and elements for each one next.</p>
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
      <PresentationsShell title="Page Builder" subtitle="The exact spec for your deck — paste it into Claude Code.">
        <div className="max-w-3xl flex flex-col gap-vintiga-lg">
          <div className="flex flex-col gap-1">
            <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-primary">Step 3 of 3 · Your prompt</span>
            <h2 className="typo-title-section font-semibold text-vintiga-foreground">Paste this into Claude Code</h2>
            <p className="typo-body-sm text-vintiga-foreground-muted">
              We can't build the deck live yet — this is the spec for {pages.length} page{pages.length === 1 ? '' : 's'}{closing ? ' plus a closing slide' : ''}. Claude Code follows it to build the presentation.
            </p>
          </div>
          <div className="rounded-vintiga-card border border-vintiga-border bg-vintiga-slate-900 p-vintiga-lg">
            <pre className="whitespace-pre-wrap font-mono typo-body-sm text-vintiga-slate-100 leading-relaxed overflow-x-auto">{buildPrompt(pages, closing)}</pre>
          </div>
          <div className="flex flex-wrap items-center gap-vintiga-sm">
            <Button leftIcon={copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />} onClick={copyPrompt}>{copied ? 'Copied' : 'Copy prompt'}</Button>
            <Button variant="outline" leftIcon={<BackArrowIcon className="w-4 h-4" />} onClick={() => { setPhase('pages'); setIdx(pages.length - 1) }}>Back to pages</Button>
            <Button variant="outline" onClick={() => { setPhase('setup'); setCount(null) }}>Start over</Button>
          </div>
        </div>
      </PresentationsShell>
    )
  }

  // ── Step 2 · page by page ────────────────────────────────────────────────────
  const page = pages[idx]
  const isLast = idx === pages.length - 1
  const onImage = page.bg === 'image'

  return (
    <PresentationsShell title="Page Builder" subtitle="Set each page's background and elements. The preview updates as you go.">
      <div className="flex flex-col gap-vintiga-lg">
        {/* Progress */}
        <div className="flex items-center justify-between gap-vintiga-md">
          <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-primary">Step 2 of 3 · Page {idx + 1} of {pages.length}</span>
          <div className="flex items-center gap-1">
            {pages.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-vintiga-primary' : 'w-1.5 bg-vintiga-border'}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-vintiga-lg items-start">
          {/* Controls */}
          <div className="flex flex-col gap-vintiga-lg">
            <div className="flex flex-col gap-vintiga-sm rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-lg">
              <span className="typo-caption font-semibold text-vintiga-foreground-muted">Background</span>
              <SegmentedControl<'white' | 'image'>
                value={page.bg}
                onChange={(v) => update({ bg: v })}
                options={[{ value: 'white', label: 'White' }, { value: 'image', label: 'Image + 50% overlay' }]}
              />
              {onImage && (
                <div className="flex flex-wrap gap-vintiga-sm mt-1">
                  {BG_IMAGES.map((im) => (
                    <button
                      key={im.src}
                      type="button"
                      onClick={() => update({ bgImage: im.src })}
                      aria-label={im.label}
                      className={`w-14 h-14 rounded-vintiga-md overflow-hidden border-2 transition-colors ${page.bgImage === im.src ? 'border-vintiga-primary' : 'border-transparent hover:border-vintiga-border'}`}
                    >
                      <img src={im.src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-vintiga-sm rounded-vintiga-card border border-vintiga-border bg-vintiga-surface p-vintiga-lg">
              <span className="typo-caption font-semibold text-vintiga-foreground-muted">Elements</span>
              <div className="flex flex-wrap gap-vintiga-sm">
                {BLOCK_KINDS.map((b) => {
                  const on = page.blocks.includes(b.value)
                  return (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => toggleBlock(b.value)}
                      className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-full border typo-body-sm font-semibold transition-colors ${on ? 'border-vintiga-primary bg-vintiga-primary-soft text-vintiga-primary' : 'border-vintiga-border bg-vintiga-white text-vintiga-foreground-muted hover:border-vintiga-slate-400'}`}
                    >
                      {on && <CheckIcon className="w-3.5 h-3.5" />}{b.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {isLast && (
              <div className="flex flex-col gap-vintiga-sm rounded-vintiga-card border-2 border-vintiga-primary/40 bg-vintiga-primary-soft p-vintiga-lg">
                <span className="inline-flex items-center gap-1.5 typo-body-sm font-semibold text-vintiga-primary"><SparklesIcon className="w-4 h-4" />This is your last page</span>
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
            <div className="relative w-full aspect-[16/9] rounded-vintiga-2xl overflow-hidden border border-vintiga-border bg-vintiga-white shadow-sm">
              {onImage && (
                <>
                  <img src={page.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50" />
                </>
              )}
              <div className={`relative h-full overflow-y-auto px-vintiga-xl py-vintiga-lg flex flex-col justify-center gap-vintiga-lg ${onImage ? '[&_h2]:!text-white [&_h3]:!text-white [&_p]:!text-white/85 [&_.text-vintiga-indigo-600]:!text-white' : ''}`}>
                {page.blocks.length === 0
                  ? <p className="typo-body-sm text-center text-vintiga-foreground-muted">Pick elements to preview this page.</p>
                  : page.blocks.map((k, i) => <div key={`${k}-${i}`}>{renderBlock(k)}</div>)}
              </div>
            </div>
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
