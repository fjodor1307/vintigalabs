import { useEffect, useRef, useState } from 'react'
import { ProductLayout, SectionCard, Field, TextInput, Select } from './ProductLayout'
import { MediaSection } from './MediaSection'
import { AiSuggestButton } from './AiSuggestButton'
import { Switch } from '@ds/shared/Switch'
import { RichTextEditor } from '@ds/shared/RichTextEditor'
import { useProductState, productActions, type Variant, type ProductState, type ProductTypeOverride } from './productStore'
import { VariantModal } from './VariantModal'
import { VariantFields } from './VariantFields'
import { useRowDrag } from './useRowDrag'
import { EmptyState } from '@ds/components/EmptyState'
import {
  PlusIcon,
  TrashIcon,
  GripVerticalIcon,
  PackagePlusIcon,
  PartyPopperIcon,
  InfoIcon,
} from '@ds/icons/Icons'

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

function VariantsTable({ onEdit, onAdd, isExperience }: { onEdit: (v: Variant) => void; onAdd: () => void; isExperience: boolean }) {
  const { variants } = useProductState()
  const drag = useRowDrag({ onReorder: productActions.reorderVariant })

  if (variants.length === 0) {
    return (
      <div className="border border-dashed border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white">
        <EmptyState
          icon={<PackagePlusIcon className="w-5 h-5" />}
          title="No variants yet"
          description={isExperience ? 'Add a package or party size to start selling.' : 'Add a bottle, glass, or case to start selling.'}
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
      <div className="grid grid-cols-[40px_1.4fr_1fr_100px_100px_110px_40px] items-center gap-4 px-4 py-3 bg-vintiga-slate-50 border-b border-vintiga-slate-200">
        <span />
        <span className="typo-body-sm font-semibold text-vintiga-slate-700">Title</span>
        <span className="typo-body-sm font-semibold text-vintiga-slate-700">SKU</span>
        <span className="typo-body-sm font-semibold text-vintiga-slate-700">Price</span>
        <span className="typo-body-sm font-semibold text-vintiga-slate-700">COGS</span>
        <span className="typo-body-sm font-semibold text-vintiga-slate-700">Tax Type</span>
        <span />
      </div>
      {variants.map((v, i) => (
        <div
          key={v.id}
          {...drag.rowProps(i)}
          className={[
            'grid grid-cols-[40px_1.4fr_1fr_100px_100px_110px_40px] items-center gap-4 px-4 py-3',
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
          <span className="typo-body-sm text-vintiga-slate-700">
            {v.costOfGood ? <>${v.costOfGood}</> : <span className="text-vintiga-slate-400">$0.00</span>}
          </span>
          <span className="typo-body-sm text-vintiga-slate-700">{v.taxType || <span className="text-vintiga-slate-400">—</span>}</span>
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

// When a product has exactly one variant, Commerce7 (and now Vintiga) shows the
// pricing/measurement fields inline on the general page instead of burying them
// in a table — so the alcohol %, weight, and volume stay visible at a glance.
// Adding a second variant flips it back to the table view. The fields
// themselves live in `VariantFields`, shared with the Add/Edit Variant modal
// so the two surfaces stay identical; only the info banner and the sort-order
// field (meaningless with one variant) differ.
function SingleVariantForm({ variant, isSpirits, isExperience }: { variant: Variant; isSpirits: boolean; isExperience: boolean }) {
  function patch<K extends keyof Variant>(key: K, value: Variant[K]) {
    productActions.upsertVariant({ ...variant, [key]: value })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3 rounded-vintiga-md bg-vintiga-indigo-50 px-4 py-3">
        <InfoIcon className="w-5 h-5 text-vintiga-indigo-500 shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="typo-body-sm font-semibold text-vintiga-indigo-700">Info</span>
          <span className="typo-body-sm text-vintiga-indigo-700">
            {isExperience
              ? 'If this experience comes in more than one package or party size, multiple variants can be added after the product is created.'
              : 'If your product has more than one option such as size or color, multiple variants can be added after the product is created.'}
          </span>
        </div>
      </div>

      <VariantFields v={variant} patch={patch} isExperience={isExperience} isSpirits={isSpirits} />
    </div>
  )
}

// Charge types we support natively in Vintiga. `48 hours advance` is a
// Commerce 7-only option for now (it needs a cron job we haven't built); show
// it in the dropdown only when the experience is C7-sourced, so the demo
// doesn't lose data on a synced row.
const VINTIGA_CHARGE_TYPES = ['On Booking', 'On Checkin', 'No Charge']
const ALL_CHARGE_TYPES     = ['On Booking', '48 hours advance', 'On Checkin', 'No Charge']

export function GeneralScreen() {
  const product = useProductState()
  const isExperience = product.productType === 'Experience'
  const syncedFromC7 = product.source === 'commerce7'
  const CHARGE_TYPE_OPTIONS = syncedFromC7 ? ALL_CHARGE_TYPES : VINTIGA_CHARGE_TYPES
  const effectiveType = product.productType === 'Wine' && product.productTypeOverride !== 'None'
    ? product.productTypeOverride
    : product.productType
  // Single variant → inline form; 0 or 2+ → table / empty state.
  const showInlineVariant = product.variants.length === 1
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
    <ProductLayout activeTab="general">
      <SectionCard title="Summary">
        <Field label="Name" required>
          <TextInput
            placeholder="Enter name"
            value={product.name}
            onChange={(e) => productActions.setName(e.target.value)}
          />
        </Field>

        <Field label="Status" required>
          <Select
            value={product.status}
            onChange={(v) => productActions.setStatus(v as typeof product.status)}
            options={['Available', 'Not Available']}
          />
        </Field>

        <Field label="Product Type">
          {product.productType === 'Wine' && product.productTypeOverride !== 'None' ? (
            // Override active — render the local categorisation with the
            // original type in parens (e.g. "Spirits (Wine)").
            <div className="inline-flex w-fit items-center gap-1 px-3 py-1.5 rounded-vintiga-md bg-vintiga-slate-100 typo-body-sm font-semibold text-vintiga-slate-700">
              {effectiveType}
              <span className="font-normal text-vintiga-slate-500">({product.productType})</span>
            </div>
          ) : (
            <div className="inline-flex w-fit items-center px-3 py-1.5 rounded-vintiga-md bg-vintiga-slate-100 typo-body-sm font-semibold text-vintiga-slate-700">
              {effectiveType}
            </div>
          )}
        </Field>

        {product.productType === 'Wine' && (
          <Field
            label="Categorize as"
            helper="Override how Vintiga categorises this product locally — useful when the upstream type doesn't match (e.g. a beer or spirit that came in as Wine). Reports and filters use the categorised value."
          >
            <Select
              value={product.productTypeOverride}
              onChange={(v) => productActions.setProductTypeOverride(v as ProductTypeOverride)}
              options={['None', 'Beer', 'Spirits']}
            />
          </Field>
        )}

        <Field
          label="Content"
          action={<AiSuggestButton onClick={generateContent} generating={generating} iconOnly />}
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
        {!showInlineVariant && (
          <p className="typo-body-sm text-vintiga-slate-500">
            {isExperience
              ? 'Add a variant for each package or party size (e.g. For 2, For 4). Each variant is sold as one bookable unit.'
              : 'Add variants for each option (size, color, etc.). Each variant is counted as one unit.'}
          </p>
        )}
        {showInlineVariant ? (
          <SingleVariantForm variant={product.variants[0]} isSpirits={effectiveType === 'Spirits'} isExperience={isExperience} />
        ) : (
          <VariantsTable onEdit={openEdit} onAdd={openAdd} isExperience={isExperience} />
        )}
      </SectionCard>

      <MediaSection />

      {isExperience && (
        <SectionCard title="Experience Details" icon={<PartyPopperIcon className="w-4 h-4" />}>
          {syncedFromC7 && (
            <div className="flex items-start gap-vintiga-sm rounded-vintiga-md bg-vintiga-slate-50 border border-vintiga-slate-200 px-vintiga-md py-vintiga-sm">
              <InfoIcon className="w-4 h-4 text-vintiga-slate-500 shrink-0 mt-0.5" />
              <span className="typo-caption text-vintiga-slate-600">
                Synced from Commerce 7 — these fields are read-only here. Edit the experience in Commerce 7 and the changes will sync back.
              </span>
            </div>
          )}
          {/* `<fieldset disabled>` cascades to every form control inside —
              cleanest way to lock the entire card when synced from C7. */}
          <fieldset
            disabled={syncedFromC7}
            className={['contents', syncedFromC7 ? 'opacity-75' : ''].join(' ')}
          >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Experience Type" required>
              <Select
                value={product.experienceType}
                onChange={(v) => productActions.setAdvanced({ experienceType: v as ProductState['experienceType'] })}
                options={['Tasting', 'Tour', 'Other']}
              />
            </Field>
            <Field label="Seating Type" required>
              <Select
                value={product.seatingType}
                onChange={(v) => productActions.setAdvanced({ seatingType: v as ProductState['seatingType'] })}
                options={['Communal', 'Table']}
              />
            </Field>
          </div>

          <p className="typo-caption text-vintiga-slate-500 -mt-1">
            Duration, booking interval, guest capacity, and booking dates are set on the <span className="font-semibold text-vintiga-slate-600">Schedule</span> tab.
          </p>

          <Field label="Location" helper="Pick from your locations or enter a custom one.">
            <TextInput
              placeholder="e.g. Reserve Cellar, lower level"
              value={product.location}
              onChange={(e) => productActions.setAdvanced({ location: e.target.value })}
              list="experience-location-presets"
            />
            <datalist id="experience-location-presets">
              <option value="Tasting Room" />
              <option value="Cellar" />
              <option value="Vineyard" />
              <option value="Estate Garden" />
              <option value="Barrel Room" />
            </datalist>
          </Field>

          <Field label="Lead Time" required helper="Minimum hours between booking and the experience.">
            <div className="relative">
              <input
                type="number"
                min={0}
                placeholder="e.g. 24"
                value={product.leadTimeHours}
                onChange={(e) => productActions.setAdvanced({ leadTimeHours: e.target.value })}
                className="h-10 w-full pl-3 pr-14 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <span className="absolute top-1/2 -translate-y-1/2 right-3 typo-body-sm text-vintiga-slate-400 pointer-events-none">hrs</span>
            </div>
          </Field>

          <Field label="Charge Type" required helper="When the customer's card is charged.">
            <Select
              value={product.chargeType}
              onChange={(v) => productActions.setAdvanced({ chargeType: v as ProductState['chargeType'] })}
              options={CHARGE_TYPE_OPTIONS}
            />
          </Field>

          <div className="flex items-start justify-between gap-vintiga-md pt-vintiga-sm">
            <div className="flex flex-col">
              <span className="typo-body-sm font-medium text-vintiga-slate-900">Requires Host</span>
              <span className="typo-caption text-vintiga-slate-500">A staff member must be assigned for the experience to run.</span>
            </div>
            <Switch
              checked={product.requiresHost}
              disabled={syncedFromC7}
              onChange={(next) => productActions.setAdvanced({ requiresHost: next })}
            />
          </div>

          <div className="flex items-start justify-between gap-vintiga-md">
            <div className="flex flex-col">
              <span className="typo-body-sm font-medium text-vintiga-slate-900">Allow customers to cancel online</span>
              <span className="typo-caption text-vintiga-slate-500">If off, customers must call to cancel a booking.</span>
            </div>
            <Switch
              checked={product.allowCancelOnline}
              disabled={syncedFromC7}
              onChange={(next) => productActions.setAdvanced({ allowCancelOnline: next })}
            />
          </div>

          <Field label="Customer Instructions" helper="Emailed to the customer when they book this experience.">
            <RichTextEditor placeholder="e.g. Please arrive 10 minutes early. Parking is on the east lot." />
          </Field>
          </fieldset>
        </SectionCard>
      )}

      <VariantModal open={modalOpen} onClose={close} initial={editing} />
    </ProductLayout>
  )
}
