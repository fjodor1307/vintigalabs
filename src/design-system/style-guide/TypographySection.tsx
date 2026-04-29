import { SectionHeader } from './SectionHeader'

// Font size scale sourced from Figma variables.
const SIZES: { token: string; size: number; leading: number }[] = [
  { token: 'text-xs',  size: 12,  leading: 16 },
  { token: 'text-sm',  size: 14,  leading: 20 },
  { token: 'text-base',size: 16,  leading: 24 },
  { token: 'text-lg',  size: 18,  leading: 28 },
  { token: 'text-xl',  size: 20,  leading: 28 },
  { token: 'text-2xl', size: 24,  leading: 32 },
  { token: 'text-3xl', size: 30,  leading: 36 },
  { token: 'text-4xl', size: 36,  leading: 40 },
  { token: 'text-5xl', size: 48,  leading: 100 },
  { token: 'text-6xl', size: 60,  leading: 100 },
  { token: 'text-7xl', size: 72,  leading: 100 },
  { token: 'text-8xl', size: 96,  leading: 100 },
  { token: 'text-9xl', size: 128, leading: 100 },
]

const TITLE = 'The quick brown fox jumps over the lazy dog.'
const PARAGRAPH =
  "So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist."

function Sample({ size, leading }: { size: number; leading: number }) {
  const showParagraph = size <= 36
  const lineHeight = leading === 100 ? 1 : `${leading}px`
  return (
    <div className="bg-vintiga-slate-50 rounded-vintiga-lg p-vintiga-lg border border-vintiga-slate-200 overflow-hidden">
      <p
        className="font-bold text-vintiga-slate-900 truncate"
        style={{ fontSize: size, lineHeight, fontFamily: 'Inter, sans-serif' }}
      >
        {TITLE}
      </p>
      {showParagraph && (
        <p
          className="font-normal text-vintiga-slate-700 mt-2"
          style={{ fontSize: size, lineHeight, fontFamily: 'Inter, sans-serif' }}
        >
          {PARAGRAPH}
        </p>
      )}
    </div>
  )
}

export function TypographySection() {
  return (
    <section className="flex flex-col gap-vintiga-2xl">
      <SectionHeader
        id="typography"
        title="Typography"
        description="Inter — 13 sizes from 12px to 128px with paired line-heights. Use weights semibold+ for headings, regular for body."
      />

      <div className="flex flex-col gap-vintiga-sm">
        <p className="typo-caption font-semibold uppercase tracking-wider text-vintiga-slate-500">Font family</p>
        <div className="border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-lg bg-vintiga-white">
          <p
            className="text-vintiga-slate-900"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 36, lineHeight: '40px', fontWeight: 700 }}
          >
            Inter
          </p>
          <p className="typo-body-sm text-vintiga-slate-500 mt-1">
            Loaded via Google Fonts. All weights 100–900 available.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-vintiga-md">
        <p className="typo-caption font-semibold uppercase tracking-wider text-vintiga-slate-500">Scale</p>
        <div className="flex flex-col gap-vintiga-md">
          {SIZES.map((s) => (
            <div key={s.token} className="grid grid-cols-[140px_1fr] gap-vintiga-lg items-start">
              <div className="flex flex-col gap-0.5 pt-4">
                <code className="typo-body-sm font-mono text-vintiga-slate-900">{s.token}</code>
                <span className="typo-caption text-vintiga-slate-500">{s.size}px / {s.leading === 100 ? '1' : `${s.leading}px`}</span>
              </div>
              <Sample size={s.size} leading={s.leading} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
