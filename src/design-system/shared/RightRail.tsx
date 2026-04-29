import type { ReactNode } from 'react'

// ─── RightRail ────────────────────────────────────────────────────────────────
// Editor right-side rail with stacked <RailSection> cards. Responsive:
//   • lg+    — fixed 360 px sidebar with a left divider, stays in place
//   • below  — full-width stack at the bottom of the page (cards in a column)
//
// Kept intentionally simple — no collapse toggle. Pages that need to hide it
// entirely can render `null` instead.

export interface RightRailProps {
  children: ReactNode
  className?: string
}

export function RightRail({ children, className = '' }: RightRailProps) {
  return (
    <aside
      className={[
        // Desktop: fixed sidebar with a visible left divider
        'lg:w-[360px] lg:shrink-0 lg:border-l lg:border-vintiga-slate-200',
        // Mobile: stacks under main as a top-bordered block
        'w-full border-t border-vintiga-slate-200 lg:border-t-0',
        // Layout
        'bg-vintiga-white flex flex-col gap-vintiga-md p-vintiga-md',
        className,
      ].join(' ')}
    >
      {children}
    </aside>
  )
}

// ─── RailSection ──────────────────────────────────────────────────────────────
// One bordered card inside <RightRail>. Header has a title and an optional
// trailing action (Create button, link, count, etc.). Body holds whatever.

export interface RailSectionProps {
  title: ReactNode
  /** Optional right-aligned slot in the header (button / link / count). */
  action?: ReactNode
  children: ReactNode
}

export function RailSection({ title, action, children }: RailSectionProps) {
  return (
    <section className="border border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white overflow-hidden">
      <div className="flex items-center justify-between gap-vintiga-sm h-14 px-vintiga-md border-b border-vintiga-slate-200">
        <h3 className="typo-body-lg font-semibold text-vintiga-slate-900">{title}</h3>
        {action}
      </div>
      <div className="p-vintiga-md flex flex-col gap-vintiga-sm">
        {children}
      </div>
    </section>
  )
}
