import { useEffect, useState, type ReactNode } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { RailSection } from '@ds/shared/RightRail'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { Tag } from '@ds/shared/Tag'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { EllipsisVerticalIcon, CalendarIcon } from '@ds/icons/Icons'
import { useClubState, clubActions, clubTypeLabel, type ClubKind } from './clubStore'

// ─── ClubEditorLayout ─────────────────────────────────────────────────────────
// Shell for the New Club / Edit Club flow. Sidebar + navbar + breadcrumb +
// tabs + RightRail "Club Details". Tab list is driven by club type:
//   • curated         → Overview / Releases / Emails
//   • account-credit  → Overview / Levels / Emails
//   • membership      → Overview / Emails

export type ClubEditorTab = 'overview' | 'releases' | 'levels' | 'emails'

const ROUTES: Record<ClubEditorTab, string> = {
  overview: '#/web/clubs/new/overview',
  releases: '#/web/clubs/new/releases',
  levels:   '#/web/clubs/new/levels',
  emails:   '#/web/clubs/new/emails',
}

function tabsFor(type: ClubKind): { value: ClubEditorTab; label: string; href: string }[] {
  const overview = { value: 'overview' as ClubEditorTab, label: 'Overview', href: ROUTES.overview }
  const emails   = { value: 'emails'   as ClubEditorTab, label: 'Emails',   href: ROUTES.emails }
  if (type === 'curated')         return [overview, { value: 'releases', label: 'Releases', href: ROUTES.releases }, emails]
  if (type === 'account-credit')  return [overview, { value: 'levels',   label: 'Levels',   href: ROUTES.levels   }, emails]
  return [overview, emails]
}

// Read `?type=…` off the hash — used by `?type=curated|account-credit|membership`
// when the user lands here from the Add Club modal.
function syncTypeFromUrl() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const t = params.get('type') as ClubKind | null
  if (t === 'curated' || t === 'account-credit' || t === 'membership') {
    // Only restart if the type actually changed — prevents wiping in-progress drafts.
    // The store's `startNew` zeroes the draft.
    // We do this once on first land via the URL.
    return t
  }
  return null
}

// ─── Right rail — Club Details summary ────────────────────────────────────────

function ClubDetailsRail({ tab }: { tab: ClubEditorTab }) {
  const club = useClubState()

  return (
    <RailSection title="Club Details">
      <div className="flex flex-col gap-vintiga-md">
        <DetailRow label="Type">
          <Tag variant="filled" tone="violet" size="sm">
            {clubTypeLabel(club.type)}
          </Tag>
        </DetailRow>

        <DetailRow label="Terms & Conditions">
          <Tag variant="filled" tone="default" size="sm">
            {club.termsBody.trim().length > 0 ? 'Set' : 'Not Set'}
          </Tag>
        </DetailRow>

        {club.type === 'account-credit' && (
          <DetailRow label="Levels">
            <span className="typo-body-sm text-vintiga-slate-700">
              {club.levels.find((l) => l.isDefault)?.name || 'Untitled Level'} (default)
            </span>
          </DetailRow>
        )}

        {club.type === 'membership' && (
          <>
            <DetailRow label="Membership Fee">
              <span className="typo-body-sm text-vintiga-slate-700">
                ${club.membershipFee.toFixed(2)}
              </span>
            </DetailRow>
            <DetailRow label="Auto Renew">
              <span className="typo-body-sm text-vintiga-slate-700">
                {club.autoRenew ? 'Yes' : 'No'}
              </span>
            </DetailRow>
          </>
        )}

        {tab === 'releases' && (
          <DetailRow label="Stats">
            <span className="typo-body-sm text-vintiga-slate-700">
              10 Active | 2 On-hold | 2 New | 1 Canceled
            </span>
          </DetailRow>
        )}

        <DetailRow label="Email Templates">
          <div className="flex flex-col">
            <span className="typo-body-sm text-vintiga-slate-700">0 customized</span>
            <span className="typo-body-sm text-vintiga-slate-500">10 using global</span>
          </div>
        </DetailRow>

        <DetailRow label="Date Created">
          <span className="typo-body-sm text-vintiga-slate-700 inline-flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-vintiga-slate-400" />
            {club.dateCreated}
          </span>
        </DetailRow>
      </div>
    </RailSection>
  )
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  // `items-start` stops `<Tag>` (inline-flex) from stretching to fill the
  // cross axis when used as a flex child — keeps pills content-width.
  return (
    <div className="flex flex-col gap-vintiga-xs items-start">
      <span className="typo-body-sm font-semibold text-vintiga-slate-900">{label}</span>
      {children}
    </div>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export function ClubEditorLayout({
  activeTab,
  /** Hide the right rail entirely (e.g. on Add Release sub-page). */
  hideRail = false,
  /** Pass extra breadcrumb crumbs (e.g. ['Blind Enthusiasm', 'Add Club Release']). */
  extraCrumbs,
  /** Replace the default Save action cluster (e.g. show only Save on sub-pages). */
  actions,
  children,
}: {
  activeTab: ClubEditorTab | null
  hideRail?: boolean
  extraCrumbs?: { label: string; href?: string }[]
  actions?: ReactNode
  children: ReactNode
}) {
  const club = useClubState()
  const [collapsed, setCollapsed] = useState(false)

  // Honour ?type= when the user first lands from the Add Club modal.
  useEffect(() => {
    const t = syncTypeFromUrl()
    if (t && t !== club.type) {
      clubActions.startNew(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const displayName = club.name || 'New club'

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar collapsed={collapsed} activeNav="Clubs" />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          device="desktop"
          fixed
          user={{ name: 'Tom Cook', initials: 'TC' }}
          onMenuToggle={() => setCollapsed((c) => !c)}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />
        <div className="flex-1 overflow-y-auto pt-16 bg-vintiga-white">
          <PageTemplate
            breadcrumbs={[
              { icon: <BreadcrumbHomeIcon />, href: '#/web/clubs' },
              { label: 'Clubs', href: '#/web/clubs' },
              ...(extraCrumbs ?? [{ label: displayName }]),
            ]}
            title={
              extraCrumbs && extraCrumbs.length > 1
                ? extraCrumbs[extraCrumbs.length - 1].label
                : displayName
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
                <SegmentedControl<ClubEditorTab>
                  value={activeTab}
                  aria-label="Club editor tabs"
                  options={tabsFor(club.type)}
                />
              ) : undefined
            }
            rail={!hideRail ? <ClubDetailsRail tab={activeTab ?? 'overview'} /> : undefined}
          >
            {children}
          </PageTemplate>
        </div>
      </div>
    </div>
  )
}
