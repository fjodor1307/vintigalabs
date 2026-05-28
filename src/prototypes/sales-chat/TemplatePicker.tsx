import { useMemo, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { Tag, type TagTone } from '@ds/shared/Tag'
import { SearchIcon } from '@ds/icons/Icons'
import { TEMPLATES, readCustomerVar, type ChatCustomer, type MessageTemplate, type TemplateCategory } from './chatSamples'

// ─── TemplatePicker ──────────────────────────────────────────────────────────
// Two-step modal:
//   1. List of pre-approved templates, filterable by search + category.
//   2. Variable form for the selected template, with live preview.
// `onSend` returns the rendered body so the parent can append a message.

const CATEGORY_TONE: Record<TemplateCategory, TagTone> = {
  compliance:     'warning',
  marketing:      'info',
  utility:        'success',
  authentication: 'warning',
  service:        'default',
}

const CATEGORY_LABEL: Record<TemplateCategory, string> = {
  compliance:     'Compliance',
  marketing:      'Marketing',
  utility:        'Utility',
  authentication: 'Authentication',
  service:        'Service',
}

interface TemplatePickerProps {
  open: boolean
  onClose: () => void
  onSend: (body: string, templateId: string) => void
  /** When provided, template variables flagged `fillFrom: …` pre-fill from
   *  this customer the moment a template is opened. */
  customer?: ChatCustomer
}

export function TemplatePicker({ open, onClose, onSend, customer }: TemplatePickerProps) {
  const [picked, setPicked] = useState<MessageTemplate | null>(null)
  const [values, setValues] = useState<string[]>([])
  const [query,  setQuery]  = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return TEMPLATES
    return TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        CATEGORY_LABEL[t.category].toLowerCase().includes(q),
    )
  }, [query])

  function handleClose() {
    setPicked(null)
    setValues([])
    setQuery('')
    onClose()
  }

  function selectTemplate(t: MessageTemplate) {
    setPicked(t)
    // Seed the value array from the active customer's profile. Variables
    // without a `fillFrom` start empty; ones we can resolve land pre-filled
    // so the operator skips typing the obvious bits (first name, city, …).
    setValues(
      t.variables.map((v) => (v.fillFrom && customer ? readCustomerVar(customer, v.fillFrom) : '')),
    )
  }

  const rendered = useMemo(() => {
    if (!picked) return ''
    return picked.body.replace(/\{\{(\d+)\}\}/g, (_, i) => {
      const v = values[Number(i) - 1]
      return v && v.length > 0 ? v : `{{${i}}}`
    })
  }, [picked, values])

  const allFilled = picked ? values.every((v) => v.trim().length > 0) : false

  return (
    <Modal open={open} onClose={handleClose} size="lg">
      <ModalHeader
        title={picked ? picked.name : 'Send a template message'}
        description={
          picked
            ? 'Fill in the variables for this template, then send.'
            : "Outside the 24-hour customer service window, only pre-approved templates can be sent."
        }
        onClose={handleClose}
      />

      {!picked && (
        <>
          <ModalBody className="!pb-0">
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates"
              leftIcon={<SearchIcon />}
            />
          </ModalBody>

          <div className="px-vintiga-lg pb-vintiga-lg pt-vintiga-md max-h-[420px] overflow-y-auto flex flex-col gap-vintiga-sm">
            {filtered.length === 0 ? (
              <p className="typo-body-sm text-vintiga-slate-500 py-vintiga-lg text-center">
                No templates match "{query}".
              </p>
            ) : (
              filtered.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTemplate(t)}
                  className="text-left border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white p-vintiga-md flex flex-col gap-vintiga-xs transition-colors hover:border-vintiga-indigo-300 hover:bg-vintiga-indigo-50/30 cursor-pointer"
                >
                  <div className="flex items-center gap-vintiga-sm">
                    <span className="typo-body-sm font-semibold text-vintiga-slate-900 flex-1">
                      {t.name}
                    </span>
                    <Tag variant="filled" tone={CATEGORY_TONE[t.category]} size="sm">
                      {CATEGORY_LABEL[t.category]}
                    </Tag>
                    <span className="typo-caption text-vintiga-slate-400">{t.language}</span>
                  </div>
                  <p className="typo-body-sm text-vintiga-slate-600">{t.body}</p>
                </button>
              ))
            )}
          </div>
        </>
      )}

      {picked && (
        <>
          <ModalBody>
            <div className="flex items-center gap-vintiga-sm">
              <Tag variant="filled" tone={CATEGORY_TONE[picked.category]} size="sm">
                {CATEGORY_LABEL[picked.category]}
              </Tag>
              <span className="typo-caption text-vintiga-slate-500">{picked.language}</span>
            </div>

            <div className="flex flex-col gap-vintiga-sm">
              {picked.variables.map((v, i) => {
                const autoFilled = !!v.fillFrom && (values[i] ?? '').length > 0
                return (
                  <TextField
                    key={i}
                    label={`{{${i + 1}}} — ${v.label}`}
                    value={values[i] ?? ''}
                    onChange={(e) => {
                      const next = [...values]
                      next[i] = e.target.value
                      setValues(next)
                    }}
                    placeholder={v.label}
                    helperText={autoFilled ? 'Auto-filled from customer profile — edit if needed' : undefined}
                  />
                )
              })}
            </div>

            <div className="flex flex-col gap-vintiga-xs">
              <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase tracking-wide">
                Preview
              </span>
              <div className="border border-vintiga-slate-200 rounded-vintiga-md bg-vintiga-slate-50 p-vintiga-md typo-body-sm text-vintiga-slate-700 whitespace-pre-wrap">
                {rendered}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setPicked(null)}>
              Back
            </Button>
            <Button
              variant="solid"
              size="md"
              disabled={!allFilled}
              onClick={() => {
                onSend(rendered, picked.id)
                handleClose()
              }}
            >
              Send template
            </Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}
