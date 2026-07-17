// Brand → Tone of voice. A read-only reference page built from the bundled
// `vintiga-tov` rules — gives the brand voice a home in the hub (it isn't part
// of the Design System). Linked from the Brand tab's "Tone of voice" card.

import { BackArrowIcon } from '@ds/icons/Icons'

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: 'Pragmatic authority',
    body: 'Sound like you know the work. “Turn every visit into revenue.”, not “Drive your KPIs to new heights.”',
  },
  {
    title: 'Stakes-clear, not alarmist',
    body: 'Name the problem plainly, then point to the fix. Don’t shout, don’t hedge.',
  },
  {
    title: 'Staff- and guest-first',
    body: 'Write about your team, your managers, your guests. The product serves the room, not the dashboard.',
  },
  {
    title: 'Short, then long',
    body: 'Alternate a punchy line with one explanatory sentence — avoids both telegram-speak and corporate sprawl.',
  },
]

const RULES: string[] = [
  'Sentence case everywhere — only proper nouns and feature names (Mobile POS, Wine Club) get caps.',
  'Active voice. “We sent the invoice.” not “The invoice has been sent.”',
  'No jargon, no filler — cut “please ensure”, “kindly”, “in order to”, “at this time”.',
  'No exclamation marks outside genuinely celebratory moments. One per screen, max.',
  'Verbs in button labels — “Book a demo”, “View report”, “Send invoice”. Avoid “Submit”, “OK”.',
  'Numbers as numerals — “3 guests”, “€42”, “Day 1”. Spell out only when starting a sentence.',
]

const BUDGETS: [string, string][] = [
  ['Button label', '≤ 3 words'],
  ['Screen title', '≤ 5 words'],
  ['Section header', '≤ 6 words'],
  ['Alert / toast title', '≤ 6 words'],
  ['Empty-state headline', '≤ 8 words'],
  ['Error message', '1 sentence + 1 recovery action'],
]

const SAMPLES: string[] = [
  'Turn every visit into revenue.',
  'More than just POS, Clubs & Reservations',
  'Disconnected tools quietly leak revenue every shift.',
  'Built in 2024 with zero technical debt.',
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="typo-title-section font-semibold text-vintiga-foreground mb-vintiga-lg">{children}</h2>
}

export function ToneOfVoiceScreen() {
  return (
    <div className="min-h-screen bg-vintiga-surface font-vintiga-body overflow-y-auto h-screen">
      <header className="sticky top-0 z-30 flex items-center h-16 px-vintiga-lg sm:px-vintiga-2xl bg-vintiga-surface/75 backdrop-blur-md border-b border-vintiga-border">
        <a
          href="#/"
          className="inline-flex items-center gap-1.5 typo-body-sm font-semibold text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors no-underline"
        >
          <BackArrowIcon className="w-4 h-4" />
          Back to hub
        </a>
      </header>

      <div className="max-w-[896px] mx-auto px-vintiga-lg sm:px-vintiga-2xl py-vintiga-2xl flex flex-col gap-vintiga-3xl">
        {/* Intro */}
        <div>
          <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-primary">Brand</span>
          <h1 className="typo-title-screen font-light text-vintiga-foreground mt-vintiga-sm">Tone of voice</h1>
          <p className="typo-body-lg text-vintiga-foreground-muted mt-vintiga-md max-w-2xl">
            Vintiga talks like an operator who has run the floor — direct, confident, hospitality-aware. Never markety, never patronising.
          </p>
        </div>

        {/* Principles */}
        <section>
          <SectionHeading>Four principles</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-lg">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} className="border border-vintiga-border rounded-vintiga-card p-vintiga-lg flex flex-col gap-vintiga-xs">
                <span className="typo-caption font-semibold text-vintiga-primary">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="typo-title-subsection font-semibold text-vintiga-foreground">{p.title}</h3>
                <p className="typo-body-sm text-vintiga-foreground-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hard rules */}
        <section>
          <SectionHeading>Hard rules</SectionHeading>
          <ul className="flex flex-col gap-vintiga-md">
            {RULES.map((r) => (
              <li key={r} className="flex gap-vintiga-sm typo-body text-vintiga-foreground-muted">
                <span className="text-vintiga-primary shrink-0">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Length budgets */}
        <section>
          <SectionHeading>Length budgets</SectionHeading>
          <div className="border border-vintiga-border rounded-vintiga-card overflow-hidden">
            {BUDGETS.map(([surface, budget], i) => (
              <div
                key={surface}
                className={`flex items-center justify-between px-vintiga-lg py-vintiga-md ${i > 0 ? 'border-t border-vintiga-border' : ''}`}
              >
                <span className="typo-body-sm font-medium text-vintiga-foreground">{surface}</span>
                <span className="typo-body-sm text-vintiga-foreground-muted">{budget}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Voice samples */}
        <section>
          <SectionHeading>Voice samples</SectionHeading>
          <div className="flex flex-col gap-vintiga-lg">
            {SAMPLES.map((s) => (
              <p key={s} className="typo-title-subsection font-light text-vintiga-foreground border-l-2 border-vintiga-primary pl-vintiga-lg">
                “{s}”
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
