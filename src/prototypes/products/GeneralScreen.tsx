import { useState } from 'react'
import { ProductLayout, SectionCard, Field, TextInput } from './ProductLayout'
import { useProductState, productActions, type Variant } from './productStore'
import { VariantModal } from './VariantModal'
import { useRowDrag } from './useRowDrag'
import { EmptyState } from '@ds/components/EmptyState'
import {
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
  PlusIcon,
  TrashIcon,
  GripVerticalIcon,
  SparklesIcon,
  PackagePlusIcon,
} from '@ds/icons/Icons'

function RichTextToolbar() {
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
    <div className="flex items-center gap-0.5 px-2 py-1.5 border border-vintiga-slate-200 border-b-0 rounded-t-vintiga-md bg-vintiga-white">
      {tools.map((t, i) => {
        const Icon = t.icon
        const isGroupEnd = [1, 4].includes(i)
        return (
          <div key={t.label} className="contents">
            <button
              type="button"
              title={t.label}
              className="w-7 h-7 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
            >
              <Icon className="w-3.5 h-3.5 text-vintiga-slate-600" />
            </button>
            {isGroupEnd && <span className="w-px h-4 bg-vintiga-slate-200 mx-1" />}
          </div>
        )
      })}
    </div>
  )
}

function RichTextEditor() {
  return (
    <div className="flex flex-col">
      <RichTextToolbar />
      <div
        className="min-h-[200px] border border-vintiga-slate-200 rounded-b-vintiga-md bg-vintiga-white px-3 py-3 typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500"
        contentEditable
        suppressContentEditableWarning
      />
    </div>
  )
}

function VariantsTable({ onEdit, onAdd }: { onEdit: (v: Variant) => void; onAdd: () => void }) {
  const { variants } = useProductState()
  const drag = useRowDrag({ onReorder: productActions.reorderVariant })

  if (variants.length === 0) {
    return (
      <div className="border border-dashed border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white">
        <EmptyState
          icon={<PackagePlusIcon className="w-5 h-5" />}
          title="No variants yet"
          description="Add a bottle, glass, or case to start selling."
          action={
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Add Variant
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
      <div className="grid grid-cols-[40px_1fr_1fr_120px_40px] items-center gap-4 px-4 py-3 bg-vintiga-slate-50 border-b border-vintiga-slate-200">
        <span />
        <span className="typo-body-sm font-semibold text-vintiga-slate-700">Title</span>
        <span className="typo-body-sm font-semibold text-vintiga-slate-700">SKU</span>
        <span className="typo-body-sm font-semibold text-vintiga-slate-700">Price</span>
        <span />
      </div>
      {variants.map((v, i) => (
        <div
          key={v.id}
          {...drag.rowProps(i)}
          className={[
            'grid grid-cols-[40px_1fr_1fr_120px_40px] items-center gap-4 px-4 py-3',
            'border-b border-vintiga-slate-200 last:border-b-0',
            'hover:bg-vintiga-slate-50 transition-colors cursor-pointer',
            drag.overIndex === i ? 'bg-vintiga-indigo-50 ring-2 ring-inset ring-vintiga-indigo-500' : '',
          ].join(' ')}
          onClick={() => onEdit(v)}
        >
          <button
            type="button"
            {...drag.handleProps(i)}
            className="w-6 h-6 flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-slate-600 bg-transparent border-none cursor-grab active:cursor-grabbing"
            aria-label={`Drag to reorder ${v.title || 'variant'}`}
          >
            <GripVerticalIcon className="w-4 h-4" />
          </button>
          <span className="typo-body-sm text-vintiga-slate-900">{v.title || <span className="text-vintiga-slate-400">Untitled variant</span>}</span>
          <span className="typo-body-sm text-vintiga-slate-700">{v.sku || <span className="text-vintiga-slate-400">—</span>}</span>
          <span className="typo-body-sm text-vintiga-slate-900">
            {v.price ? <>${v.price}</> : <span className="text-vintiga-slate-400">—</span>}
          </span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); productActions.removeVariant(v.id) }}
            className="w-6 h-6 flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-red-600 bg-transparent border-none cursor-pointer"
            aria-label="Delete variant"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function GeneralScreen() {
  const product = useProductState()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Variant | null>(null)

  function openAdd() { setEditing(null); setModalOpen(true) }
  function openEdit(v: Variant) { setEditing(v); setModalOpen(true) }
  function close() { setModalOpen(false); setEditing(null) }

  return (
    <ProductLayout activeTab="general">
      <SectionCard title="Summary">
        <Field label="Name" required>
          <TextInput
            placeholder="Enter name"
            value={product.name}
            onChange={(e) => productActions.setName(e.target.value)}
          />
        </Field>

        <Field label="Content">
          <RichTextEditor />
        </Field>

        <button
          type="button"
          className="self-start inline-flex items-center gap-1.5 typo-caption font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 transition-colors bg-transparent border-none cursor-pointer"
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          Generate content with AI
        </button>
      </SectionCard>

      <SectionCard
        title="Variants & Pricing"
        action={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add Variant
          </button>
        }
      >
        <p className="typo-body-sm text-vintiga-slate-500">
          Add variants for each option (size, color, etc.). Each variant is counted as one unit.
        </p>
        <VariantsTable onEdit={openEdit} onAdd={openAdd} />
      </SectionCard>

      <VariantModal open={modalOpen} onClose={close} initial={editing} />
    </ProductLayout>
  )
}
