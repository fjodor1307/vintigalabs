import { useState } from 'react'
import { OverviewLayout } from './OverviewLayout'
import { useProductState, productActions, type Collection, type CatalogueProduct } from './productStore'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { EmptyState } from '@ds/components/EmptyState'
import { CollectionProductsTable } from './CollectionProductsTable'
import {
  PlusIcon,
  SearchIcon,
  EllipsisIcon,
  PackageIcon,
  ListPlusIcon,
} from '@ds/icons/Icons'

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
        <Button as="a" href="#/web/products/collections/new" leftIcon={<PlusIcon />} size="sm">Add</Button>
      </div>

      <TextField placeholder="Search Collections" leftIcon={<SearchIcon className="w-4 h-4" />} />

      {collections.length > 0 ? (
        <div className="flex flex-col gap-1">
          {collections.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={[
                'flex items-center justify-between gap-2 px-3 py-2 rounded-vintiga-md transition-colors border cursor-pointer text-left',
                selectedId === c.id
                  ? 'bg-vintiga-indigo-50 border-vintiga-indigo-200'
                  : 'bg-vintiga-white border-transparent hover:border-vintiga-slate-200 hover:bg-vintiga-slate-50',
              ].join(' ')}
            >
              <span className={`typo-body-sm ${selectedId === c.id ? 'text-vintiga-slate-900 font-medium' : 'text-vintiga-slate-900'}`}>
                {c.name}
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => e.stopPropagation()}
                className="w-6 h-6 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors text-vintiga-slate-400 cursor-pointer"
                aria-label={`${c.name} actions`}
              >
                <EllipsisIcon className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 min-h-[280px] flex items-center justify-center">
          <EmptyState
            icon={<ListPlusIcon className="w-5 h-5" />}
            title="No Collections"
            description="Add a collection to better organize and sell your products on your website and POS"
            action={
              <Button as="a" href="#/web/products/collections/new" leftIcon={<PlusIcon />} variant="outline" size="sm">
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

  return (
    <div className="flex flex-col gap-vintiga-md min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-vintiga-md">
        <h2 className="typo-body-lg font-semibold text-vintiga-slate-900">{collection.name}</h2>
        <div className="flex items-center gap-2">
          <Button>Save</Button>
          <button
            type="button"
            className="w-9 h-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white flex items-center justify-center hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
            aria-label="More"
          >
            <EllipsisIcon className="w-4 h-4 text-vintiga-slate-600" />
          </button>
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
        <div className="border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-lg bg-vintiga-white min-h-[200px]">
          <p className="typo-body-sm text-vintiga-slate-500">Summary view — collection meta, descriptions, and channels surface here. Stub for now.</p>
        </div>
      ) : products.length > 0 ? (
        <CollectionProductsTable
          products={products}
          onRemove={onRemove}
          onAdd={(productId) => productActions.addProductToCollection(collection.id, productId)}
          onReorder={(from, to) => productActions.reorderProductInCollection(collection.id, from, to)}
        />
      ) : (
        <div className="flex-1 min-h-[280px] border border-vintiga-slate-200 rounded-vintiga-lg flex items-center justify-center bg-vintiga-white">
          <EmptyState
            icon={<PackageIcon className="w-5 h-5" />}
            title="No Products"
            description="Looks like your collection doesn't have any products yet. Why not start by adding one?"
          />
        </div>
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
      <div className="bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-2xl p-vintiga-lg">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-vintiga-lg min-h-[500px]">
          {/* Left column */}
          <div className="lg:border-r lg:border-vintiga-slate-200 lg:pr-vintiga-lg flex flex-col">
            <CollectionList collections={allCollections} selectedId={selectedId} onSelect={setSelectedId} />
          </div>

          {/* Right column */}
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

        {/* Demo helper — toggle empty state */}
        <div className="mt-vintiga-lg pt-vintiga-md border-t border-vintiga-slate-200 flex items-center gap-vintiga-md">
          <span className="typo-caption text-vintiga-slate-500">Prototype demo:</span>
          <button
            type="button"
            onClick={() => productActions.clearCollections()}
            className="typo-caption font-medium text-vintiga-indigo-600 hover:text-vintiga-indigo-700 transition-colors bg-transparent border-none cursor-pointer"
          >
            Clear all collections
          </button>
        </div>
      </div>
    </OverviewLayout>
  )
}
