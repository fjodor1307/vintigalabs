import { ProductLayout, SectionCard, Field, Select, TextArea } from './ProductLayout'
import { useProductState, productActions } from './productStore'
import { GlobeIcon, WarningIcon } from '@ds/icons/Icons'
import type { ProductState } from './productStore'

function WineGlassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 22h8" />
      <path d="M7 10h10" />
      <path d="M12 15v7" />
      <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-5-1-7H8c-.5 2-1 5-1 7a5 5 0 0 0 5 5z" />
    </svg>
  )
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

const TASTE_LABELS: { key: keyof ProductState['taste']; label: string }[] = [
  { key: 'body',       label: 'Body' },
  { key: 'sweetness',  label: 'Sweetness' },
  { key: 'acidity',    label: 'Acidity' },
  { key: 'tannin',     label: 'Tannin' },
  { key: 'fruitiness', label: 'Fruitiness' },
]

function TasteSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  const pct = ((value - 1) / 4) * 100

  return (
    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
      <span className="typo-body-sm text-vintiga-slate-700">{label}</span>

      <div className="relative h-10 flex items-center">
        {/* track */}
        <div className="relative w-full h-1 rounded-full bg-vintiga-indigo-100">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-vintiga-indigo-600"
            style={{ width: `${pct}%` }}
          />
          {/* tick labels */}
          <div className="absolute inset-x-0 top-3 flex justify-between typo-caption text-vintiga-slate-400">
            {[1, 2, 3, 4, 5].map((n) => <span key={n}>{n}</span>)}
          </div>
        </div>
        {/* native range for interaction */}
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          aria-label={label}
        />
        {/* thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-vintiga-white border-2 border-vintiga-indigo-600 shadow-vintiga-sm pointer-events-none"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function AdvancedScreen() {
  const product = useProductState()

  return (
    <ProductLayout activeTab="advanced">
      {/* ── Global Properties ── */}
      <SectionCard title="Global Properties" icon={<GlobeIcon className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Department">
            <Select
              value={product.department}
              onChange={(v) => productActions.setAdvanced({ department: v })}
              options={['Wine', 'Beer', 'Spirits', 'Food', 'Experience', 'Merchandise']}
            />
          </Field>
          <Field label="Vendor">
            <Select
              value={product.vendor}
              onChange={(v) => productActions.setAdvanced({ vendor: v })}
              options={['Wine', 'House', 'Imported', 'Local']}
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Wine Properties ── */}
      <SectionCard title="Wine Properties" icon={<WineGlassIcon className="w-4 h-4" />}>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Type">
            <Select
              value={product.wineType}
              onChange={(v) => productActions.setAdvanced({ wineType: v })}
              options={['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified']}
            />
          </Field>
          <Field label="Varietal">
            <Select
              value={product.varietal}
              onChange={(v) => productActions.setAdvanced({ varietal: v })}
              options={[
                'Cabernet Sauvignon',
                'Pinot Noir',
                'Merlot',
                'Chardonnay',
                'Sauvignon Blanc',
                'Riesling',
                'Syrah',
                'Zinfandel',
                'Other',
              ]}
            />
          </Field>
          <Field label="Vintage">
            <Select
              value={product.vintage}
              onChange={(v) => productActions.setAdvanced({ vintage: v })}
              options={['NV', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']}
            />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Country">
            <Select
              value={product.country}
              onChange={(v) => productActions.setAdvanced({ country: v })}
              options={['US', 'FR', 'IT', 'ES', 'AR', 'CL', 'AU', 'NZ', 'DE']}
            />
          </Field>
          <Field label="Region">
            <Select
              value={product.region}
              onChange={(v) => productActions.setAdvanced({ region: v })}
              options={['CA', 'OR', 'WA', 'NY', 'Bordeaux', 'Burgundy', 'Tuscany', 'Rioja']}
            />
          </Field>
          <Field label="Appellation">
            <Select
              value={product.appellation}
              onChange={(v) => productActions.setAdvanced({ appellation: v })}
              options={[
                'Napa Valley',
                'Sonoma Valley',
                'Willamette Valley',
                'Columbia Valley',
                'Paso Robles',
                'Russian River Valley',
              ]}
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Taste Profile ── */}
      <SectionCard title="Taste Profile" icon={<SlidersIcon className="w-4 h-4" />}>
        <div className="flex flex-col gap-4">
          {TASTE_LABELS.map(({ key, label }) => (
            <TasteSlider
              key={key}
              label={label}
              value={product.taste[key]}
              onChange={(v) => productActions.setTaste(key, v)}
            />
          ))}
        </div>

        <Field label="Tasting notes" helper="Free-form. Fed into the AI summary — no need for polished marketing copy.">
          <TextArea placeholder="Aromas, palate, finish, food pairing suggestions…" />
        </Field>

        <div className="flex items-start gap-3 bg-vintiga-amber-50 border border-vintiga-amber-100 rounded-vintiga-md px-4 py-3">
          <WarningIcon className="w-4 h-4 text-vintiga-amber-600 shrink-0 mt-0.5" />
          <p className="typo-body-sm text-vintiga-slate-700">
            Switching <span className="font-semibold">Department</span> above swaps this card for a beer, food, or experience profile. Wine shown for the current Add Wine flow.
          </p>
        </div>
      </SectionCard>
    </ProductLayout>
  )
}
