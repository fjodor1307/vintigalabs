import type { ReactNode } from 'react'
import { Shell } from './Shell'
import { SegmentedControl } from '@ds/shared/SegmentedControl'

type OverviewTab = 'products' | 'collections'

function HeaderTabs({ active }: { active: OverviewTab }) {
  return (
    <SegmentedControl<OverviewTab>
      value={active}
      aria-label="Switch between Products and Collections"
      options={[
        { value: 'products',    label: 'Products',    href: '#/web/products/list' },
        { value: 'collections', label: 'Collections', href: '#/web/products/collections' },
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
      <div className="p-vintiga-xl flex flex-col gap-vintiga-xl">
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
