import { useState } from 'react'
import { ClubEditorLayout } from './ClubEditorLayout'
import { ClubViewLayout } from './ClubViewLayout'
import { getViewClub } from './clubViewSample'
import { getCurrentClubSlug } from './clubsCatalog'
import { useClubState, clubActions } from './clubStore'
import { SectionCard } from '@ds/shared/SectionCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Switch } from '@ds/shared/Switch'
import { Radio } from '@ds/shared/Radio'
import { Tag } from '@ds/shared/Tag'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@ds/shared/Table'
import { AddProductsSearch } from '@/prototypes/products/CollectionProductsTable'
import { useProductState } from '@/prototypes/products/productStore'
import {
  CalendarIcon,
  GripVerticalIcon,
  TrashIcon,
} from '@ds/icons/Icons'

// ─── AddReleaseScreen ─────────────────────────────────────────────────────────
// Sub-page from the Releases tab — supports both flows:
//   • Editor flow  (#/web/clubs/new/releases/add)            for a brand-new club
//   • View flow    (#/web/clubs/view/releases/add)           for an existing club
//
// Layout matches the refreshed Figma: header carries a "Planning" status tag,
// main column hosts the Overview card (Title + Add Product search +
// products table), and the right Settings card collects qty rules,
// Manual/Auto processing radios (Auto reveals an "Auto Process Date" field),
// the KEY DATES group, and the "skip shipment" switch.

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '2021 Chardonnay',
    sku: 'SKU-1234-1234',
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=120&h=120&fit=crop',
    defaultQty: 1,
    minQty: 1,
    maxQty: 12,
    price: 100,
  },
]

interface Product {
  id: string
  name: string
  sku: string
  image: string
  defaultQty: number
  minQty: number
  maxQty: number
  price: number
}

type Mode = 'editor' | 'view'

export function AddReleaseScreen() {
  return <AddReleaseInner mode="editor" />
}

export function AddReleaseExistingScreen() {
  return <AddReleaseInner mode="view" />
}

function AddReleaseInner({ mode }: { mode: Mode }) {
  const club = useClubState()
  const { catalogue } = useProductState()
  const slug         = getCurrentClubSlug()
  const parentLabel  = mode === 'editor' ? (club.name || 'New club') : getViewClub().name
  const parentHref   = mode === 'editor' ? '#/web/clubs/new/releases'  : `#/web/clubs/view/${slug}/releases`

  const [title, setTitle]                       = useState('')
  const [products, setProducts]                 = useState<Product[]>(SAMPLE_PRODUCTS)
  const [minQty, setMinQty]                     = useState('1')
  const [maxQty, setMaxQty]                     = useState('')
  const [minOrderSubtotal, setMinOrderSubtotal] = useState('0')
  const [processing, setProcessing]             = useState<'manual' | 'auto' | null>('auto')
  const [autoProcessDate, setAutoProcessDate]   = useState('')
  const [availableDate, setAvailableDate]       = useState('')
  const [shippingDate, setShippingDate]         = useState('')
  const [pickupDate, setPickupDate]             = useState('')
  const [allowSkipOnline, setAllowSkipOnline]   = useState(false)

  function patchProduct(id: string, partial: Partial<Product>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)))
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  function addProduct(id: string) {
    const c = catalogue.find((p) => p.id === id)
    if (!c) return
    setProducts((prev) =>
      prev.some((p) => p.id === id)
        ? prev
        : [
            ...prev,
            {
              id: c.id,
              name: c.name,
              sku: c.sku,
              image: c.imageUrl ?? '',
              defaultQty: 1,
              minQty: 1,
              maxQty: 12,
              price: Number(c.price) || 0,
            },
          ],
    )
  }

  const addedIds = new Set(products.map((p) => p.id))

  function save() {
    if (mode === 'editor') {
      clubActions.addRelease({
        id: `r${club.releases.length + 1}`,
        title: title || 'Untitled Release',
        minQty: Number(minQty) || 1,
        maxQty: maxQty ? Number(maxQty) : undefined,
        minOrderSubtotal: Number(minOrderSubtotal) || 0,
        autoProcessDate,
        shipmentInstructions: '',
        letMembersProcessEarly: false,
        allowSkipOnline,
        productCount: products.length,
      })
    }
    window.location.hash = parentHref
  }

  const headerTitle = (
    <span className="inline-flex items-center gap-vintiga-md">
      <span>Add Club Release</span>
      <Tag variant="neutral-light" tone="default" size="md">Planning</Tag>
    </span>
  )

  const body = (
    <div className="flex gap-vintiga-lg">
      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col gap-vintiga-lg">
        <SectionCard title="Overview">
          <Field label="Title">
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </Field>

          <Field label="Add Product">
            <AddProductsSearch alreadyAddedIds={addedIds} onAdd={addProduct} />
          </Field>

          {products.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader className="!px-vintiga-sm w-9" />
                  <TableHeader>Product</TableHeader>
                  <TableHeader className="w-24">Default</TableHeader>
                  <TableHeader className="w-24">Min Qty</TableHeader>
                  <TableHeader className="w-24">Max Qty</TableHeader>
                  <TableHeader className="w-28">Price</TableHeader>
                  <TableHeader className="w-12" />
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="!px-vintiga-sm">
                      <span className="inline-flex w-6 h-6 items-center justify-center text-vintiga-slate-400 cursor-grab">
                        <GripVerticalIcon className="w-4 h-4" />
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-vintiga-sm">
                        <img
                          src={p.image}
                          alt=""
                          className="w-12 h-12 rounded-vintiga-md object-cover border border-vintiga-slate-200"
                          loading="lazy"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-vintiga-slate-900 truncate">{p.name}</span>
                          <span className="typo-caption text-vintiga-slate-500 truncate">{p.sku}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={String(p.defaultQty)}
                        onChange={(e) => patchProduct(p.id, { defaultQty: Number(e.target.value) || 0 })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={String(p.minQty)}
                        onChange={(e) => patchProduct(p.id, { minQty: Number(e.target.value) || 0 })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={String(p.maxQty)}
                        onChange={(e) => patchProduct(p.id, { maxQty: Number(e.target.value) || 0 })}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-vintiga-slate-900">${p.price.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <IconButton
                        variant="outline"
                        size="sm"
                        icon={<TrashIcon />}
                        aria-label={`Remove ${p.name}`}
                        onClick={() => removeProduct(p.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      </div>

      {/* Settings column */}
      <aside className="hidden lg:flex w-[412px] shrink-0">
        <SectionCard title="Settings" className="w-full">
          <Field label="Min Quantity of Products">
            <TextField
              type="number"
              value={minQty}
              onChange={(e) => setMinQty(e.target.value)}
            />
          </Field>
          <Field label="Max Quantity of Products">
            <TextField
              type="number"
              value={maxQty}
              onChange={(e) => setMaxQty(e.target.value)}
              placeholder=""
            />
          </Field>
          <Field label="Minimum Order Subtotal">
            <TextField
              type="number"
              value={minOrderSubtotal}
              onChange={(e) => setMinOrderSubtotal(e.target.value)}
              rightIcon={<span className="typo-body-sm text-vintiga-slate-400">$</span>}
            />
          </Field>

          {/* Manual / Auto */}
          <Field label="How should orders be processed?">
            <div className="flex flex-col gap-vintiga-sm pt-1">
              <Radio
                checked={processing === 'manual'}
                onChange={() => setProcessing('manual')}
                label="Manual"
              />
              <Radio
                checked={processing === 'auto'}
                onChange={() => setProcessing('auto')}
                label="Auto"
              />
            </div>
          </Field>

          {processing === 'auto' && (
            <Field
              label="Auto Process Date"
              helper="Orders are finalized and charged on this date."
            >
              <DateInput value={autoProcessDate} onChange={setAutoProcessDate} />
            </Field>
          )}

          {/* Key dates */}
          <div className="pt-vintiga-sm">
            <span className="typo-caption font-semibold uppercase tracking-wide text-vintiga-slate-500">
              Key dates
            </span>
          </div>

          <Field
            label="Available to Customer"
            helper="Customers can view and edit their order from this date."
          >
            <DateInput value={availableDate} onChange={setAvailableDate} />
          </Field>

          <Field label="Estimated Shipping Date">
            <DateInput value={shippingDate} onChange={setShippingDate} />
          </Field>

          <Field label="Pickup Available Date">
            <DateInput value={pickupDate} onChange={setPickupDate} />
          </Field>

          <div className="flex items-start justify-between gap-vintiga-md pt-vintiga-sm">
            <span className="typo-body-sm text-vintiga-slate-900 flex-1 min-w-0">
              Allow members to skip their shipment online
            </span>
            <Switch checked={allowSkipOnline} onChange={setAllowSkipOnline} />
          </div>
        </SectionCard>
      </aside>
    </div>
  )

  const sharedProps = {
    extraCrumbs: [
      { label: parentLabel, href: parentHref.replace('/releases', '/overview') },
      { label: 'Add Club Release' },
    ],
    actions: <Button onClick={save}>Save</Button>,
    titleOverride: headerTitle,
  }

  if (mode === 'view') {
    return (
      <ClubViewLayout activeTab={null} hideRail {...sharedProps}>
        {body}
      </ClubViewLayout>
    )
  }

  return (
    <ClubEditorLayout activeTab={null} hideRail {...sharedProps}>
      {body}
    </ClubEditorLayout>
  )
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="dd.mm.yyyy"
        className="h-10 w-full pl-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
      />
      <CalendarIcon className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-vintiga-slate-400 pointer-events-none" />
    </div>
  )
}
