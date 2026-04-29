import type { ReactNode } from 'react'

// ─── SectionCard ──────────────────────────────────────────────────────────────
// Bordered "section card" used to group form content under a titled header.
// Optional `icon` sits before the title; optional `action` is right-aligned in
// the header (typical: an "Edit" link, "Add" button, count pill, etc.).
//
// Usage:
//   <SectionCard title="Website" icon={<GlobeIcon />} action={<Button>Save</Button>}>
//     <Field label="URL"><TextInput /></Field>
//   </SectionCard>

export interface SectionCardProps {
  title: ReactNode
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ title, icon, action, children, className = '' }: SectionCardProps) {
  return (
    <section
      className={[
        'border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white p-6 flex flex-col gap-5',
        className,
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-vintiga-slate-500">{icon}</span>}
          <h2 className="typo-body-lg font-semibold text-vintiga-slate-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
