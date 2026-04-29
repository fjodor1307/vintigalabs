import { SectionHeader } from './SectionHeader'

const SHADOWS: { token: string; cssVar: string }[] = [
  { token: 'shadow-sm',    cssVar: '--shadow-vintiga-sm' },
  { token: 'shadow',       cssVar: '--shadow-vintiga' },
  { token: 'shadow-md',    cssVar: '--shadow-vintiga-md' },
  { token: 'shadow-lg',    cssVar: '--shadow-vintiga-lg' },
  { token: 'shadow-xl',    cssVar: '--shadow-vintiga-xl' },
  { token: 'shadow-2xl',   cssVar: '--shadow-vintiga-2xl' },
  { token: 'shadow-inner', cssVar: '--shadow-vintiga-inner' },
]

export function ShadowsSection() {
  return (
    <section className="flex flex-col gap-vintiga-xl">
      <SectionHeader
        id="shadows"
        title="Box Shadows"
        description="Seven elevation steps. Use shadow-sm for raised surfaces (buttons, pills), shadow-md for cards in motion, shadow-lg+ for modals and popovers."
      />

      <div
        className="rounded-vintiga-2xl border border-vintiga-slate-200 p-vintiga-2xl"
        style={{
          backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundColor: '#f8fafc',
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-vintiga-xl">
          {SHADOWS.map((s) => (
            <div key={s.token} className="flex flex-col items-center gap-vintiga-sm">
              <div
                className="w-24 h-24 bg-vintiga-white rounded-vintiga-lg"
                style={{ boxShadow: `var(${s.cssVar})` }}
              />
              <code className="typo-caption font-mono text-vintiga-slate-900">{s.token}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
