import { ClubEditorLayout } from './ClubEditorLayout'
import { useClubState } from './clubStore'
import { SectionCard } from '@ds/shared/SectionCard'
import { Button } from '@ds/shared/Button'
import { EmptyState } from '@ds/shared/EmptyState'
import { PlusIcon, PackageIcon } from '@ds/icons/Icons'

// ─── ClubReleasesScreen ───────────────────────────────────────────────────────
// Curated Club only — list of release shipments. Empty state on first load.

export function ClubReleasesScreen() {
  const club = useClubState()

  return (
    <ClubEditorLayout activeTab="releases">
      <SectionCard
        title={
          <div className="flex flex-col gap-1">
            <span>Club Releases</span>
            <span className="typo-body-sm font-normal text-vintiga-slate-500">
              View and manage all your club releases.
            </span>
          </div>
        }
        action={
          <Button
            variant="outline"
            size="md"
            leftIcon={<PlusIcon />}
            as="a"
            href="#/web/clubs/new/releases/add"
          >
            Add Release
          </Button>
        }
      >
        {club.releases.length === 0 ? (
          <EmptyState
            icon={<PackageIcon />}
            title="No Club Releases"
            description="No club releases are available. Please add a club release."
            action={
              <Button
                variant="outline"
                size="md"
                leftIcon={<PlusIcon />}
                as="a"
                href="#/web/clubs/new/releases/add"
              >
                Add Release
              </Button>
            }
          />
        ) : (
          <ul className="flex flex-col gap-vintiga-sm">
            {club.releases.map((r) => (
              <li
                key={r.id}
                className="border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-md flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="typo-body-sm font-semibold text-vintiga-slate-900">{r.title}</span>
                  <span className="typo-caption text-vintiga-slate-500">
                    {r.productCount} product{r.productCount === 1 ? '' : 's'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </ClubEditorLayout>
  )
}
