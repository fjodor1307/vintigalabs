import { SectionHeader } from './SectionHeader'

// Full Tailwind spacing scale — mirrors Figma variable set.
// Base unit = 4px (so token `4` = 16px).
const SPACING: { token: string; rem: string; px: number }[] = [
  { token: '0',   rem: '0px',      px: 0 },
  { token: 'px',  rem: '1px',      px: 1 },
  { token: '0.5', rem: '0.125rem', px: 2 },
  { token: '1',   rem: '0.25rem',  px: 4 },
  { token: '1.5', rem: '0.375rem', px: 6 },
  { token: '2',   rem: '0.5rem',   px: 8 },
  { token: '2.5', rem: '0.625rem', px: 10 },
  { token: '3',   rem: '0.75rem',  px: 12 },
  { token: '3.5', rem: '0.875rem', px: 14 },
  { token: '4',   rem: '1rem',     px: 16 },
  { token: '5',   rem: '1.25rem',  px: 20 },
  { token: '6',   rem: '1.5rem',   px: 24 },
  { token: '7',   rem: '1.75rem',  px: 28 },
  { token: '8',   rem: '2rem',     px: 32 },
  { token: '9',   rem: '2.25rem',  px: 36 },
  { token: '10',  rem: '2.5rem',   px: 40 },
  { token: '11',  rem: '2.75rem',  px: 44 },
  { token: '12',  rem: '3rem',     px: 48 },
  { token: '14',  rem: '3.5rem',   px: 56 },
  { token: '16',  rem: '4rem',     px: 64 },
  { token: '20',  rem: '5rem',     px: 80 },
  { token: '24',  rem: '6rem',     px: 96 },
  { token: '28',  rem: '7rem',     px: 112 },
  { token: '32',  rem: '8rem',     px: 128 },
  { token: '36',  rem: '9rem',     px: 144 },
  { token: '40',  rem: '10rem',    px: 160 },
  { token: '44',  rem: '11rem',    px: 176 },
  { token: '48',  rem: '12rem',    px: 192 },
  { token: '52',  rem: '13rem',    px: 208 },
  { token: '56',  rem: '14rem',    px: 224 },
  { token: '60',  rem: '15rem',    px: 240 },
  { token: '64',  rem: '16rem',    px: 256 },
  { token: '72',  rem: '18rem',    px: 288 },
  { token: '80',  rem: '20rem',    px: 320 },
  { token: '96',  rem: '24rem',    px: 384 },
]

export function SpacingSection() {
  return (
    <section className="flex flex-col gap-vintiga-xl">
      <SectionHeader
        id="spacing"
        title="Spacing"
        description="Tailwind-aligned scale on a 4px grid. Use these tokens for padding, margin, and gap — never raw pixel values."
      />

      <div className="border border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white overflow-hidden">
        <div className="grid grid-cols-[60px_100px_80px_1fr] items-center gap-4 px-vintiga-lg py-vintiga-sm bg-vintiga-slate-50 border-b border-vintiga-slate-200">
          <span className="typo-caption font-semibold uppercase tracking-wider text-vintiga-slate-500">Token</span>
          <span className="typo-caption font-semibold uppercase tracking-wider text-vintiga-slate-500">rem</span>
          <span className="typo-caption font-semibold uppercase tracking-wider text-vintiga-slate-500">px</span>
          <span className="typo-caption font-semibold uppercase tracking-wider text-vintiga-slate-500">Preview</span>
        </div>
        <div className="overflow-x-auto">
          {SPACING.map((s) => (
            <div
              key={s.token}
              className="grid grid-cols-[60px_100px_80px_1fr] items-center gap-4 px-vintiga-lg py-2 border-b border-vintiga-slate-100 last:border-b-0"
            >
              <code className="typo-body-sm font-mono text-vintiga-slate-900">{s.token}</code>
              <span className="typo-body-sm text-vintiga-slate-600 font-mono">{s.rem}</span>
              <span className="typo-body-sm text-vintiga-slate-600 font-mono">{s.px}px</span>
              <div className="flex items-center">
                <div
                  className="h-3 rounded-vintiga-sm bg-vintiga-cyan-400"
                  style={{ width: `${s.px}px`, minWidth: s.px === 0 ? 0 : 2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
