import { SectionHeader } from './SectionHeader'

const radiusTokens = [
  { name: 'none', value: '0', class: 'rounded-vintiga-none' },
  { name: 'input', value: '8px', class: 'rounded-vintiga-input' },
  { name: 'card', value: '16px', class: 'rounded-vintiga-card' },
  { name: 'button', value: '9999px', class: 'rounded-vintiga-button' },
] as const

const shadowTokens = [
  { name: 'sm', value: '0 1px 2px rgba(0,0,0,0.08)', class: 'shadow-vintiga-sm' },
  { name: 'md', value: '0 2px 8px rgba(0,0,0,0.12)', class: 'shadow-vintiga-md' },
  { name: 'lg', value: '0 8px 24px rgba(0,0,0,0.16)', class: 'shadow-vintiga-lg' },
] as const

export function RadiusAndShadowsSection() {
  return (
    <section>
      <SectionHeader
        id="radius-shadows"
        title="Radius & Shadows"
        description="Border radius tokens for inputs, cards, and pills. Shadow tokens for elevation."
      />

      {/* Radius */}
      <div className="mb-12">
        <h3 className="typo-title-subsection font-semibold text-vintiga-foreground mb-4">
          Border Radius
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {radiusTokens.map((token) => (
            <div key={token.name} className="text-center">
              <div
                className={`h-20 bg-vintiga-primary-soft border-2 border-vintiga-primary ${token.class} mx-auto mb-3`}
                style={{ width: token.name === 'button' ? '10rem' : '5rem' }}
              />
              <span className="typo-caption font-semibold text-vintiga-foreground block">
                {token.name}
              </span>
              <span className="typo-caption text-vintiga-foreground-muted block">{token.value}</span>
              <code className="typo-caption text-vintiga-primary">{token.class}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Shadows */}
      <div>
        <h3 className="typo-title-subsection font-semibold text-vintiga-foreground mb-4">Shadows</h3>
        <div className="bg-vintiga-surface-element rounded-vintiga-card p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {shadowTokens.map((token) => (
              <div key={token.name} className="text-center">
                <div
                  className={`bg-vintiga-surface rounded-vintiga-card p-6 ${token.class} mb-3`}
                >
                  <span className="typo-body text-vintiga-foreground">Content</span>
                </div>
                <span className="typo-caption font-semibold text-vintiga-foreground block">
                  {token.name}
                </span>
                <code className="typo-caption text-vintiga-foreground-muted block">{token.class}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
