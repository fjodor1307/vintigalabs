import { useState } from 'react'
import { SectionHeader } from './SectionHeader'

/* ------------------------------------------------------------------ */
/*  Data — full Figma ♦️ Primitives › spacing scale                   */
/* ------------------------------------------------------------------ */

const spacingTokens = [
  { name: 'space-0',  cssVar: '--spacing-vintiga-0',  px: 0,  alias: null },
  { name: 'space-2',  cssVar: '--spacing-vintiga-2',  px: 2,  alias: null },
  { name: 'space-4',  cssVar: '--spacing-vintiga-4',  px: 4,  alias: 'xs' },
  { name: 'space-6',  cssVar: '--spacing-vintiga-6',  px: 6,  alias: null },
  { name: 'space-7',  cssVar: '--spacing-vintiga-7',  px: 7,  alias: null },
  { name: 'space-8',  cssVar: '--spacing-vintiga-8',  px: 8,  alias: 'sm' },
  { name: 'space-10', cssVar: '--spacing-vintiga-10', px: 10, alias: null },
  { name: 'space-12', cssVar: '--spacing-vintiga-12', px: 12, alias: null },
  { name: 'space-14', cssVar: '--spacing-vintiga-14', px: 14, alias: null },
  { name: 'space-16', cssVar: '--spacing-vintiga-16', px: 16, alias: 'md' },
  { name: 'space-20', cssVar: '--spacing-vintiga-20', px: 20, alias: null },
  { name: 'space-24', cssVar: '--spacing-vintiga-24', px: 24, alias: 'lg' },
  { name: 'space-28', cssVar: '--spacing-vintiga-28', px: 28, alias: null },
  { name: 'space-32', cssVar: '--spacing-vintiga-32', px: 32, alias: 'xl' },
  { name: 'space-40', cssVar: '--spacing-vintiga-40', px: 40, alias: null },
  { name: 'space-48', cssVar: '--spacing-vintiga-48', px: 48, alias: '2xl' },
  { name: 'space-56', cssVar: '--spacing-vintiga-56', px: 56, alias: null },
  { name: 'space-64', cssVar: '--spacing-vintiga-64', px: 64, alias: '3xl' },
  { name: 'space-72', cssVar: '--spacing-vintiga-72', px: 72, alias: null },
] as const

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SpacingSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (value: string) => {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(value)
    setTimeout(() => setCopied(null), 1500)
  }

  const MAX_PX = 72

  return (
    <section>
      <SectionHeader
        id="spacing"
        title="Spacing"
        description="19 spacing tokens from 0–72px. Figma: ♦️ Primitives › spacing. Tailwind usage: p-vintiga-16, gap-vintiga-24, mb-vintiga-8, etc."
      />

      {/* Token table */}
      <div className="border border-vintiga-border rounded-[12px] overflow-hidden mb-10">
        {/* Header row */}
        <div className="grid grid-cols-[120px_80px_80px_1fr] gap-4 px-4 py-2.5 bg-vintiga-surface-element border-b border-vintiga-border">
          <span className="text-[11px] font-semibold text-vintiga-foreground-muted uppercase tracking-wider">Token</span>
          <span className="text-[11px] font-semibold text-vintiga-foreground-muted uppercase tracking-wider">Value</span>
          <span className="text-[11px] font-semibold text-vintiga-foreground-muted uppercase tracking-wider">Alias</span>
          <span className="text-[11px] font-semibold text-vintiga-foreground-muted uppercase tracking-wider">Scale</span>
        </div>

        {spacingTokens.map((token, i) => {
          const isCopied = copied === token.cssVar
          const barWidth = token.px === 0 ? 2 : Math.max(4, (token.px / MAX_PX) * 100)

          return (
            <div
              key={token.name}
              className={`grid grid-cols-[120px_80px_80px_1fr] gap-4 items-center px-4 py-3 ${
                i < spacingTokens.length - 1 ? 'border-b border-vintiga-border' : ''
              }`}
            >
              {/* Token name — click to copy */}
              <button
                type="button"
                onClick={() => copy(token.cssVar)}
                title={`Copy ${token.cssVar}`}
                className="text-left cursor-pointer group"
              >
                <code className="text-[12px] font-mono text-vintiga-foreground group-hover:text-vintiga-primary transition-colors">
                  {isCopied ? (
                    <span className="text-vintiga-success font-semibold">✓ Copied</span>
                  ) : (
                    token.name
                  )}
                </code>
              </button>

              {/* Value */}
              <span className="text-[12px] font-mono text-vintiga-foreground-muted">
                {token.px}px
              </span>

              {/* Semantic alias */}
              <span className="text-[11px] text-vintiga-foreground-muted">
                {token.alias ? (
                  <code className="bg-vintiga-surface-element px-1.5 py-0.5 rounded text-vintiga-primary">
                    {token.alias}
                  </code>
                ) : (
                  <span className="text-vintiga-border">—</span>
                )}
              </span>

              {/* Bar */}
              <div className="flex items-center">
                {token.px === 0 ? (
                  <div className="w-0.5 h-4 bg-vintiga-border rounded" />
                ) : (
                  <div
                    className="h-5 bg-vintiga-primary-soft border-l-2 border-vintiga-primary rounded-r"
                    style={{ width: `${barWidth}%` }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Usage example */}
      <div className="bg-vintiga-surface-element rounded-vintiga-card p-6">
        <span className="typo-caption font-semibold text-vintiga-foreground-muted uppercase tracking-wider block mb-3">
          Tailwind Usage
        </span>
        <div className="bg-vintiga-surface border border-vintiga-border rounded-vintiga-card p-vintiga-lg">
          <div className="flex flex-col gap-vintiga-md">
            <div className="bg-vintiga-primary-soft rounded-vintiga-input p-vintiga-8">
              <span className="typo-caption text-vintiga-primary">p-vintiga-8 (8px)</span>
            </div>
            <div className="bg-vintiga-primary-soft rounded-vintiga-input p-vintiga-16">
              <span className="typo-caption text-vintiga-primary">p-vintiga-16 (16px)</span>
            </div>
            <div className="bg-vintiga-primary-soft rounded-vintiga-input p-vintiga-24">
              <span className="typo-caption text-vintiga-primary">p-vintiga-24 (24px)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
