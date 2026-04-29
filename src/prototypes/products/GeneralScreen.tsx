import { useEffect, useRef, useState } from 'react'
import { ProductLayout, SectionCard, Field, TextInput } from './ProductLayout'
import { MediaSection } from './MediaSection'
import { AiSuggestButton } from './AiSuggestButton'
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

function RichTextEditor({ editorRef }: { editorRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="flex flex-col">
      <RichTextToolbar />
      <div
        ref={editorRef}
        className="min-h-[200px] border border-vintiga-slate-200 rounded-b-vintiga-md bg-vintiga-white px-3 py-3 typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 [&_p]:my-2 [&_strong]:font-semibold"
        contentEditable
        suppressContentEditableWarning
      />
    </div>
  )
}

// ─── Per-field "Suggest with AI" trigger ──────────────────────────────────────
// Reusable secondary button — pass it to <Field action={…}>. Lives in its own
// file (./AiSuggestButton) so POS / Website tabs can import it too.

// ─── Fake "AI" content generator ──────────────────────────────────────────────
// Templated paragraph riffs based on the product name. Good enough for a
// prototype — picks tasting notes and a closer that match red / white / rose.

const RED_NOTES = [
  'dark cherry', 'plum', 'blackcurrant', 'cocoa', 'espresso', 'tobacco', 'cedar', 'vanilla',
]
const WHITE_NOTES = [
  'green apple', 'pear', 'lemon zest', 'white peach', 'honeysuckle', 'wet stone', 'almond', 'crisp citrus',
]
const ROSE_NOTES = [
  'wild strawberry', 'pink grapefruit', 'watermelon', 'rose petals', 'orange blossom', 'fresh raspberry',
]

function pickStyle(name: string): 'red' | 'white' | 'rose' {
  const n = name.toLowerCase()
  if (/rose|rosé/.test(n)) return 'rose'
  if (/(chardonnay|riesling|sauvignon blanc|gris|grigio|pinot blanc|brut|sparkling|white)/.test(n)) return 'white'
  return 'red'
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function generateWineCopy(name: string): string {
  const display = name || 'this wine'
  const style = pickStyle(name)
  const pool = style === 'red' ? RED_NOTES : style === 'white' ? WHITE_NOTES : ROSE_NOTES
  const [a, b, c] = shuffle(pool).slice(0, 3)
  const intros = [
    `<strong>${display}</strong> opens with bright aromatics and quickly settles into a focused, food-friendly profile.`,
    `Hand-harvested and gently pressed, <strong>${display}</strong> shows the precision of small-lot winemaking.`,
    `<strong>${display}</strong> is poured at the tasting room daily — a house favourite that tells the story of the vineyard.`,
  ]
  const palates: Record<typeof style, string[]> = {
    red:   [`Notes of ${a}, ${b}, and ${c} lead a structured palate with supple tannins and a long, savoury finish.`],
    white: [`Layers of ${a}, ${b}, and ${c} carry a crisp, mineral-driven palate balanced by mouth-watering acidity.`],
    rose:  [`Aromas of ${a}, ${b}, and ${c} introduce a dry, vibrant palate with a clean, refreshing finish.`],
  }
  const closers = [
    'Drink now or cellar through the next vintage.',
    'Pairs effortlessly with charcuterie, wood-fired pizza, or a relaxed afternoon on the patio.',
    'A natural fit for the tasting room flight or a thoughtful gift.',
  ]
  const intro  = intros[Math.floor(Math.random() * intros.length)]
  const palate = palates[style][Math.floor(Math.random() * palates[style].length)]
  const closer = closers[Math.floor(Math.random() * closers.length)]
  return `<p>${intro}</p><p>${palate}</p><p>${closer}</p>`
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
  const [generating, setGenerating] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  function generateContent() {
    if (generating) return
    setGenerating(true)
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = generateWineCopy(product.name)
      }
      setGenerating(false)
    }, 700)
  }

  // Page-level: name + content + (eventually more). For now: suggests a name
  // when empty and always regenerates the content.
  function generatePage() {
    if (generating) return
    setGenerating(true)
    setTimeout(() => {
      if (!product.name) {
        const fallback = product.productType === 'Wine' ? '2024 Estate Reserve' : `New ${product.productType || 'product'}`
        productActions.setName(fallback)
      }
      if (editorRef.current) {
        editorRef.current.innerHTML = generateWineCopy(product.name || '2024 Estate Reserve')
      }
      setGenerating(false)
    }, 700)
  }


  // When the page is opened with `?id=p1` (e.g. from the products list),
  // pre-fill the editor with that catalogue row's name + image + collections.
  // Otherwise it's a brand-new product — clear the contentEditable so the
  // previous product's tasting notes don't bleed through.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const query = window.location.hash.split('?')[1] ?? ''
    const id = new URLSearchParams(query).get('id')
    if (id) {
      productActions.loadFromCatalogue(id)
    } else if (editorRef.current) {
      editorRef.current.innerHTML = ''
    }
  }, [])

  function openAdd() { setEditing(null); setModalOpen(true) }
  function openEdit(v: Variant) { setEditing(v); setModalOpen(true) }
  function close() { setModalOpen(false); setEditing(null) }

  return (
    <ProductLayout activeTab="general" onGenerate={generatePage} generating={generating}>
      <MediaSection />

      <SectionCard title="Summary">
        <Field label="Name" required>
          <TextInput
            placeholder="Enter name"
            value={product.name}
            onChange={(e) => productActions.setName(e.target.value)}
          />
        </Field>

        <Field
          label="Content"
          action={<AiSuggestButton onClick={generateContent} generating={generating} />}
        >
          <RichTextEditor editorRef={editorRef} />
        </Field>
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
