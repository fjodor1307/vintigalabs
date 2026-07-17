import { ChevronDownIcon, PlusIcon } from '@ds/icons/Icons'

// ─── ResControls ──────────────────────────────────────────────────────────────
// Small form controls shared by the Add-Reservation page and the hold/block
// modals: a styled native Select, a guest Stepper, and a Time + AM/PM field.

export interface Option { value: string; label: string }

export function Select({
  value,
  onChange,
  options,
  disabled,
  placeholder,
}: {
  value: string
  onChange?: (v: string) => void
  options: Option[]
  disabled?: boolean
  placeholder?: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full px-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 appearance-none focus:outline-none focus:border-vintiga-indigo-500 disabled:bg-vintiga-slate-50 disabled:text-vintiga-slate-400"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDownIcon className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-vintiga-slate-400 pointer-events-none" />
    </div>
  )
}

export function Stepper({ value, onChange, min = 1 }: { value: number; onChange: (v: number) => void; min?: number }) {
  const btn = 'w-10 h-10 inline-flex items-center justify-center rounded-vintiga-md border border-vintiga-slate-200 text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors shrink-0'
  return (
    <div className="flex items-center gap-vintiga-sm">
      <button type="button" aria-label="Decrease" onClick={() => onChange(Math.max(min, value - 1))} className={btn}>
        <span className="block w-3 h-0.5 bg-current rounded" />
      </button>
      <span className="min-w-8 text-center typo-body-sm font-medium text-vintiga-slate-900">{value}</span>
      <button type="button" aria-label="Increase" onClick={() => onChange(value + 1)} className={btn}>
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

export function TimeField({
  time,
  period,
  onTime,
  onPeriod,
  placeholder = '--:--',
}: {
  time: string
  period: 'AM' | 'PM'
  onTime: (v: string) => void
  onPeriod: (v: 'AM' | 'PM') => void
  placeholder?: string
}) {
  return (
    <div className="flex items-center gap-vintiga-sm">
      <input
        value={time}
        onChange={(e) => onTime(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-24 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500"
      />
      <div className="w-20">
        <Select value={period} onChange={(v) => onPeriod(v as 'AM' | 'PM')} options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]} />
      </div>
    </div>
  )
}

/** Plain bordered input matching the DS field height — for date / occasion. */
export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'h-10 w-full px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white',
        'typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400',
        'focus:outline-none focus:border-vintiga-indigo-500',
        props.className ?? '',
      ].join(' ')}
    />
  )
}
