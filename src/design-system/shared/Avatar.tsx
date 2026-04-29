import type { CSSProperties } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  /** Person's name — used for initials and colour derivation. */
  name?: string
  /** Explicit initials, takes precedence over `name` if provided. */
  initials?: string
  /** Image URL; if provided, renders a photo instead of initials. */
  src?: string
  /** Alt text for the image (if src is set). Defaults to `name`. */
  alt?: string
  /** Avatar size. Default: 'md' */
  size?: AvatarSize
  className?: string
}

// ─── Palette — 16 pastel hues matching Figma's initials avatars ──────────────

// background | text colour when name is used for auto-derivation
const PALETTE: { bg: string; text: string }[] = [
  { bg: '#BFDBFE', text: '#1E3A8A' }, // blue-200 / blue-900
  { bg: '#A7F3D0', text: '#064E3B' }, // emerald-200 / emerald-900
  { bg: '#DDD6FE', text: '#4C1D95' }, // violet-200 / violet-900
  { bg: '#D6D3D1', text: '#44403C' }, // stone-300 / stone-700
  { bg: '#FED7AA', text: '#7C2D12' }, // orange-200 / orange-900
  { bg: '#FDBA74', text: '#7C2D12' }, // orange-300 / orange-900
  { bg: '#E9D5FF', text: '#581C87' }, // purple-200 / purple-900
  { bg: '#FBCFE8', text: '#831843' }, // pink-200 / pink-900
  { bg: '#FECACA', text: '#7F1D1D' }, // red-200 / red-900
  { bg: '#FEF08A', text: '#713F12' }, // yellow-200 / yellow-900
  { bg: '#FCA5A5', text: '#7F1D1D' }, // red-300 / red-900
  { bg: '#D9F99D', text: '#365314' }, // lime-200 / lime-900
  { bg: '#99F6E4', text: '#134E4A' }, // teal-200 / teal-900
  { bg: '#A5F3FC', text: '#155E75' }, // cyan-200 / cyan-900
  { bg: '#BAE6FD', text: '#0C4A6E' }, // sky-200 / sky-900
  { bg: '#F5D0FE', text: '#701A75' }, // fuchsia-200 / fuchsia-900
]

// ─── Size map ────────────────────────────────────────────────────────────────

const SIZE: Record<AvatarSize, { box: number; font: number }> = {
  xs: { box: 24, font: 10 },
  sm: { box: 32, font: 12 },
  md: { box: 40, font: 14 },
  lg: { box: 56, font: 18 },
  xl: { box: 72, font: 24 },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i)
    hash |= 0 // keep it 32-bit
  }
  return Math.abs(hash)
}

function getPaletteFor(name: string) {
  return PALETTE[hashString(name) % PALETTE.length]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Avatar({
  name = '',
  initials: initialsProp,
  src,
  alt,
  size = 'md',
  className = '',
}: AvatarProps) {
  const { box, font } = SIZE[size]
  const initials = (initialsProp ?? getInitials(name)).slice(0, 2)
  const palette = getPaletteFor(name || initials)

  const style: CSSProperties = src
    ? { width: box, height: box, boxShadow: `0 0 0 2px ${palette.bg}` }
    : { width: box, height: box, backgroundColor: palette.bg, color: palette.text, fontSize: font, lineHeight: `${font}px` }

  return (
    <div
      className={[
        'inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none',
        'font-medium',
        className,
      ].join(' ')}
      style={style}
      aria-label={alt ?? name ?? 'Avatar'}
    >
      {src ? (
        <img src={src} alt={alt ?? name ?? ''} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  )
}

// ─── Avatar group (stacked with overlap) ──────────────────────────────────────

interface AvatarGroupProps {
  avatars: Pick<AvatarProps, 'name' | 'initials' | 'src' | 'alt'>[]
  size?: AvatarSize
  max?: number
  className?: string
}

export function AvatarGroup({ avatars, size = 'md', max = 3, className = '' }: AvatarGroupProps) {
  const shown = avatars.slice(0, max)
  const remaining = avatars.length - shown.length
  const { box, font } = SIZE[size]

  return (
    <div className={`inline-flex items-center ${className}`}>
      {shown.map((a, i) => (
        <div
          key={i}
          className="relative ring-2 ring-vintiga-white rounded-full"
          style={{ marginLeft: i === 0 ? 0 : -box / 3 }}
        >
          <Avatar {...a} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className="relative ring-2 ring-vintiga-white rounded-full inline-flex items-center justify-center bg-vintiga-slate-200 text-vintiga-slate-700 font-medium"
          style={{ marginLeft: -box / 3, width: box, height: box, fontSize: font, lineHeight: `${font}px` }}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
