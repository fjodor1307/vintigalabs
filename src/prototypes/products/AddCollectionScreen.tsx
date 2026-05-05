import { useState } from 'react'
import { Shell } from './Shell'
import { Field, Select, SectionCard } from './ProductLayout'
import { CollectionProductsTable } from './CollectionProductsTable'
import { useProductState, productActions } from './productStore'
import { Button } from '@ds/shared/Button'
import { Radio } from '@ds/shared/Radio'
import { TextField } from '@ds/shared/TextField'
import { Tag } from '@ds/shared/Tag'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { RightRail, RailSection } from '@ds/shared/RightRail'
import { Breadcrumb, BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { RichTextEditor } from '@ds/shared/RichTextEditor'
import { Textarea } from '@ds/shared/Textarea'
import { SearchIcon } from '@ds/icons/Icons'

export function AddCollectionScreen() {
  const { catalogue } = useProductState()
  const [tab, setTab] = useState<'summary' | 'products'>('summary')
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Wine Type')
  const [status, setStatus] = useState<'available' | 'not-available'>('available')
  const [webStatus, setWebStatus] = useState<'available' | 'not-available'>('available')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [pickedIds, setPickedIds] = useState<string[]>([])
  const pickedProducts = catalogue.filter((p) => pickedIds.includes(p.id))

  function save() {
    if (title.trim()) productActions.addCollection(title.trim(), type)
    window.location.hash = '#/web/products/collections'
  }

  const remaining = 160 - metaDescription.length

  return (
    <Shell bg="white">
      <div className="flex flex-col lg:flex-row">
        {/* Main column */}
        <div className="flex-1 p-vintiga-xl flex flex-col gap-vintiga-md min-w-0">
          <Breadcrumb
            items={[
              { icon: <BreadcrumbHomeIcon />, href: '#/web/products/list' },
              { label: 'Collections', href: '#/web/products/collections' },
              { label: 'Add Collection' },
            ]}
          />

          <div className="flex items-center justify-between gap-vintiga-md">
            <h1 className="typo-title-section font-semibold text-vintiga-slate-900">Add Collection</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" as="a" href="#/web/products/collections">Cancel</Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>

          {/* Tabs */}
          <SegmentedControl<'summary' | 'products'>
            value={tab}
            onChange={setTab}
            className="self-start"
            aria-label="Add collection tabs"
            options={[
              { value: 'summary',  label: 'Summary' },
              { value: 'products', label: 'Products' },
            ]}
          />

          {tab === 'summary' ? (
            <div className="flex flex-col gap-vintiga-md">
              <SectionCard title="">
                <div className="grid grid-cols-2 gap-vintiga-md">
                  <Field label="Title" required>
                    <TextField
                      placeholder="e.g. White Wines"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Field>
                  <Field label="Type">
                    <Select
                      value={type}
                      onChange={setType}
                      options={['Wine Type', 'Beer Type', 'Spirit Type', 'Food Type', 'Tasting', 'Custom']}
                    />
                  </Field>
                </div>

                <Field label="Content">
                  <RichTextEditor minHeightClass="min-h-[180px]" />
                </Field>
              </SectionCard>

              <SectionCard title="SEO">
                <Field label="Meta Tag Title">
                  <TextField
                    placeholder="Enter title"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                  />
                </Field>

                <Field label="Meta Tag Description" helper={`${Math.max(0, remaining)} characters remaining`}>
                  <Textarea
                    placeholder="Enter description"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
                  />
                </Field>

                <Field label="Slug" required>
                  <TextField
                    placeholder="Enter slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </Field>
              </SectionCard>
            </div>
          ) : (
            <CollectionProductsTable
              products={pickedProducts}
              onRemove={(id) => setPickedIds((prev) => prev.filter((p) => p !== id))}
              onAdd={(id) => setPickedIds((prev) => prev.includes(id) ? prev : [...prev, id])}
              onReorder={(from, to) => {
                setPickedIds((prev) => {
                  const next = [...prev]
                  const [m] = next.splice(from, 1)
                  next.splice(to, 0, m)
                  return next
                })
              }}
            />
          )}
        </div>

        {/* Right rail — collapsible */}
        <RightRail>
          <RailSection title="Status">
            <Radio checked={status === 'available'}    onChange={() => setStatus('available')}    label="Available" />
            <Radio checked={status === 'not-available'} onChange={() => setStatus('not-available')} label="Not Available" />
          </RailSection>

          <RailSection title="Web Status">
            <Radio checked={webStatus === 'available'}    onChange={() => setWebStatus('available')}    label="Available" />
            <Radio checked={webStatus === 'not-available'} onChange={() => setWebStatus('not-available')} label="Not Available" />
          </RailSection>

          <RailSection
            title="Collections"
            action={<Button variant="outline" size="sm">Create</Button>}
          >
            <TextField placeholder="Search" leftIcon={<SearchIcon className="w-4 h-4" />} />
            <div className="flex flex-wrap gap-1.5">
              <Tag variant="outline" onRemove={() => {}}>Wines</Tag>
              <Tag variant="outline" onRemove={() => {}}>Red Wines</Tag>
            </div>
          </RailSection>
        </RightRail>
      </div>
    </Shell>
  )
}
