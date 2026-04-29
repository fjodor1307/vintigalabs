import { SectionHeader } from './SectionHeader'

const WEIGHTS: { token: string; value: number; name: string }[] = [
  { token: 'font-thin',       value: 100, name: 'Thin' },
  { token: 'font-extralight', value: 200, name: 'Extra Light' },
  { token: 'font-light',      value: 300, name: 'Light' },
  { token: 'font-normal',     value: 400, name: 'Regular' },
  { token: 'font-medium',     value: 500, name: 'Medium' },
  { token: 'font-semibold',   value: 600, name: 'Semi Bold' },
  { token: 'font-bold',       value: 700, name: 'Bold' },
  { token: 'font-extrabold',  value: 800, name: 'Extra Bold' },
  { token: 'font-black',      value: 900, name: 'Black' },
]

export function FontWeightSection() {
  return (
    <section className="flex flex-col gap-vintiga-xl">
      <SectionHeader
        id="font-weight"
        title="Font Weights"
        description="Inter is loaded with all 9 weights. Use semibold+ for headings, regular for body, medium for UI labels."
      />

      <div className="border border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white overflow-hidden">
        <div className="grid grid-cols-[180px_100px_1fr] items-center gap-4 px-vintiga-lg py-vintiga-sm bg-vintiga-slate-50 border-b border-vintiga-slate-200">
          <span className="typo-caption font-semibold uppercase tracking-wider text-vintiga-slate-500">Token</span>
          <span className="typo-caption font-semibold uppercase tracking-wider text-vintiga-slate-500">Weight</span>
          <span className="typo-caption font-semibold uppercase tracking-wider text-vintiga-slate-500">Sample</span>
        </div>
        {WEIGHTS.map((w) => (
          <div
            key={w.token}
            className="grid grid-cols-[180px_100px_1fr] items-center gap-4 px-vintiga-lg py-vintiga-md border-b border-vintiga-slate-100 last:border-b-0"
          >
            <code className="typo-body-sm font-mono text-vintiga-slate-900">{w.token}</code>
            <span className="typo-body-sm font-mono text-vintiga-slate-600">{w.value}</span>
            <p
              className="text-vintiga-slate-900"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 24, lineHeight: '32px', fontWeight: w.value }}
            >
              {w.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
