import { ClubViewLayout } from './ClubViewLayout'
import { CLUBS_CATALOG, getCurrentClubSlug } from './clubsCatalog'
import { RELEASES, releaseIdFromName, type Release, type Status } from './releaseSamples'
import { SectionCard } from '@ds/shared/SectionCard'
import { Tag } from '@ds/shared/Tag'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@ds/shared/Table'
import {
  CalendarIcon,
  PackageIcon,
  EllipsisVerticalIcon,
  PencilIcon,
} from '@ds/icons/Icons'

// ─── tiny tone helpers ────────────────────────────────────────────────────────

// ─── ReleaseDetailScreen ──────────────────────────────────────────────────────
// Drilled down from a row in the Releases tab. Shows the release header
// (name + status), an info card (date, draft orders, product count) and a
// products list. Reads the release id from the hash and looks the record up
// in the shared `releaseSamples` fixture.

const STATUS_TONE: Record<Status, { tone: 'success' | 'default' | 'info'; variant: 'filled' | 'neutral-light' }> = {
  Active:   { tone: 'success', variant: 'filled' },
  Archived: { tone: 'default', variant: 'neutral-light' },
  Planning: { tone: 'info',    variant: 'neutral-light' },
}

const SAMPLE_PRODUCTS = [
  { id: 'p1', name: '2021 Chardonnay',     sku: 'SKU-1234-1234', qty: 1, price: '$45.00' },
  { id: 'p2', name: '2020 Reserve Cab',    sku: 'SKU-2233-1003', qty: 2, price: '$65.00' },
  { id: 'p3', name: '2022 Pinot Noir',     sku: 'SKU-9912-7720', qty: 1, price: '$52.00' },
]

function getReleaseFromHash(): Release {
  const m = window.location.hash.match(/^#\/web\/clubs\/view\/[^/]+\/releases\/([^/?]+)/)
  if (m) {
    const id = decodeURIComponent(m[1])
    const found = RELEASES.find((r) => releaseIdFromName(r.name) === id)
    if (found) return found
  }
  return RELEASES[0]
}

export function ReleaseDetailScreen() {
  const slug    = getCurrentClubSlug()
  const club    = CLUBS_CATALOG[slug]
  const release = getReleaseFromHash()
  const tone    = STATUS_TONE[release.status]
  const releasesHref = `#/web/clubs/view/${slug}/releases`

  return (
    <ClubViewLayout
      activeTab={null}
      extraCrumbs={[
        { label: club.name,    href: `#/web/clubs/view/${slug}/overview` },
        { label: 'Releases',   href: releasesHref },
        { label: release.name },
      ]}
      titleOverride={
        <span className="inline-flex items-center gap-vintiga-sm">
          <span className="typo-title-screen font-semibold text-vintiga-slate-900">{release.name}</span>
          <Tag variant={tone.variant} tone={tone.tone} size="md">{release.status}</Tag>
        </span>
      }
      actions={
        <>
          <Button variant="outline" leftIcon={<PencilIcon />} onClick={() => {}}>Edit</Button>
          <PopoverMenu
            align="right"
            width="w-44"
            trigger={(_open, toggle) => (
              <IconButton
                variant="outline"
                size="md"
                icon={<EllipsisVerticalIcon />}
                onClick={toggle}
                aria-label="Release actions"
              />
            )}
            items={[
              { label: 'Duplicate', onClick: () => {} },
              { label: 'Archive',   onClick: () => { window.location.hash = releasesHref.slice(1) }, danger: true, disabled: release.status === 'Archived' },
            ]}
          />
        </>
      }
    >
      <div className="flex flex-col gap-vintiga-lg">
        <SectionCard title="Release Info" icon={<CalendarIcon />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-md">
            <InfoRow label="Date">{release.date}</InfoRow>
            <InfoRow label="Draft Orders">{release.draftOrders}</InfoRow>
            <InfoRow label="Club">{club.name}</InfoRow>
          </div>
        </SectionCard>

        <SectionCard title="Products" icon={<PackageIcon />}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Product</TableHeader>
                <TableHeader>SKU</TableHeader>
                <TableHeader className="text-right">Qty</TableHeader>
                <TableHeader className="text-right">Price</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {SAMPLE_PRODUCTS.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-vintiga-slate-900">{p.name}</TableCell>
                  <TableCell className="text-vintiga-slate-700">{p.sku}</TableCell>
                  <TableCell className="text-right">{p.qty}</TableCell>
                  <TableCell className="text-right font-medium">{p.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>
    </ClubViewLayout>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-vintiga-xs">
      <span className="typo-body-sm font-semibold text-vintiga-slate-900">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-700">{children}</span>
    </div>
  )
}
