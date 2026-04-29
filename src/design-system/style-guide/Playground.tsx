import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ControlDef =
  | { type: 'boolean'; default: boolean }
  | { type: 'select'; options: string[]; default: string }
  | { type: 'number'; min: number; max: number; step?: number; default: number }
  | { type: 'text'; default: string }
  | { type: 'color'; default: string }

export type ControlSchema = Record<string, ControlDef>

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

type ControlValue = boolean | string | number

interface PlaygroundCtxValue {
  schema: ControlSchema | null
  values: Record<string, ControlValue>
  registerControls: (s: ControlSchema) => void
  setValue: (key: string, value: ControlValue) => void
  clearControls: () => void
}

const PlaygroundCtx = createContext<PlaygroundCtxValue | null>(null)

export function PlaygroundProvider({ children }: { children: React.ReactNode }) {
  const [schema, setSchema] = useState<ControlSchema | null>(null)
  const [values, setValues] = useState<Record<string, ControlValue>>({})

  const registerControls = useCallback((s: ControlSchema) => {
    setSchema(s)
    setValues(Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v.default])))
  }, [])

  const setValue = useCallback((key: string, value: ControlValue) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const clearControls = useCallback(() => {
    setSchema(null)
    setValues({})
  }, [])

  const ctxValue = useMemo(
    () => ({ schema, values, registerControls, setValue, clearControls }),
    [schema, values, registerControls, setValue, clearControls],
  )

  return (
    <PlaygroundCtx.Provider value={ctxValue}>
      {children}
    </PlaygroundCtx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlaygroundContext() {
  return useContext(PlaygroundCtx)
}

/* ── Hook used by component sections ─────────────────────────────── */

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayground(schema: ControlSchema): Record<string, ControlValue> {
  const ctx = useContext(PlaygroundCtx)
  const schemaRef = useRef(schema)

  // Register synchronously before paint — avoids flash of uncontrolled state.
  // Empty deps: we only need to register once on mount; schemaRef holds the schema.
  useLayoutEffect(() => {
    ctx?.registerControls(schemaRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Return context values once registered, otherwise fall back to defaults
  if (!ctx || Object.keys(ctx.values).length === 0) {
    return Object.fromEntries(Object.entries(schema).map(([k, v]) => [k, v.default]))
  }
  return ctx.values
}

/* ------------------------------------------------------------------ */
/*  Control input components                                           */
/* ------------------------------------------------------------------ */

function BoolControl({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex bg-[#f1f5f9] rounded-[6px] p-0.5 w-fit">
      {([false, true] as const).map((opt) => (
        <button
          key={String(opt)}
          type="button"
          onClick={() => onChange(opt)}
          className={[
            'px-3 py-1 rounded-[5px] text-[12px] transition-all cursor-pointer border-none min-w-[46px]',
            value === opt
              ? 'bg-white text-[#0f172a] font-medium shadow-sm'
              : 'bg-transparent text-[#64748b] hover:text-[#374151]',
          ].join(' ')}
        >
          {opt ? 'True' : 'False'}
        </button>
      ))}
    </div>
  )
}

function RadioControl({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
          <button
            type="button"
            onClick={() => onChange(opt)}
            className={[
              'w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer bg-transparent shrink-0',
              value === opt ? 'border-[#0046ad]' : 'border-[#cbd5e1] group-hover:border-[#94a3b8]',
            ].join(' ')}
          >
            {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-[#0046ad]" />}
          </button>
          <span className="text-[12px] text-[#374151]">{opt}</span>
        </label>
      ))}
    </div>
  )
}

function SliderControl({
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-[#94a3b8] shrink-0 w-4 text-right tabular-nums">{min}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 cursor-pointer accent-[#0046ad]"
      />
      <span className="text-[11px] text-[#94a3b8] shrink-0 w-6 tabular-nums">{max}</span>
    </div>
  )
}

function TextControl({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-7 px-2.5 bg-[#f1f5f9] border border-transparent rounded-[6px] text-[12px] text-[#0f172a] focus:outline-none focus:border-[#0046ad] focus:bg-white transition-colors"
    />
  )
}

function ColorControl({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-[3px] border border-[#e2e8f0] shrink-0 relative overflow-hidden cursor-pointer"
        style={{ backgroundColor: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </div>
      <code className="text-[12px] text-[#374151] font-mono">{value}</code>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  ControlsPanel — rendered by DesignSystemScreen in the right rail     */
/* ------------------------------------------------------------------ */

export function ControlsPanel({
  schema,
  values,
  onValueChange,
}: {
  schema: ControlSchema
  values: Record<string, ControlValue>
  onValueChange: (key: string, value: ControlValue) => void
}) {
  return (
    <div className="flex flex-col h-full bg-white border-l border-[#e2e8f0]">

      {/* Header row — same height as the breadcrumb / navbar (57 px) */}
      <div className="flex items-center h-[57px] px-4 bg-[#f8fafc] border-b border-[#e2e8f0] shrink-0">
        <span className="typo-body-sm font-semibold text-[#0f172a]">Controls</span>
      </div>

      {/* Control rows */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(schema).map(([key, def]) => {
          const value = values[key] ?? def.default
          const isRadio = def.type === 'select'

          return (
            <div
              key={key}
              className={[
                'border-b border-[#f1f5f9]',
                isRadio ? 'px-4 py-3' : 'px-4 py-3 grid grid-cols-[110px_1fr] gap-4 items-center',
              ].join(' ')}
            >
              {isRadio ? (
                <>
                  <span className="text-[12px] text-[#374151] block mb-2">{key}</span>
                  <RadioControl
                    value={value as string}
                    options={(def as { type: 'select'; options: string[]; default: string }).options}
                    onChange={(v) => onValueChange(key, v)}
                  />
                </>
              ) : (
                <>
                  <span className="text-[12px] text-[#374151]">{key}</span>
                  <div className="min-w-0">
                    {def.type === 'boolean' && (
                      <BoolControl value={value as boolean} onChange={(v) => onValueChange(key, v)} />
                    )}
                    {def.type === 'number' && (
                      <SliderControl
                        value={value as number}
                        min={(def as { type: 'number'; min: number; max: number; step?: number; default: number }).min}
                        max={(def as { type: 'number'; min: number; max: number; step?: number; default: number }).max}
                        step={(def as { type: 'number'; min: number; max: number; step?: number; default: number }).step}
                        onChange={(v) => onValueChange(key, v)}
                      />
                    )}
                    {def.type === 'text' && (
                      <TextControl value={value as string} onChange={(v) => onValueChange(key, v)} />
                    )}
                    {def.type === 'color' && (
                      <ColorControl value={value as string} onChange={(v) => onValueChange(key, v)} />
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
