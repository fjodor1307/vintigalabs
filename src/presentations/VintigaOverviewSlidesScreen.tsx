// Presentations → Vintiga Overview Slides (July 2026).
// A short branded deck (Figma 08. Soc — 5203:2112 / 5243:708 / 5248:797).
// Light theme throughout. Shares the Vintiga Overview deck's motion language:
// fadeUp reveals with staggered delays + the deckIn slide transition. The title
// slide adds a small "living dashboard" composition — images ease in, then the
// Total Revenue counts up and the goal progress bar fills.

import { useEffect, useState, useRef, type ReactNode } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  SparklesIcon,
  TrendingUpIcon,
  ChartIcon,
  DollarIcon,
  EllipsisIcon,
} from '@ds/icons/Icons'
import { VintigaIconBlack } from '@ds/shared/VintigaLogo'

const img = (p: string) => `/brand/imagery/${p}`

// ─── Reusable slide primitives (shared motion language) ───────────────────────

function Reveal({ children, i = 0, className = '' }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <div className={`animate-[fadeUp_0.5s_ease-out_both] ${className}`} style={{ animationDelay: `${i * 70}ms` }}>
      {children}
    </div>
  )
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="typo-caption font-semibold uppercase tracking-[0.16em] text-vintiga-indigo-600">
      {children}
    </span>
  )
}

function Title({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={`font-vintiga-display font-light leading-[1.05] text-4xl md:text-5xl lg:text-[3.4rem] text-vintiga-slate-900 ${className}`}>
      {children}
    </h1>
  )
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="typo-body md:text-lg leading-relaxed text-vintiga-slate-500">{children}</p>
}

function IconChip({ icon }: { icon: ReactNode }) {
  return (
    <span className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full bg-vintiga-indigo-50 text-vintiga-indigo-600 [&>svg]:w-5 [&>svg]:h-5">
      {icon}
    </span>
  )
}

function Frame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-vintiga-2xl bg-vintiga-slate-100 ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  )
}

// ─── Title-slide composition ──────────────────────────────────────────────────
// A relative, aspect-locked stage so every layered element scales together on
// any viewport. Children are positioned in % so the whole composition shrinks
// as one unit down to mobile.

const AVATARS = [
  img('character-sheets/emma-portrait-01.jpg'),
  img('character-sheets/mika-portrait-cream.jpg'),
  img('character-sheets/sarah-portrait-tank.jpg'),
  img('character-sheets/mika-portrait-apron.jpg'),
]

/** Count a number up to `end` once on mount, easing out over `duration` ms. */
function useCountUp(end: number, duration = 1400, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf = 0
    let start = 0
    const tick = (t: number) => {
      if (!start) start = t
      const elapsed = t - start - delay
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return }
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setValue(Math.round(end * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, duration, delay])
  return value
}

function DashboardComposition() {
  const revenue = useCountUp(38920, 1500, 650)
  // Progress bar fills after the cards settle in.
  const [filled, setFilled] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setFilled(true), 750)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="relative w-full max-w-[300px] sm:max-w-[440px] lg:max-w-[520px] mx-auto aspect-[47/58]">
      {/* Persona photo — main frame, eases in first */}
      <Reveal i={0} className="absolute top-0 left-0 w-[92%] h-[72%]">
        <div className="w-full h-full animate-[compIn_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
          <Frame
            src={img('compositions/emma-desk-03.jpg')}
            alt="Winery operator working at her desk with the Vintiga dashboard on dual monitors"
            className="w-full h-full shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)]"
          />
        </div>
      </Reveal>

      {/* Terrace photo — offset lower-right, eases in second */}
      <Reveal i={2} className="absolute bottom-0 right-0 w-[54%] h-[42%]">
        <div className="w-full h-full animate-[compIn_0.7s_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:140ms]">
          <Frame
            src={img('locations/estate-terrace.jpg')}
            alt="Vineyard estate terrace with a parasol under a tree at golden hour"
            className="w-full h-full ring-4 ring-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.5)]"
          />
        </div>
      </Reveal>

      {/* Total Revenue card — glassy overlay, reveals after the images */}
      <Reveal i={4} className="absolute left-[6%] top-[40%] w-[66%]">
        <div className="rounded-2xl bg-vintiga-slate-900/80 backdrop-blur-md border border-white/10 p-3.5 shadow-[0_18px_40px_-16px_rgba(15,23,42,0.6)]">
          <div className="flex items-center justify-between gap-2">
            <span className="typo-caption text-white/70">Total Revenue</span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white [&>svg]:w-3.5 [&>svg]:h-3.5"><DollarIcon /></span>
          </div>
          <p className="font-vintiga-display font-light text-white text-2xl md:text-[1.7rem] leading-none mt-1 tabular-nums">
            ${revenue.toLocaleString('en-US')}
          </p>
          <div className="mt-2.5 h-1.5 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-vintiga-indigo-500 transition-[width] duration-[1200ms] ease-out"
              style={{ width: filled ? '78%' : '0%' }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="typo-caption text-white/60">Goal: $50,000.00</span>
            <span className="typo-caption text-white/80 font-semibold tabular-nums">78%</span>
          </div>
        </div>
      </Reveal>

      {/* Avatars pill — reveals last */}
      <Reveal i={5} className="absolute left-[8%] bottom-[10%] ">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1.5 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.4)] border border-vintiga-slate-100">
          <div className="flex -space-x-2">
            {AVATARS.map((src, k) => (
              <span key={k} className="w-6 h-6 rounded-full ring-2 ring-white overflow-hidden bg-vintiga-slate-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </span>
            ))}
            <span className="w-6 h-6 rounded-full ring-2 ring-white bg-vintiga-indigo-100 text-vintiga-indigo-700 inline-flex items-center justify-center typo-caption font-semibold">A</span>
          </div>
          <span className="typo-caption font-semibold text-vintiga-slate-500">+6</span>
          <span className="text-vintiga-slate-400 [&>svg]:w-4 [&>svg]:h-4"><EllipsisIcon /></span>
        </div>
      </Reveal>
    </div>
  )
}

// ─── Slides ───────────────────────────────────────────────────────────────────

type Slide = { render: () => ReactNode }

function TitleSlide() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-vintiga-xl lg:gap-vintiga-2xl items-center">
      <div className="flex flex-col justify-center gap-vintiga-md lg:gap-vintiga-lg order-2 lg:order-1">
        <Reveal i={1}><Kicker>Guest Intelligence</Kicker></Reveal>
        <Reveal i={2}>
          <Title className="!text-[2.5rem] sm:!text-5xl md:!text-6xl lg:!text-7xl">Powering the world's most remarkable wineries</Title>
        </Reveal>
        <Reveal i={3}>
          <p className="text-xl sm:text-2xl lg:text-3xl font-vintiga-display font-light text-vintiga-indigo-600">More visitors. More members. More revenue.</p>
        </Reveal>
        <Reveal i={4} className="mt-vintiga-md">
          <div className="flex items-center gap-vintiga-md typo-body-sm text-vintiga-slate-500 flex-wrap">
            <span className="font-semibold text-vintiga-slate-900">Jim Secord</span>
            <span className="text-vintiga-slate-300">·</span>
            <span>Founder</span>
            <span className="text-vintiga-slate-300">·</span>
            <span>VintigaLabs.com</span>
            <span className="text-vintiga-slate-300">·</span>
            <span>jim@vintigalabs.com</span>
          </div>
        </Reveal>
      </div>
      <div className="order-1 lg:order-2 w-full">
        <DashboardComposition />
      </div>
    </div>
  )
}

const SLIDES: Slide[] = [
  // 1 — Title + living dashboard composition
  { render: () => <TitleSlide /> },

  // 2 — The Problem
  {
    render: () => (
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-vintiga-xl lg:gap-vintiga-2xl items-center">
        <div className="flex flex-col gap-vintiga-lg">
          <Reveal><Kicker>The Problem</Kicker></Reveal>
          <Reveal i={1}><Title>The winery growth crisis</Title></Reveal>
          <Reveal i={2}><Lead>Wineries are facing unprecedented headwinds.</Lead></Reveal>
          <div className="flex flex-col divide-y divide-vintiga-slate-100 mt-vintiga-sm">
            {[
              ['U.S. wine sales down ~20% from peak', 'A prolonged, industry-wide demand slowdown.'],
              ['Tasting-room visitation is falling', 'Wineries are cutting fees and adding promotions just to attract guests.'],
              ['Club growth & retention under pressure', 'Fewer visitors mean fewer chances to acquire loyal members.'],
              ['Operating costs rising 4–8% a year', "They can't simply raise prices — they must earn more from every guest."],
            ].map(([h, s], k) => (
              <Reveal key={h} i={3 + k} className="py-vintiga-md">
                <p className="typo-body md:text-lg font-semibold text-vintiga-slate-900">{h}</p>
                <p className="typo-body-sm text-vintiga-slate-500 mt-0.5">{s}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal i={2} className="h-[42vh] lg:h-[60vh] max-h-[560px] order-first lg:order-last">
          <Frame src={img('locations/wine-barrels.jpg')} alt="Oak wine barrels in warm evening light" className="h-full" />
        </Reveal>
      </div>
    ),
  },

  // 3 — Why Vintiga Now
  {
    render: () => (
      <div className="flex flex-col gap-vintiga-xl lg:gap-vintiga-2xl justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>Why Vintiga Now?</Kicker></Reveal>
          <Reveal i={1}><Title>The winery business has fundamentally changed</Title></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg">
          {[
            [<SparklesIcon key="s" />, 'AI makes personalized hospitality possible', 'Every winery can now deliver the guest intelligence once reserved for luxury brands.'],
            [<TrendingUpIcon key="t" />, 'Slowing demand makes personalization essential', 'Declining visits and slower club growth make conversion and retention mission-critical.'],
            [<ChartIcon key="c" />, 'Relationships beat volume', "The next decade won't be won by producing more wine — it'll be won by building better customer relationships."],
          ].map(([icon, h, s], k) => (
            <Reveal key={h as string} i={2 + k} className="flex flex-col gap-vintiga-md rounded-vintiga-2xl border border-vintiga-slate-200 bg-vintiga-white p-vintiga-lg">
              <IconChip icon={icon} />
              <p className="typo-title-subsection font-semibold text-vintiga-slate-900">{h}</p>
              <p className="typo-body-sm md:text-base text-vintiga-slate-500 leading-relaxed">{s}</p>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },
]

// ─── Deck shell ───────────────────────────────────────────────────────────────

function exitToHub() {
  localStorage.setItem('vintiga-hub-segment', 'Presentations')
  window.location.hash = '#/'
}

export function VintigaOverviewSlidesScreen() {
  const [index, setIndex] = useState(0)
  const total = SLIDES.length
  const slide = SLIDES[index]
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(total - 1, i + 1))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); setIndex((i) => Math.min(total - 1, i + 1)) }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)) }
      else if (e.key === 'Home') setIndex(0)
      else if (e.key === 'End') setIndex(total - 1)
      else if (e.key === 'Escape') exitToHub()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [total])

  const ctrl = 'inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors text-vintiga-slate-500 hover:text-vintiga-slate-900 hover:bg-vintiga-slate-100'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-vintiga-body bg-vintiga-white">
      <style>{`
        @keyframes compIn { from { opacity: 0; transform: translateY(18px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes deckIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Slide stage — only the active slide is mounted, so it re-enters (and
          re-runs its animations) on change. */}
      <div
        key={index}
        className="absolute inset-0 overflow-y-auto animate-[deckIn_360ms_cubic-bezier(0.16,1,0.3,1)]"
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY }}
        onTouchEnd={(e) => {
          if (startX.current === null || startY.current === null) return
          const dx = e.changedTouches[0].clientX - startX.current
          const dy = e.changedTouches[0].clientY - startY.current
          // Only treat as a slide swipe when it's clearly horizontal — leave
          // vertical gestures to scroll the (occasionally tall) mobile slide.
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) next()
            else prev()
          }
          startX.current = null
          startY.current = null
        }}
      >
        <div className="relative min-h-full w-full max-w-[1400px] mx-auto px-6 sm:px-14 lg:px-20 pt-20 pb-24 lg:pt-16 lg:pb-20 flex flex-col justify-start lg:justify-center">
          {slide.render()}
        </div>
      </div>

      {/* Top chrome — wordmark + exit */}
      <div className="absolute top-0 inset-x-0 h-16 px-6 sm:px-14 lg:px-20 flex items-center justify-between pointer-events-none">
        <VintigaIconBlack size={30} className="pointer-events-auto rounded-[9px]" aria-label="Vintiga" />
        <span className="sr-only">Vintiga</span>
        <button type="button" onClick={exitToHub} aria-label="Exit presentation" className={`${ctrl} pointer-events-auto`}>
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom chrome — prev · counter · next + progress */}
      <div className="absolute bottom-0 inset-x-0">
        <div className="h-14 px-6 sm:px-14 lg:px-20 flex items-center justify-center gap-vintiga-md">
          <button type="button" onClick={prev} disabled={index === 0} aria-label="Previous slide" className={`${ctrl} disabled:opacity-30 disabled:pointer-events-none`}>
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className="typo-body-sm tabular-nums min-w-[3.5rem] text-center text-vintiga-slate-400">
            {index + 1} / {total}
          </span>
          <button type="button" onClick={next} disabled={index === total - 1} aria-label="Next slide" className={`${ctrl} disabled:opacity-30 disabled:pointer-events-none`}>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="h-1 w-full bg-vintiga-slate-100">
          <div className="h-full bg-vintiga-indigo-500 transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
