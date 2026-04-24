import contributorsData from '@/generated/contributors.json'

interface Contributor {
  name: string
  email: string
  initials: string
  colour: string
  commits: number
  firstCommit: string
  lastCommit: string
}

interface PrototypeEntry {
  status: 'in-progress' | 'approved'
  contributors: Contributor[]
}

interface ContributorsData {
  generatedAt: string
  prototypes: Record<string, PrototypeEntry>
}

interface ContributorsProps {
  /** Prototype folder name, e.g. "subscription" */
  prototype: string
  /** Max avatars to render inline before collapsing into "+N" */
  max?: number
  /** Visual size — sm (20px) for inline, md (28px) default, lg (36px) for headers */
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { circle: 'w-5 h-5', font: 'text-[9px]', overlap: '-ml-1' },
  md: { circle: 'w-7 h-7', font: 'text-[11px]', overlap: '-ml-2' },
  lg: { circle: 'w-9 h-9', font: 'text-xs', overlap: '-ml-2.5' },
}

export function Contributors({ prototype, max = 4, size = 'md' }: ContributorsProps) {
  const data = contributorsData as ContributorsData
  const list = data.prototypes[prototype]?.contributors ?? []

  if (list.length === 0) {
    return (
      <span className="typo-caption text-vintiga-foreground-muted">No contributors yet</span>
    )
  }

  const shown = list.slice(0, max)
  const remaining = list.length - shown.length
  const styles = sizeMap[size]

  return (
    <div className="flex items-center">
      {shown.map((c, idx) => (
        <div
          key={c.email}
          className={`${styles.circle} ${idx > 0 ? styles.overlap : ''} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-vintiga-surface`}
          style={{ backgroundColor: c.colour }}
          title={`${c.name} · ${c.commits} commit${c.commits === 1 ? '' : 's'} · last ${c.lastCommit}`}
        >
          <span className={styles.font}>{c.initials}</span>
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`${styles.circle} ${styles.overlap} rounded-full flex items-center justify-center font-semibold bg-vintiga-surface-element text-vintiga-foreground-muted ring-2 ring-vintiga-surface`}
          title={list.slice(max).map((c) => c.name).join(', ')}
        >
          <span className={styles.font}>+{remaining}</span>
        </div>
      )}
    </div>
  )
}
