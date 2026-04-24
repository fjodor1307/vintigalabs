import { SectionHeader } from './SectionHeader'

const sampleHeading = 'Built for Business'
const sampleBody =
  'Vintiga is built for the way modern businesses actually work. Fast, flexible, and always on — so you can focus on what matters most.'

interface StyleRowProps {
  name: string
  className: string
  specs: string
  weights: { label: string; weight: string }[]
  sample?: string
}

function StyleRow({ name, className, specs, weights, sample = sampleHeading }: StyleRowProps) {
  return (
    <div className="border-b border-vintiga-border py-8">
      <div className="flex items-baseline justify-between mb-3">
        <span className="typo-caption font-semibold text-vintiga-foreground-muted uppercase tracking-wider">
          {name}
        </span>
        <span className="typo-caption text-vintiga-foreground-muted">{specs}</span>
      </div>
      <div className="space-y-3">
        {weights.map((w) => (
          <div key={w.label} className="flex items-baseline gap-6">
            <span className="typo-caption text-vintiga-foreground-muted w-20 shrink-0 text-right">
              {w.label}
            </span>
            <span className={`${className} ${w.weight} text-vintiga-foreground`}>{sample}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PatternExample({
  name,
  description,
  code,
  preview,
}: {
  name: string
  description: string
  code: string
  preview: React.ReactNode
}) {
  return (
    <div className="border border-vintiga-border rounded-vintiga-card overflow-hidden">
      <div className="p-5 border-b border-vintiga-border">
        <span className="typo-caption font-semibold text-vintiga-foreground-muted uppercase tracking-wider">
          {name}
        </span>
        <p className="typo-body-sm text-vintiga-foreground-muted mt-1">{description}</p>
      </div>
      <div className="p-5 bg-vintiga-surface">{preview}</div>
      <div className="p-4 bg-vintiga-surface-element">
        <code className="typo-caption text-vintiga-foreground">{code}</code>
      </div>
    </div>
  )
}

const styles = {
  display: [
    {
      name: 'Display',
      className: 'typo-display',
      specs: '64px → 40px / line-height 1.1 / tracking -3% / FT Polar',
      weights: [{ label: 'Light', weight: 'font-light' }],
    },
    {
      name: 'Title Screen LG',
      className: 'typo-title-screen-lg',
      specs: '48px → 32px / line-height 1.1 / tracking -3% / FT Polar',
      weights: [{ label: 'Light', weight: 'font-light' }],
    },
  ],
  title: [
    {
      name: 'Title Screen',
      className: 'typo-title-screen',
      specs: '32px → 28px / line-height 36px / tracking -3% / FT Polar',
      weights: [{ label: 'Regular', weight: 'font-normal' }],
    },
    {
      name: 'Title Section',
      className: 'typo-title-section',
      specs: '24px / line-height 28px / tracking -1.5% / FT Polar',
      weights: [
        { label: 'Regular', weight: 'font-normal' },
        { label: 'SemiBold', weight: 'font-semibold' },
      ],
    },
    {
      name: 'Title Subsection',
      className: 'typo-title-subsection',
      specs: '20px / line-height 24px / tracking -1% / FT Polar',
      weights: [
        { label: 'Regular', weight: 'font-normal' },
        { label: 'SemiBold', weight: 'font-semibold' },
      ],
    },
  ],
  body: [
    {
      name: 'Body Large',
      className: 'typo-body-lg',
      specs: '18px / line-height 24px / tracking 1% / Inter',
      weights: [
        { label: 'Regular', weight: 'font-normal' },
        { label: 'SemiBold', weight: 'font-semibold' },
      ],
      sample: sampleBody,
    },
    {
      name: 'Body',
      className: 'typo-body',
      specs: '16px / line-height 24px / tracking 1% / Inter',
      weights: [
        { label: 'Regular', weight: 'font-normal' },
        { label: 'SemiBold', weight: 'font-semibold' },
      ],
      sample: sampleBody,
    },
    {
      name: 'Body Small',
      className: 'typo-body-sm',
      specs: '14px / line-height 20px / tracking 1.5% / Inter',
      weights: [
        { label: 'Regular', weight: 'font-normal' },
        { label: 'SemiBold', weight: 'font-semibold' },
      ],
      sample: sampleBody,
    },
  ],
  caption: [
    {
      name: 'Caption',
      className: 'typo-caption',
      specs: '12px / line-height 16px / tracking 2% / Inter',
      weights: [
        { label: 'Regular', weight: 'font-normal' },
        { label: 'SemiBold', weight: 'font-semibold' },
      ],
      sample: 'Last updated 2 minutes ago',
    },
  ],
}

export function TypographySection() {
  return (
    <section>
      <SectionHeader
        id="typography"
        title="Typography"
        description="Two fonts. Three weights. Nine styles. FT Polar for display and titles, Inter for body text and UI."
      />

      {/* Font families */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-vintiga-surface-element rounded-vintiga-card p-6">
          <span className="typo-caption font-semibold text-vintiga-foreground-muted uppercase tracking-wider block mb-3">
            Display Font
          </span>
          <span className="font-vintiga-display text-[2.5rem] font-light text-vintiga-foreground leading-tight block">
            FT Polar
          </span>
          <div className="mt-4 flex gap-6">
            <span className="typo-body-sm font-vintiga-display font-light text-vintiga-foreground-muted">
              Light 300
            </span>
            <span className="typo-body-sm font-vintiga-display font-normal text-vintiga-foreground-muted">
              Regular 400
            </span>
            <span className="typo-body-sm font-vintiga-display font-semibold text-vintiga-foreground-muted">
              SemiBold 600
            </span>
          </div>
        </div>
        <div className="bg-vintiga-surface-element rounded-vintiga-card p-6">
          <span className="typo-caption font-semibold text-vintiga-foreground-muted uppercase tracking-wider block mb-3">
            Body Font
          </span>
          <span className="font-vintiga-body text-[2.5rem] font-normal text-vintiga-foreground leading-tight block">
            Inter
          </span>
          <div className="mt-4 flex gap-6">
            <span className="typo-body-sm font-light text-vintiga-foreground-muted">Light 300</span>
            <span className="typo-body-sm font-normal text-vintiga-foreground-muted">Regular 400</span>
            <span className="typo-body-sm font-semibold text-vintiga-foreground-muted">SemiBold 600</span>
          </div>
        </div>
      </div>

      {/* Type scale */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <h3 className="typo-title-subsection font-semibold text-vintiga-foreground">Type Scale</h3>
          <span className="typo-caption text-vintiga-foreground-muted">9 styles total</span>
        </div>
        <p className="typo-body-sm text-vintiga-foreground-muted mb-8">
          Resize your browser to see fluid styles scale between mobile and desktop.
        </p>

        <div className="mb-2">
          <h4 className="typo-caption font-semibold text-vintiga-primary uppercase tracking-wider mb-0">
            Display
          </h4>
          <p className="typo-caption text-vintiga-foreground-muted">
            Hero headings and marketing moments. FT Polar Light only. Fluid scaling.
          </p>
        </div>
        {styles.display.map((s) => (
          <StyleRow key={s.name} {...s} />
        ))}

        <div className="mb-2 mt-10">
          <h4 className="typo-caption font-semibold text-vintiga-primary uppercase tracking-wider mb-0">
            Title
          </h4>
          <p className="typo-caption text-vintiga-foreground-muted">
            Screen headings, section headings, subsections. FT Polar.
          </p>
        </div>
        {styles.title.map((s) => (
          <StyleRow key={s.name} {...s} />
        ))}

        <div className="mb-2 mt-10">
          <h4 className="typo-caption font-semibold text-vintiga-primary uppercase tracking-wider mb-0">
            Body
          </h4>
          <p className="typo-caption text-vintiga-foreground-muted">
            Paragraphs, descriptions, buttons, and general content. Inter.
          </p>
        </div>
        {styles.body.map((s) => (
          <StyleRow key={s.name} {...s} sample={s.sample} />
        ))}

        <div className="mb-2 mt-10">
          <h4 className="typo-caption font-semibold text-vintiga-primary uppercase tracking-wider mb-0">
            Caption
          </h4>
          <p className="typo-caption text-vintiga-foreground-muted">
            Smallest text. Regular for informational, SemiBold for labels and overlines.
          </p>
        </div>
        {styles.caption.map((s) => (
          <StyleRow key={s.name} {...s} sample={s.sample} />
        ))}
      </div>

      {/* Patterns */}
      <div className="mb-12">
        <h3 className="typo-title-subsection font-semibold text-vintiga-foreground mb-2">Patterns</h3>
        <p className="typo-body-sm text-vintiga-foreground-muted mb-8">
          Combinations of existing styles with utility classes.
        </p>

        <div className="grid gap-6">
          <PatternExample
            name="Link"
            description="Apply underline + font-semibold to any body size."
            code='class="typo-body font-semibold underline"'
            preview={
              <div className="space-y-3">
                <p className="typo-body font-semibold underline text-vintiga-primary">
                  View all transactions
                </p>
                <p className="typo-body-sm font-semibold underline text-vintiga-primary">
                  View all transactions
                </p>
              </div>
            }
          />
          <PatternExample
            name="Label"
            description="Caption SemiBold for form labels and UI tags."
            code='class="typo-caption font-semibold"'
            preview={
              <div className="space-y-1">
                <span className="typo-caption font-semibold text-vintiga-foreground block">
                  Account number
                </span>
                <div className="bg-vintiga-surface-element rounded-vintiga-input px-3 py-2">
                  <span className="typo-body text-vintiga-foreground-muted">12345678</span>
                </div>
              </div>
            }
          />
          <PatternExample
            name="Overline"
            description="Caption SemiBold + uppercase for section overlines."
            code='class="typo-caption font-semibold uppercase tracking-wider"'
            preview={
              <div className="space-y-2">
                <span className="typo-caption font-semibold uppercase tracking-wider text-vintiga-foreground-muted block">
                  Recent activity
                </span>
                <span className="typo-title-subsection font-semibold text-vintiga-foreground block">
                  Your transactions
                </span>
              </div>
            }
          />
        </div>
      </div>

      {/* Quick reference table */}
      <div>
        <h3 className="typo-title-subsection font-semibold text-vintiga-foreground mb-6">
          Quick Reference
        </h3>
        <div className="bg-vintiga-surface-element rounded-vintiga-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-vintiga-border">
                {['Style', 'Class', 'Size', 'Weight(s)', 'Font'].map((h) => (
                  <th
                    key={h}
                    className="text-left p-4 typo-caption font-semibold text-vintiga-foreground-muted uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="typo-body-sm text-vintiga-foreground">
              {[
                ['Display', 'typo-display', '64 → 40px', 'Light', 'FT Polar'],
                ['Title Screen LG', 'typo-title-screen-lg', '48 → 32px', 'Light', 'FT Polar'],
                ['Title Screen', 'typo-title-screen', '32 → 28px', 'Regular', 'FT Polar'],
                ['Title Section', 'typo-title-section', '24px', 'Regular, SemiBold', 'FT Polar'],
                ['Title Subsection', 'typo-title-subsection', '20px', 'Regular, SemiBold', 'FT Polar'],
                ['Body Large', 'typo-body-lg', '18px', 'Regular, SemiBold', 'Inter'],
                ['Body', 'typo-body', '16px', 'Regular, SemiBold', 'Inter'],
                ['Body Small', 'typo-body-sm', '14px', 'Regular, SemiBold', 'Inter'],
                ['Caption', 'typo-caption', '12px', 'Regular, SemiBold', 'Inter'],
              ].map(([style, cls, size, weight, font], i) => (
                <tr key={style} className={i < 8 ? 'border-b border-vintiga-border' : ''}>
                  <td className="p-4">{style}</td>
                  <td className="p-4">
                    <code className="typo-caption bg-vintiga-surface px-1.5 py-0.5 rounded">{cls}</code>
                  </td>
                  <td className="p-4 tabular-nums">{size}</td>
                  <td className="p-4">{weight}</td>
                  <td className="p-4">{font}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
