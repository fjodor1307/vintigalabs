interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`h-4 rounded-vintiga-input bg-vintiga-surface-element animate-pulse ${className}`} />
  )
}

interface SkeletonTextProps {
  lines?: number
}

export function SkeletonText({ lines = 3 }: SkeletonTextProps) {
  return (
    <div className="flex flex-col gap-vintiga-sm">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="border border-vintiga-border rounded-vintiga-card p-vintiga-lg flex flex-col gap-vintiga-md">
      <div className="flex items-center gap-vintiga-md">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1">
          <SkeletonText lines={2} />
        </div>
      </div>
      <Skeleton className="w-full h-4" />
    </div>
  )
}
