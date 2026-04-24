import { SectionHeader } from './SectionHeader'

function SubSection({ id, title, description, children }: { id?: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <div id={id} className="space-y-4 scroll-mt-20">
      <div>
        <h3 className="typo-title-subsection font-semibold text-vintiga-foreground">{title}</h3>
        <p className="typo-body-sm text-vintiga-foreground-muted mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  )
}

interface AnimationToken { name: string; className: string; description: string; usage: string }

const ENTRANCE_ANIMATIONS: AnimationToken[] = [
  { name: 'fadeUp', className: 'animate-[fadeUp_0.4s_ease-out]', description: 'Default entrance. Fades in while rising 8px.', usage: 'animate-[fadeUp_0.4s_ease-out]' },
  { name: 'fadeUp (staggered)', className: 'animate-[fadeUp_0.4s_ease-out_0.1s_both]', description: 'Same as above but delayed. Use 0.05s increments per item.', usage: 'animate-[fadeUp_0.4s_ease-out_0.1s_both]' },
]

const TRANSITION_TOKENS: { name: string; value: string; description: string }[] = [
  { name: 'transition-colors', value: 'transition-colors', description: 'Hover/active state changes on buttons and interactive elements.' },
  { name: 'hover:opacity-90',  value: 'hover:opacity-90',  description: 'Subtle press effect on solid CTAs.' },
]

function AnimatedBox({ token }: { token: AnimationToken }) {
  return (
    <div className="border border-vintiga-border rounded-vintiga-card p-5 flex items-start gap-5">
      <div className="w-20 h-20 shrink-0 bg-vintiga-surface-element rounded-vintiga-input flex items-center justify-center overflow-hidden">
        <div key={token.name} className={`w-10 h-10 rounded-vintiga-button bg-vintiga-primary ${token.className}`} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="typo-body-sm font-semibold text-vintiga-foreground">{token.name}</p>
        <p className="typo-caption text-vintiga-foreground-muted">{token.description}</p>
        <code className="typo-caption font-mono bg-vintiga-surface-element text-vintiga-primary px-2 py-0.5 rounded mt-1 self-start">{token.usage}</code>
      </div>
    </div>
  )
}

export function AnimGuidelinesSection() {
  return (
    <section>
      <SectionHeader id="anim-guidelines" title="Animation Guidelines" description="Motion tokens used across all Vintiga screens. Keep animations subtle and purposeful." />
      <div className="flex flex-col gap-10">
        <SubSection id="anim-entrance" title="Entrance animations" description="fadeUp is the default entrance for all content.">
          <div className="flex flex-col gap-3">{ENTRANCE_ANIMATIONS.map((t) => <AnimatedBox key={t.name} token={t} />)}</div>
        </SubSection>
        <SubSection id="anim-transitions" title="Transition utilities" description="Hover and active state changes on interactive elements.">
          <div className="flex flex-col gap-3">
            {TRANSITION_TOKENS.map((t) => (
              <div key={t.name} className="border border-vintiga-border rounded-vintiga-card p-4 flex items-start gap-4">
                <code className="typo-caption font-mono bg-vintiga-surface-element text-vintiga-primary px-2 py-0.5 rounded shrink-0 self-start">{t.value}</code>
                <p className="typo-caption text-vintiga-foreground-muted">{t.description}</p>
              </div>
            ))}
          </div>
        </SubSection>
        <div className="bg-vintiga-surface-element rounded-vintiga-card p-5">
          <p className="typo-body-sm font-semibold text-vintiga-foreground mb-2">Principles</p>
          <ul className="flex flex-col gap-1.5">
            {[
              'Always use fadeUp for content entering the screen — never fadeIn alone.',
              'Stagger sibling elements by 0.05s each (0s, 0.05s, 0.1s, 0.15s…).',
              'Use transition-colors only for hover/active — never animate layout or size.',
              'Duration: 0.4s ease-out for entrances. Spring easing for physical objects (cards).',
              'Respect prefers-reduced-motion — Tailwind handles this automatically.',
            ].map((rule) => (
              <li key={rule} className="typo-caption text-vintiga-foreground-muted flex gap-2">
                <span className="text-vintiga-primary mt-0.5 shrink-0">•</span>{rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const ANIMATION_PAGES: Record<string, React.ComponentType> = {
  'anim-guidelines': AnimGuidelinesSection,
}

export function AnimationsSection() {
  return <AnimGuidelinesSection />
}
