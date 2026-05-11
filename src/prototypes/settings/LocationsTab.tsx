import { Button } from '@ds/shared/Button'
import { RecordsCard } from '@ds/shared/RecordsCard'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@ds/shared/Table'
import { PencilIcon } from '@ds/icons/Icons'
import {
  LOCATIONS,
  LOCATION_KIND_DESCRIPTION,
  LOCATION_KIND_LABEL,
  type Location,
  type LocationKind,
} from './locationsSample'

// ─── LocationsTab ────────────────────────────────────────────────────────────
// Body of the Settings · Locations tab. Two stacked sections — one per
// location kind (Physical / Inventory) — each with its own header (title +
// short description + Add CTA) and a table of rows. Edit navigates to the
// dedicated `LocationEditScreen` sub-page (originally a modal; promoted to
// its own page because the long form scrolled awkwardly in a modal).

export function LocationsTab() {
  const physical  = LOCATIONS.filter((l) => l.kind === 'physical')
  const inventory = LOCATIONS.filter((l) => l.kind === 'inventory')

  return (
    <div className="flex flex-col gap-vintiga-lg">
      <LocationsCard kind="physical"  rows={physical}  showActions />
      <LocationsCard kind="inventory" rows={inventory} />
    </div>
  )
}

function LocationsCard({
  kind,
  rows,
  showActions = false,
}: {
  kind: LocationKind
  rows: Location[]
  /** Inventory locations don't expose an Actions column in Figma — they're
   *  managed elsewhere. Default false matches that. */
  showActions?: boolean
}) {
  return (
    <RecordsCard
      title={LOCATION_KIND_LABEL[kind]}
      subtitle={LOCATION_KIND_DESCRIPTION[kind]}
      action={<Button onClick={() => {}}>Add</Button>}
      divider={false}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader>Phone</TableHeader>
            {showActions && <TableHeader className="w-32">Actions</TableHeader>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((l) => {
            const goEdit = () => { window.location.hash = `/web/settings/locations/${l.id}` }
            return (
              <TableRow key={l.id} onClick={showActions ? goEdit : undefined}>
                <TableCell className="font-medium text-vintiga-slate-900">{l.name}</TableCell>
                <TableCell className="text-vintiga-slate-700">
                  {[l.city, l.state, l.zip, l.country].filter(Boolean).join(', ')}
                </TableCell>
                <TableCell className="text-vintiga-slate-700">{l.phone}</TableCell>
                {showActions && (
                  <TableCell>
                    <span onClick={(e) => e.stopPropagation()} className="inline-flex">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<PencilIcon />}
                        onClick={goEdit}
                      >
                        Edit
                      </Button>
                    </span>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </RecordsCard>
  )
}
