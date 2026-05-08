import { useState } from 'react'
import { Button } from '@ds/shared/Button'
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
import { EditLocationModal } from './EditLocationModal'

// ─── LocationsTab ────────────────────────────────────────────────────────────
// Body of the Settings · Locations tab. Two stacked sections — one per
// location kind (Physical / Inventory) — each with its own header (title +
// short description + Add CTA) and a table of rows. Edit fires the shared
// EditLocationModal which owns the form (identity + business hours + pickup
// per LIN-517).

export function LocationsTab() {
  const [locations, setLocations] = useState<Location[]>(LOCATIONS)
  const [editing, setEditing]     = useState<Location | null>(null)

  const physical  = locations.filter((l) => l.kind === 'physical')
  const inventory = locations.filter((l) => l.kind === 'inventory')

  function handleSave(next: Location) {
    setLocations((prev) => prev.map((l) => (l.id === next.id ? next : l)))
  }

  return (
    <>
      <div className="flex flex-col gap-vintiga-lg">
        <LocationsCard kind="physical"  rows={physical}  onEdit={setEditing} showActions />
        <LocationsCard kind="inventory" rows={inventory} onEdit={setEditing} />
      </div>

      <EditLocationModal
        open={!!editing}
        location={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </>
  )
}

function LocationsCard({
  kind,
  rows,
  onEdit,
  showActions = false,
}: {
  kind: LocationKind
  rows: Location[]
  onEdit: (loc: Location) => void
  /** Inventory locations don't expose an Actions column in Figma — they're
   *  managed elsewhere. Default false matches that. */
  showActions?: boolean
}) {
  return (
    <section className="border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white overflow-hidden">
      <div className="flex items-start justify-between gap-vintiga-md p-vintiga-lg pb-vintiga-md">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="typo-title-section font-semibold text-vintiga-slate-900">
            {LOCATION_KIND_LABEL[kind]}
          </h3>
          <p className="typo-body-sm text-vintiga-slate-500">
            {LOCATION_KIND_DESCRIPTION[kind]}
          </p>
        </div>
        <Button onClick={() => {}}>Add</Button>
      </div>

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
          {rows.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="font-medium text-vintiga-slate-900">{l.name}</TableCell>
              <TableCell className="text-vintiga-slate-700">
                {[l.city, l.state, l.zip, l.country].filter(Boolean).join(', ')}
              </TableCell>
              <TableCell className="text-vintiga-slate-700">{l.phone}</TableCell>
              {showActions && (
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<PencilIcon />}
                    onClick={() => onEdit(l)}
                  >
                    Edit
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
