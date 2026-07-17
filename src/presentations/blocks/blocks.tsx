import type { ReactNode } from 'react'
import { DollarIcon, EllipsisIcon } from '@ds/icons/Icons'

// ─── Presentation blocks ──────────────────────────────────────────────────────
// A small, separate design system for the decks — deliberately NOT in `@ds/`.
// These are the reusable pieces the presentations (and, later, the Page Builder)
// are assembled from: title/text, stats, glass stat card, icon cards, framed
// media. Light-theme, self-contained. Catalog: `PresentationBlocksScreen`.

const img = (p: string) => `/brand/imagery/${p}`

export function BlockKicker({ children }: { children: ReactNode }) {
  return (
    <span className="typo-caption font-semibold uppercase tracking-[0.16em] text-vintiga-indigo-600">
      {children}
    </span>
  )
}

export function BlockTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-vintiga-display font-light leading-[1.05] text-3xl md:text-4xl text-vintiga-slate-900 ${className}`}>
      {children}
    </h2>
  )
}

export function BlockLead({ children }: { children: ReactNode }) {
  return <p className="typo-body md:text-lg leading-relaxed text-vintiga-slate-500">{children}</p>
}

export function BlockStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-vintiga-display font-light leading-none text-4xl lg:text-5xl text-vintiga-indigo-600">{value}</span>
      <span className="typo-body-sm leading-snug text-vintiga-slate-500">{label}</span>
    </div>
  )
}

export function BlockStatRow({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-vintiga-lg">
      {stats.map((s) => <BlockStat key={s.label} value={s.value} label={s.label} />)}
    </div>
  )
}

export function BlockIconCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-vintiga-md rounded-vintiga-2xl border border-vintiga-slate-200 bg-vintiga-white p-vintiga-lg">
      <span className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full bg-vintiga-indigo-50 text-vintiga-indigo-600 [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </span>
      <p className="typo-title-subsection font-semibold text-vintiga-slate-900">{title}</p>
      <p className="typo-body-sm text-vintiga-slate-500 leading-relaxed">{body}</p>
    </div>
  )
}

export function BlockFrame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-vintiga-2xl bg-vintiga-slate-100 ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  )
}

// ─── Glass blocks (Figma 5270:645) ────────────────────────────────────────────
// Frosted glass overlays — a Total Revenue card (two corner-radius variants) and
// an avatars pill. These use `backdrop-filter: blur` so they must sit over media
// (a photo / coloured surface) and must NOT have a transformed ancestor, or the
// backdrop is isolated and the blur has nothing to sample (see the deck's fix).

const GLASS =
  'relative overflow-hidden backdrop-blur-2xl bg-vintiga-slate-900/35 border border-white/25 shadow-[0_20px_46px_-16px_rgba(15,23,42,0.55)]'
const GLASS_SHEEN = 'pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent'
const GLASS_EDGE = 'pointer-events-none absolute inset-x-0 top-0 h-px bg-white/45'

/** Frosted "Total Revenue" card. `rounded` picks the 24px vs 16px radius. */
export function BlockGlassRevenue({
  rounded = false,
  label = 'Total Revenue',
  value = '$38,920',
  goal = 'Goal: $50,000.00',
  progress = 78,
}: {
  rounded?: boolean
  label?: string
  value?: string
  goal?: string
  progress?: number
}) {
  return (
    <div className={`${GLASS} ${rounded ? 'rounded-3xl' : 'rounded-2xl'} w-full max-w-[340px]`}>
      <div aria-hidden className={GLASS_SHEEN} />
      <div aria-hidden className={GLASS_EDGE} />
      <div className="relative p-vintiga-md [text-shadow:0_1px_3px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between gap-2">
          <span className="typo-body-sm text-white/85">{label}</span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-white [&>svg]:w-4 [&>svg]:h-4"><DollarIcon /></span>
        </div>
        <p className="font-vintiga-display font-light text-white text-3xl leading-none mt-2 tabular-nums">{value}</p>
        <div className="mt-3 h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="typo-caption text-white/70">{goal}</span>
          <span className="typo-caption text-white font-semibold tabular-nums">{progress}%</span>
        </div>
      </div>
    </div>
  )
}

const PILL_AVATARS = [
  img('character-sheets/emma-portrait-01.jpg'),
  img('character-sheets/mika-portrait-cream.jpg'),
  img('character-sheets/sarah-portrait-tank.jpg'),
  img('character-sheets/mika-portrait-apron.jpg'),
]

/** Frosted avatars pill. */
export function BlockAvatarsPill({ extra = 6 }: { extra?: number }) {
  return (
    <div className={`${GLASS} rounded-full inline-flex items-center gap-2 px-2.5 py-1.5`}>
      <div aria-hidden className={GLASS_SHEEN} />
      <div className="relative flex -space-x-2">
        {PILL_AVATARS.map((src, k) => (
          <span key={k} className="w-6 h-6 rounded-full ring-2 ring-white/70 overflow-hidden bg-vintiga-slate-200">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </span>
        ))}
        <span className="w-6 h-6 rounded-full ring-2 ring-white/70 bg-vintiga-indigo-100 text-vintiga-indigo-700 inline-flex items-center justify-center typo-caption font-semibold">A</span>
      </div>
      <span className="relative typo-caption font-semibold text-white/85">+{extra}</span>
      <span className="relative text-white/70 [&>svg]:w-4 [&>svg]:h-4"><EllipsisIcon /></span>
    </div>
  )
}

/** The frosted revenue card composited over a photo (deck title-slide style). */
export function BlockGlassStat({ photo = img('compositions/emma-desk-03.jpg') }: { photo?: string }) {
  return (
    <div className="relative w-full max-w-[440px] aspect-[16/10] rounded-vintiga-2xl overflow-hidden bg-vintiga-slate-100">
      <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute left-[6%] bottom-[8%] w-[66%]">
        <BlockGlassRevenue rounded />
      </div>
    </div>
  )
}
