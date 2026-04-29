import { SectionHeader } from './SectionHeader'

const RADII: { token: string; px: string }[] = [
  { token: 'rounded-none', px: '0px' },
  { token: 'rounded-sm',   px: '2px' },
  { token: 'rounded',      px: '4px' },
  { token: 'rounded-md',   px: '6px' },
  { token: 'rounded-lg',   px: '8px' },
  { token: 'rounded-xl',   px: '12px' },
  { token: 'rounded-2xl',  px: '16px' },
  { token: 'rounded-3xl',  px: '24px' },
  { token: 'rounded-full', px: '9999px' },
]

export function RadiusSection() {
  return (
    <section className="flex flex-col gap-vintiga-xl">
      <SectionHeader
        id="radius"
        title="Border Radius"
        description="Use the scale below — rounded-md for buttons and inputs, rounded-2xl for cards, rounded-full for pills and avatars."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-vintiga-lg">
        {RADII.map((r) => (
          <div key={r.token} className="flex flex-col items-center gap-vintiga-sm">
            <div
              className="w-24 h-24 bg-vintiga-purple-500"
              style={{ borderRadius: r.px === '9999px' ? '9999px' : r.px }}
            />
            <div className="flex flex-col items-center">
              <code className="typo-caption font-mono text-vintiga-slate-900">{r.token}</code>
              <span className="typo-caption text-vintiga-slate-500">{r.px}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
