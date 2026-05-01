import type { ReactNode } from 'react'
import { Shell } from './Shell'
import { SegmentedControl } from '@ds/shared/SegmentedControl'

type OverviewTab = 'experiences' | 'collections'

function HeaderTabs({ active }: { active: OverviewTab }) {
  return (
    <SegmentedControl<OverviewTab>
      value={active}
      aria-label="Switch between Experiences and Collections"
      options={[
        { value: 'experiences', label: 'Experiences', href: '#/web/experiences/list' },
        { value: 'collections', label: 'Collections', href: '#/web/experiences/collections' },
      ]}
    />
  )
}

export function OverviewLayout({
  title,
  description,
  activeTab,
  children,
}: {
  title: string
  description: string
  activeTab: OverviewTab
  children: ReactNode
}) {
  return (
    <Shell bg="slate">
      <div className="p-vintiga-xl flex flex-col gap-vintiga-xl flex-1 min-h-0">
        <div className="flex items-start justify-between gap-vintiga-lg">
          <div>
            <h1 className="typo-title-section font-semibold text-vintiga-slate-900">{title}</h1>
            <p className="typo-body-sm text-vintiga-slate-500 mt-1">{description}</p>
          </div>
          <HeaderTabs active={activeTab} />
        </div>
        {children}
      </div>
    </Shell>
  )
}
