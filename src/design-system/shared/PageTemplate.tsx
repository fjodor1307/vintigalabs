import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '@ds/shared/Breadcrumb'

// ─── PageTemplate ─────────────────────────────────────────────────────────────
// The standard editor / detail page layout (Figma 5640:28214 — "Page Layout").
// Lives inside whatever shell the prototype provides (AppSidebar + Navbar +
// scroll container). Composes existing DS pieces — Breadcrumb, page title,
// action cluster, optional tabs, body, and an optional 360-px right sidebar.
//
// Spacing (Figma-accurate):
//   • Main column padding ............... 32 px on every side
//   • Gap between header rows ........... 32 px
//     (breadcrumb → title → tabs → body)
//   • Gap between body sections ......... configurable, default 24 px
//   • Sidebar ........................... w-360 · pt-84 · pr-32 · pb-32
//     (the 84-px top inset aligns the rail's first card with the page title)
//
// Usage:
//   <PageTemplate
//     breadcrumbs={[{ icon: <BreadcrumbHomeIcon />, href: '#/' }, { label: 'Section', href: '#/section' }, { label: 'Page' }]}
//     title="New club"
//     actions={
//       <>
//         <Button>Save</Button>
//         <IconButton variant="outline" icon={<EllipsisVerticalIcon />} aria-label="More" />
//       </>
//     }
//     tabs={<SegmentedControl … />}
//     rail={<RailSection title="Details">…</RailSection>}
//   >
//     <SectionCard title="Overview">…</SectionCard>
//     <SectionCard title="SEO">…</SectionCard>
//   </PageTemplate>

const BODY_GAP = {
  md: 'gap-vintiga-md',
  lg: 'gap-vintiga-lg',
  xl: 'gap-vintiga-xl',
} as const

export interface PageTemplateProps {
  /** Optional breadcrumb trail — passed straight to `<Breadcrumb>`. */
  breadcrumbs?: BreadcrumbItem[]
  /** Page title — typically a string but accepts any node. Rendered as `<h1>`. */
  title: ReactNode
  /** Right side of the title row — typically Save button + a kebab IconButton. */
  actions?: ReactNode
  /** Tabs row below the title — typically a `<SegmentedControl>`. */
  tabs?: ReactNode
  /** Right-side sidebar content. Pass a `<RailSection>` (or a stack of them, or any node). */
  rail?: ReactNode
  /** Body content — typically one or more `<SectionCard>`s. */
  children: ReactNode
  /** Vertical gap between body sections. Default `lg` (24 px). */
  bodyGap?: keyof typeof BODY_GAP
  className?: string
}

export function PageTemplate({
  breadcrumbs,
  title,
  actions,
  tabs,
  rail,
  children,
  bodyGap = 'lg',
  className = '',
}: PageTemplateProps) {
  return (
    <div className={['flex flex-col lg:flex-row w-full bg-vintiga-white', className].filter(Boolean).join(' ')}>
      {/* Main column — padding 32 all around, 32-px gap between header rows + body */}
      <main className="flex-1 min-w-0 p-vintiga-xl flex flex-col gap-vintiga-xl">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}

        <div className="flex items-start justify-between gap-vintiga-md">
          {/* Strings get the standard h1 chrome; complex nodes (e.g. a thumbnail
              header with its own heading) render as-is so the consumer keeps
              full control. */}
          {typeof title === 'string' ? (
            <h1 className="typo-title-screen font-semibold text-vintiga-slate-900 flex-1 min-w-0 truncate">
              {title}
            </h1>
          ) : (
            <div className="flex-1 min-w-0">{title}</div>
          )}
          {actions && (
            <div className="flex items-center gap-vintiga-sm shrink-0">{actions}</div>
          )}
        </div>

        {tabs}

        {/* Body — sections stacked with their own gap */}
        <div className={['flex flex-col', BODY_GAP[bodyGap]].join(' ')}>
          {children}
        </div>
      </main>

      {/* Right sidebar at lg+, stacks below main on smaller screens. */}
      {rail && (
        <aside
          className={[
            'flex flex-col gap-vintiga-md',
            // Stacked (< lg): full width below main, side padding matches main
            'px-vintiga-xl pb-vintiga-xl',
            // Side-by-side (lg+): 360-px right column with 84-px top inset
            'lg:w-[360px] lg:shrink-0 lg:pt-[84px] lg:pl-0 lg:pr-vintiga-xl lg:pb-vintiga-xl',
          ].join(' ')}
        >
          {rail}
        </aside>
      )}
    </div>
  )
}
