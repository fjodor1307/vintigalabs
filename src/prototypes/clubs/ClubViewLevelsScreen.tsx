import { useEffect } from 'react'
import { ClubViewLayout } from './ClubViewLayout'
import { LevelsEditor } from './LevelsEditor'
import { useClubState, clubActions } from './clubStore'
import { KpiCard } from '@ds/shared/KpiCard'
import {
  DollarIcon,
  UserCheckIcon,
  PackageIcon,
  ShoppingCartIcon,
} from '@ds/icons/Icons'

const SAMPLE_LEVELS = [
  { name: 'Bronze',   amount: 50,  cadence: 'Monthly'   as const },
  { name: 'Silver',   amount: 100, cadence: 'Monthly'   as const },
  { name: 'Gold',     amount: 250, cadence: 'Monthly'   as const },
  { name: 'Platinum', amount: 500, cadence: 'Quarterly' as const },
]

// ─── ClubViewLevelsScreen ───────────────────────────────────────────────────
// Levels tab on the View Club detail page (account-credit clubs only). KPI
// strip up top — mirroring the Releases tab — followed by the same
// `LevelsEditor` used in the editor flow, so designers can add / edit /
// remove contribution levels straight from the existing-club view.

export function ClubViewLevelsScreen() {
  // Seed the editor once with sensible Bronze/Silver/Gold/Platinum levels if
  // the store is empty — the prototype reuses the new-club draft store, which
  // initialises with no levels. We do this on mount; deletions persist after.
  const { levels } = useClubState()
  useEffect(() => {
    if (levels.length === 0) {
      SAMPLE_LEVELS.forEach((sample, i) => {
        clubActions.addLevel()
        // The newly added level is the last one; patch its fields.
        const next = (i === 0 ? 'l1' : `l${i + 1}`)
        clubActions.patchLevel(next, { name: sample.name, amount: sample.amount, cadence: sample.cadence })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ClubViewLayout activeTab="levels">
      <div className="flex flex-col gap-vintiga-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
          <KpiCard size="sm" label="Active members"      value="42"      icon={<UserCheckIcon />} />
          <KpiCard size="sm" label="Total contributions" value="$24,800" icon={<DollarIcon />} />
          <KpiCard size="sm" label="Avg balance"         value="$590"    icon={<PackageIcon />} />
          <KpiCard size="sm" label="Tastings redeemed"   value="118"     icon={<ShoppingCartIcon />} />
        </div>

        <LevelsEditor />
      </div>
    </ClubViewLayout>
  )
}
