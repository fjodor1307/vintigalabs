import { type ReactNode } from 'react'
import { Tooltip } from '@base-ui/react/tooltip'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { RailSection } from '@ds/shared/RightRail'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { Tag } from '@ds/shared/Tag'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { EllipsisVerticalIcon, CalendarIcon, FlagIcon, InfoIcon } from '@ds/icons/Icons'
import { VIEW_CLUB } from './clubViewSample'

// ─── ClubViewLayout ───────────────────────────────────────────────────────────
// Shell for the *existing* club detail flow: AppSidebar + Navbar + PageTemplate
// with breadcrumbs, club name H1, header actions, tabs, and the
// `ClubSummaryRail`. Mirrors `ClubEditorLayout` but with a fixed tab set
// (Overview / Members / Releases / Emails) and a richer rail.
//
// Sample data is hard-coded — this is a prototype with a single canonical
// club ("Blind Enthusiasm"). Real wiring loads by id.

export type ClubViewTab = 'overview' | 'members' | 'releases' | 'emails'

const ROUTES: Record<ClubViewTab, string> = {
  overview: '#/web/clubs/view/overview',
  members:  '#/web/clubs/view/members',
  releases: '#/web/clubs/view/releases',
  emails:   '#/web/clubs/view/emails',
}

const TABS: { value: ClubViewTab; label: string; href: string }[] = [
  { value: 'overview', label: 'Overview', href: ROUTES.overview },
  { value: 'members',  label: 'Members',  href: ROUTES.members  },
  { value: 'releases', label: 'Releases', href: ROUTES.releases },
  { value: 'emails',   label: 'Emails',   href: ROUTES.emails   },
]

// ─── Right rail — Club summary ────────────────────────────────────────────────

function ClubSummaryRail() {
  return (
    <RailSection title="Club Details">
      <div className="flex flex-col gap-vintiga-md">
        <DetailRow
          label="Type"
          action={<a href="#/web/clubs/new/overview" className="typo-body-sm font-semibold text-vintiga-indigo-600">Edit</a>}
        >
          <Tag variant="filled" tone="violet" size="sm">{VIEW_CLUB.type}</Tag>
        </DetailRow>

        <DetailRow label="Email Templates">
          <div className="flex flex-col">
            <span className="typo-body-sm text-vintiga-slate-700">{VIEW_CLUB.emailTemplates.customized} customized</span>
            <span className="typo-body-sm text-vintiga-slate-500">{VIEW_CLUB.emailTemplates.global} using global</span>
          </div>
        </DetailRow>

        <DetailRow label="Members">
          <span className="typo-body-sm text-vintiga-slate-700">
            {VIEW_CLUB.members.total} Total · {VIEW_CLUB.members.active} Active · {VIEW_CLUB.members.onHold} On-hold · {VIEW_CLUB.members.new} New · {VIEW_CLUB.members.canceled} Canceled
          </span>
        </DetailRow>

        <DetailRow label="Date Created">
          <span className="typo-body-sm text-vintiga-slate-700 inline-flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-vintiga-slate-400" />
            {VIEW_CLUB.dateCreated}
          </span>
        </DetailRow>

        <DetailRow
          label="Manual Review"
          info="Orders will be skipped in auto processing and need admin review."
        >
          <span className="typo-body-sm text-vintiga-orange-700 inline-flex items-center gap-1.5">
            <FlagIcon className="w-4 h-4" />
            {VIEW_CLUB.flagged} Members flagged
          </span>
        </DetailRow>
      </div>
    </RailSection>
  )
}

function DetailRow({
  label,
  action,
  info,
  children,
}: {
  label: string
  action?: ReactNode
  /** Optional helper copy. Renders an info icon next to the label that
   *  reveals this text in a tooltip on hover or focus. */
  info?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-vintiga-xs items-start">
      <div className="flex w-full items-center justify-between gap-vintiga-sm">
        <span className="inline-flex items-center gap-1 typo-body-sm font-semibold text-vintiga-slate-900">
          {label}
          {info && (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger
                  render={
                    <button
                      type="button"
                      aria-label={`More info: ${label}`}
                      className="inline-flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-slate-600 transition-colors bg-transparent border-none p-0 cursor-help"
                    >
                      <InfoIcon className="w-3.5 h-3.5" />
                    </button>
                  }
                />
                <Tooltip.Portal>
                  <Tooltip.Positioner sideOffset={6}>
                    <Tooltip.Popup className="max-w-[260px] bg-vintiga-foreground text-vintiga-surface typo-caption font-medium px-2 py-1.5 rounded shadow-lg">
                      {info}
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
        </span>
        {action}
      </div>
      {children}
    </div>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export function ClubViewLayout({
  activeTab,
  hideRail = false,
  extraCrumbs,
  actions,
  titleOverride,
  children,
}: {
  activeTab: ClubViewTab | null
  hideRail?: boolean
  extraCrumbs?: { label: string; href?: string }[]
  actions?: ReactNode
  /** Override the auto-derived H1 — useful when a status pill needs to sit inline. */
  titleOverride?: ReactNode
  children: ReactNode
}) {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Clubs"
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          device="responsive"
          fixed
          user={{ name: 'Tom Cook', initials: 'TC' }}
          onMenuToggle={onMenuToggle}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />
        <div className="flex-1 overflow-y-auto pt-16 bg-vintiga-white">
          <PageTemplate
            breadcrumbs={[
              { icon: <BreadcrumbHomeIcon />, href: '#/web/clubs' },
              { label: 'Clubs', href: '#/web/clubs' },
              ...(extraCrumbs ?? [{ label: VIEW_CLUB.name }]),
            ]}
            title={
              titleOverride
                ? titleOverride
                : extraCrumbs && extraCrumbs.length > 1
                  ? extraCrumbs[extraCrumbs.length - 1].label
                  : VIEW_CLUB.name
            }
            actions={
              actions ?? (
                <>
                  <Button onClick={() => {}}>Save</Button>
                  <PopoverMenu
                    align="right"
                    width="w-44"
                    trigger={(_open, toggle) => (
                      <IconButton
                        variant="outline"
                        size="md"
                        icon={<EllipsisVerticalIcon />}
                        onClick={toggle}
                        aria-label="More actions"
                      />
                    )}
                    items={[
                      { label: 'Duplicate', onClick: () => {} },
                      { label: 'Archive',   onClick: () => {}, danger: true },
                    ]}
                  />
                </>
              )
            }
            tabs={
              activeTab ? (
                <SegmentedControl<ClubViewTab>
                  value={activeTab}
                  aria-label="Club view tabs"
                  options={TABS}
                />
              ) : undefined
            }
            rail={!hideRail ? <ClubSummaryRail /> : undefined}
          >
            {children}
          </PageTemplate>
        </div>
      </div>
    </div>
  )
}
