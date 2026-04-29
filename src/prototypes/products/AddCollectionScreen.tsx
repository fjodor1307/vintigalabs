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
import {
  HomeIcon,
  ChevronRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  UndoIcon,
  RedoIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  LinkIcon,
  ImageIcon,
  SearchIcon,
} from '@ds/icons/Icons'

function RichTextEditor() {
  const tools: { icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { icon: UndoIcon, label: 'Undo' },
    { icon: RedoIcon, label: 'Redo' },
    { icon: BoldIcon, label: 'Bold' },
    { icon: ItalicIcon, label: 'Italic' },
    { icon: UnderlineIcon, label: 'Underline' },
    { icon: AlignLeftIcon, label: 'Align left' },
    { icon: AlignCenterIcon, label: 'Align center' },
    { icon: AlignRightIcon, label: 'Align right' },
    { icon: AlignJustifyIcon, label: 'Justify' },
    { icon: LinkIcon, label: 'Link' },
    { icon: ImageIcon, label: 'Image' },
  ]
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border border-vintiga-slate-200 border-b-0 rounded-t-vintiga-md bg-vintiga-white">
        {tools.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.label}
              type="button"
              title={t.label}
              className="w-7 h-7 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
            >
              <Icon className="w-3.5 h-3.5 text-vintiga-slate-600" />
            </button>
          )
        })}
      </div>
      <div
        className="min-h-[180px] border border-vintiga-slate-200 rounded-b-vintiga-md bg-vintiga-white px-3 py-3 typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500"
        contentEditable
        suppressContentEditableWarning
      />
    </div>
  )
}

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 typo-body-sm" aria-label="Breadcrumb">
      <a href="#/web/products/list" className="text-vintiga-slate-500 hover:text-vintiga-slate-700 no-underline flex items-center">
        <HomeIcon className="w-4 h-4" />
      </a>
      <ChevronRightIcon className="w-3.5 h-3.5 text-vintiga-slate-400" />
      <a href="#/web/products/collections" className="text-vintiga-slate-500 hover:text-vintiga-slate-700 no-underline">Collections</a>
      <ChevronRightIcon className="w-3.5 h-3.5 text-vintiga-slate-400" />
      <span className="text-vintiga-slate-900 font-semibold">Add Collection</span>
    </nav>
  )
}

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
          <Breadcrumb />

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
                  <RichTextEditor />
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
                  <textarea
                    placeholder="Enter description"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
                    className="px-3 py-2.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors min-h-[72px] resize-y"
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
