import type { ReactNode } from 'react'

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

// Frosted "stat over media" — the deck's Total Revenue card, static. The
// opacity-only wrapper avoids a transformed ancestor so backdrop-blur samples
// the photo behind (see the deck's glass fix).
export function BlockGlassStat({
  photo = img('compositions/emma-desk-03.jpg'),
  label = 'Total Revenue',
  value = '$38,920',
  goal = 'Goal: $50,000.00',
  progress = 78,
}: {
  photo?: string
  label?: string
  value?: string
  goal?: string
  progress?: number
}) {
  return (
    <div className="relative w-full max-w-[420px] aspect-[16/10] rounded-vintiga-2xl overflow-hidden bg-vintiga-slate-100">
      <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute left-[6%] bottom-[8%] w-[64%]">
        <div className="relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-vintiga-slate-900/25 border border-white/30 shadow-[0_20px_46px_-16px_rgba(15,23,42,0.6)]">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/5 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/50" />
          <div className="relative p-3.5 [text-shadow:0_1px_3px_rgba(15,23,42,0.35)]">
            <span className="typo-caption text-white/85">{label}</span>
            <p className="font-vintiga-display font-light text-white text-2xl leading-none mt-1 tabular-nums">{value}</p>
            <div className="mt-2.5 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-vintiga-indigo-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="typo-caption text-white/70">{goal}</span>
              <span className="typo-caption text-white font-semibold tabular-nums">{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
