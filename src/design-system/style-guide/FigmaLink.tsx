// ─── FigmaLink ───────────────────────────────────────────────────────────────
// A small "View in Figma" pill that deep-links a style-guide section to its
// source component / frame in the Figma file. Renders the Figma brand mark +
// a label and opens in a new tab.

function FigmaLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 57" width="12" height="18" fill="none" aria-hidden="true">
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" />
    </svg>
  )
}

export function FigmaLink({ href, label = 'View in Figma' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-vintiga-button border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 no-underline hover:bg-vintiga-slate-50 hover:border-vintiga-slate-300 transition-colors"
    >
      <FigmaLogo className="shrink-0" />
      {label}
    </a>
  )
}
