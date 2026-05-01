import { useState } from 'react'
import { OverviewLayout } from './OverviewLayout'
import { useProductState, productActions, type Collection, type CatalogueProduct } from './productStore'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { TextField } from '@ds/shared/TextField'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { ListCard } from '@ds/shared/ListCard'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { EmptyState } from '@ds/components/EmptyState'
import { CollectionProductsTable, AddProductsSearch } from './CollectionProductsTable'
import { Field, Select } from './ProductLayout'
import {
  PlusIcon,
  SearchIcon,
  EllipsisIcon,
  EllipsisVerticalIcon,
  PackageIcon,
  ListPlusIcon,
  TrashIcon,
  BeerIcon,
  MartiniIcon,
  WineIcon,
  SandwichIcon,
  FolderIcon,
  BoldIcon, ItalicIcon, UnderlineIcon, UndoIcon, RedoIcon,
  AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon,
  LinkIcon, ImageIcon,
} from '@ds/icons/Icons'

// ─── Inline rich-text editor (visual placeholder) ─────────────────────────────

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
        className="min-h-[140px] border border-vintiga-slate-200 rounded-b-vintiga-md bg-vintiga-white px-3 py-3 typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500"
        contentEditable
        suppressContentEditableWarning
      />
    </div>
  )
}

// ─── Summary form (Figma 5594:18632) ─────────────────────────────────────────

function SummaryForm({ collection }: { collection: Collection }) {
  const [title, setTitle] = useState(collection.name)
  const [type, setType] = useState('Experience Type')
  const [status, setStatus] = useState('Available')
  const [webStatus, setWebStatus] = useState('Available')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [slug, setSlug] = useState('')
  const remaining = 160 - metaDescription.length

  return (
    <div className="flex flex-col gap-vintiga-md">
      {/* Top form fields */}
      <div className="grid grid-cols-2 gap-vintiga-md">
        <Field label="Title" required>
          <TextField
            placeholder="e.g. Tastings"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label="Type">
          <Select
            value={type}
            onChange={setType}
            options={['Experience Type', 'Tasting', 'Tour', 'Workshop', 'Seasonal', 'Custom']}
          />
        </Field>
        <Field label="Status">
          <Select
            value={status}
            onChange={setStatus}
            options={['Available', 'Not Available']}
          />
        </Field>
        <Field label="Web Status">
          <Select
            value={webStatus}
            onChange={setWebStatus}
            options={['Available', 'Not Available']}
          />
        </Field>
      </div>

      <Field label="Content">
        <RichTextEditor />
      </Field>

      {/* SEO section */}
      <div className="flex flex-col gap-vintiga-md pt-vintiga-lg border-t border-vintiga-slate-200">
        <h3 className="typo-body-lg font-semibold text-vintiga-slate-900">SEO</h3>
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
            className="px-3 py-2.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors min-h-[100px] resize-y"
          />
        </Field>
        <Field label="Slug" required>
          <TextField
            placeholder="Enter slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </Field>
      </div>
    </div>
  )
}

// ─── Map a collection type to its leading icon ──────────────────────────────

function iconForType(type: string): React.ReactNode {
  switch (type) {
    case 'Experience Type': return <FolderIcon />
    case 'Tasting':         return <WineIcon />
    case 'Tour':            return <MartiniIcon />
    case 'Workshop':        return <SandwichIcon />
    case 'Seasonal':        return <BeerIcon />
    default:                return <FolderIcon />
  }
}

// ─── Row kebab — used inside each ListCard ──────────────────────────────────

function RowKebabMenu({ collectionName, selected = false }: { collectionName: string; selected?: boolean }) {
  return (
    <PopoverMenu
      align="right"
      trigger={(_open, toggle) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggle() }}
          aria-label={`${collectionName} actions`}
          className={[
            'w-5 h-5 flex items-center justify-center transition-colors cursor-pointer p-0 bg-transparent border-0',
            selected
              ? 'text-vintiga-indigo-700 hover:text-vintiga-indigo-800'
              : 'text-vintiga-slate-400 hover:text-vintiga-slate-700',
          ].join(' ')}
        >
          <EllipsisVerticalIcon className="w-5 h-5" />
        </button>
      )}
      items={[
        { label: 'View',      onClick: () => {} },
        { label: 'Duplicate', onClick: () => {} },
        { label: 'Archive',   onClick: () => {}, danger: true },
      ]}
    />
  )
}

function CollectionList({
  collections,
  selectedId,
  onSelect,
}: {
  collections: Collection[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-vintiga-md">
      <div className="flex items-center justify-between gap-vintiga-md">
        <h2 className="typo-body-lg font-semibold text-vintiga-slate-900">
          Collections {collections.length > 0 && <span className="text-vintiga-slate-500 font-normal">({collections.length})</span>}
        </h2>
        <Button as="a" href="#/web/experiences/collections/new" leftIcon={<PlusIcon />} size="lg">Add</Button>
      </div>

      <TextField placeholder="Search Collections" leftIcon={<SearchIcon className="w-4 h-4" />} />

      {collections.length > 0 ? (
        <div className="flex flex-col gap-vintiga-sm" role="listbox" aria-label="Collections">
          {collections.map((c) => (
            <ListCard
              key={c.id}
              label={c.name}
              icon={iconForType(c.type)}
              selected={selectedId === c.id}
              onClick={() => onSelect(c.id)}
              action={<RowKebabMenu collectionName={c.name} selected={selectedId === c.id} />}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 min-h-[280px] flex items-center justify-center">
          <EmptyState
            icon={<ListPlusIcon className="w-5 h-5" />}
            title="No Collections"
            description="Add a collection to better organize and sell your products on your website and POS"
            action={
              <Button as="a" href="#/web/experiences/collections/new" leftIcon={<PlusIcon />} variant="outline" size="sm">
                Add
              </Button>
            }
          />
        </div>
      )}
    </div>
  )
}

function ProductsPanel({
  collection,
  products,
  onRemove,
}: {
  collection: Collection
  products: CatalogueProduct[]
  onRemove: (productId: string) => void
}) {
  const [tab, setTab] = useState<'products' | 'summary'>('products')
  const alreadyAddedIds = new Set(products.map((p) => p.id))

  return (
    <div className="flex flex-col gap-vintiga-md min-w-0 h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-vintiga-md">
        <h2 className="typo-body-lg font-semibold text-vintiga-slate-900">{collection.name}</h2>
        <div className="flex items-center gap-2">
          <Button size="lg">Save</Button>
          <PopoverMenu
            align="right"
            trigger={(_open, toggle) => (
              <IconButton
                variant="outline"
                size="lg"
                icon={<EllipsisIcon />}
                aria-label="More"
                onClick={toggle}
              />
            )}
            items={[
              { label: 'Duplicate', onClick: () => {} },
              { label: 'Archive',   onClick: () => {}, danger: true },
            ]}
          />
        </div>
      </div>

      {/* Tabs */}
      <SegmentedControl<'products' | 'summary'>
        value={tab}
        onChange={setTab}
        className="self-start"
        aria-label="Collection tabs"
        options={[
          { value: 'products', label: 'Products' },
          { value: 'summary',  label: 'Summary' },
        ]}
      />

      {tab === 'summary' ? (
        <SummaryForm collection={collection} />
      ) : products.length > 0 ? (
        <CollectionProductsTable
          products={products}
          onRemove={onRemove}
          onAdd={(productId) => productActions.addProductToCollection(collection.id, productId)}
          onReorder={(from, to) => productActions.reorderProductInCollection(collection.id, from, to)}
        />
      ) : (
        <>
          <div className="flex items-center gap-vintiga-md">
            <AddProductsSearch
              alreadyAddedIds={alreadyAddedIds}
              onAdd={(productId) => productActions.addProductToCollection(collection.id, productId)}
            />
            <span className="typo-body-sm text-vintiga-slate-500 shrink-0">0 products selected</span>
            <IconButton
              variant="outline"
              size="md"
              icon={<TrashIcon />}
              aria-label="Bulk delete"
              disabled
            />
          </div>
          <div className="flex-1 min-h-[280px] flex items-center justify-center">
            <EmptyState
              bordered={false}
              icon={<PackageIcon className="w-5 h-5" />}
              title="No Products"
              description="Looks like your collection doesn't have any products yet. Why not start by adding one?"
            />
          </div>
        </>
      )}
    </div>
  )
}

function NoSelectionPanel() {
  return (
    <div className="flex-1 min-h-[400px] border border-vintiga-slate-200 rounded-vintiga-lg flex items-center justify-center bg-vintiga-white">
      <EmptyState
        icon={<PackageIcon className="w-5 h-5" />}
        title="No Products"
        description="Your collection's empty right now. How about adding a Collection to get started?"
      />
    </div>
  )
}

export function CollectionsScreen() {
  const { allCollections, catalogue } = useProductState()
  const [selectedId, setSelectedId] = useState<string | null>(allCollections[0]?.id ?? null)

  const selected = allCollections.find((c) => c.id === selectedId) ?? null
  const productsInSelected = selected
    ? catalogue.filter((p) => selected.productIds.includes(p.id))
    : []

  return (
    <OverviewLayout title="Collections" description="View and manage all your collections" activeTab="collections">
      <div className="bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-2xl overflow-hidden flex-1 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] h-full min-h-[500px]">
          {/* Left column — full-height divider via right border on this column */}
          <div className="lg:border-r lg:border-vintiga-slate-200 p-vintiga-lg">
            <CollectionList collections={allCollections} selectedId={selectedId} onSelect={setSelectedId} />
          </div>

          {/* Right column */}
          <div className="p-vintiga-lg min-w-0 h-full">
            {selected ? (
              <ProductsPanel
                collection={selected}
                products={productsInSelected}
                onRemove={(pid) => productActions.removeProductFromCollection(selected.id, pid)}
              />
            ) : (
              <NoSelectionPanel />
            )}
          </div>
        </div>
      </div>
    </OverviewLayout>
  )
}
