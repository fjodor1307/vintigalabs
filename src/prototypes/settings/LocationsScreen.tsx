import { SettingsLayout } from './SettingsLayout'
import { Button } from '@ds/shared/Button'
import { Tag } from '@ds/shared/Tag'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@ds/shared/Table'
import {
  PlusIcon,
  EllipsisVerticalIcon,
  MapPinIcon,
} from '@ds/icons/Icons'
import { LOCATIONS } from './locationsSample'

// ─── LocationsScreen ─────────────────────────────────────────────────────────
// List of every location the merchant operates. Trigger surface for the
// LIN-517 work — the website needs each location's pickup status + business
// hours, both maintained from the editor screen.

export function LocationsScreen() {
  return (
    <SettingsLayout
      breadcrumbs={[
        { label: 'Settings', href: '#/web/settings' },
        { label: 'Locations' },
      ]}
      title="Locations"
      actions={<Button leftIcon={<PlusIcon />} onClick={() => {}}>Add Location</Button>}
    >
      <p className="typo-body-sm text-vintiga-slate-500 -mt-vintiga-sm mb-vintiga-md max-w-2xl">
        Tasting rooms, warehouses, and pickup points. Business hours and pickup
        instructions update on the website as soon as you save.
      </p>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Location</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader>Pickup</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="w-12" />
          </TableRow>
        </TableHead>
        <TableBody>
          {LOCATIONS.map((l) => {
            const href   = `#/web/settings/locations/${l.id}`
            const goEdit = () => { window.location.hash = href.slice(1) }
            return (
              <TableRow key={l.id} onClick={goEdit}>
                <TableCell>
                  <div className="flex items-center gap-vintiga-sm">
                    <div className="w-9 h-9 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                      <MapPinIcon />
                    </div>
                    <span className="font-medium text-vintiga-slate-900">{l.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-vintiga-slate-700">
                  {l.street}, {l.city}, {l.state} {l.zip}
                </TableCell>
                <TableCell>
                  {l.pickupEnabled
                    ? <Tag variant="filled" tone="success" size="sm">Available</Tag>
                    : <Tag variant="neutral-light" tone="default" size="sm">Disabled</Tag>}
                </TableCell>
                <TableCell>
                  {l.status === 'active'
                    ? <Tag variant="filled" tone="success" size="sm">Active</Tag>
                    : <Tag variant="neutral-light" tone="default" size="sm">Inactive</Tag>}
                </TableCell>
                <TableCell className="text-right">
                  <span onClick={(e) => e.stopPropagation()} className="inline-flex">
                    <PopoverMenu
                      align="right"
                      width="w-44"
                      trigger={(_open, toggle) => (
                        <IconButton
                          variant="outline"
                          size="sm"
                          icon={<EllipsisVerticalIcon />}
                          onClick={toggle}
                          aria-label={`${l.name} actions`}
                        />
                      )}
                      items={[
                        { label: 'Edit',     onClick: goEdit },
                        { label: 'Archive',  onClick: () => {}, danger: true },
                      ]}
                    />
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </SettingsLayout>
  )
}
