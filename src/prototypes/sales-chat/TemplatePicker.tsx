import { useMemo, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { Tag, type TagTone } from '@ds/shared/Tag'
import { SearchIcon, LockIcon } from '@ds/icons/Icons'
import {
  TEMPLATES,
  type MessageTemplate,
  type MarketingConsent,
  type TemplateButton,
  type TemplateCategory,
} from './chatSamples'

// ─── TemplatePicker ──────────────────────────────────────────────────────────
// Two-step modal:
//   1. List of pre-approved templates, filterable by search + category.
//   2. Variable form for the selected template, with live preview.
// `onSend` returns the rendered body so the parent can append a message.

const CATEGORY_TONE: Record<TemplateCategory, TagTone> = {
  marketing:      'info',
  utility:        'success',
  authentication: 'warning',
  service:        'default',
}

const CATEGORY_LABEL: Record<TemplateCategory, string> = {
  marketing:      'Marketing',
  utility:        'Utility',
  authentication: 'Authentication',
  service:        'Service',
}

interface TemplatePickerProps {
  open: boolean
  onClose: () => void
  /** Customer's current marketing consent — gates the `marketing` category. */
  consent: MarketingConsent
  onSend: (body: string, templateId: string, buttons?: TemplateButton[]) => void
}

export function TemplatePicker({ open, onClose, consent, onSend }: TemplatePickerProps) {
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
    setValues(new Array(t.variables.length).fill(''))
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
            {consent !== 'opted-in' && (
              <div className="flex items-start gap-vintiga-sm border border-vintiga-orange-200 bg-vintiga-orange-50/40 rounded-vintiga-md px-vintiga-md py-vintiga-sm">
                <LockIcon className="w-4 h-4 text-vintiga-orange-600 mt-0.5 shrink-0" />
                <p className="typo-caption text-vintiga-slate-700">
                  {consent === 'opted-out'
                    ? 'Customer has opted out of marketing. Marketing templates are blocked until they opt back in.'
                    : 'Customer hasn’t opted in to marketing yet. Send the "Marketing opt-in request" template first.'}
                </p>
              </div>
            )}
          </ModalBody>

          <div className="px-vintiga-lg pb-vintiga-lg pt-vintiga-md max-h-[420px] overflow-y-auto flex flex-col gap-vintiga-sm">
            {filtered.length === 0 ? (
              <p className="typo-body-sm text-vintiga-slate-500 py-vintiga-lg text-center">
                No templates match "{query}".
              </p>
            ) : (
              filtered.map((t) => {
                const blocked = t.category === 'marketing' && consent !== 'opted-in'
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={blocked}
                    onClick={() => !blocked && selectTemplate(t)}
                    className={[
                      'text-left border rounded-vintiga-xl p-vintiga-md flex flex-col gap-vintiga-xs transition-colors',
                      blocked
                        ? 'bg-vintiga-slate-50 border-vintiga-slate-200 opacity-60 cursor-not-allowed'
                        : 'bg-vintiga-white border-vintiga-slate-200 hover:border-vintiga-indigo-300 hover:bg-vintiga-indigo-50/30 cursor-pointer',
                    ].join(' ')}
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
                    {t.buttons && t.buttons.length > 0 && (
                      <div className="flex flex-wrap gap-vintiga-xs pt-vintiga-xs">
                        {t.buttons.map((b, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 typo-caption text-vintiga-slate-600 border border-vintiga-slate-200 rounded-full px-2 py-0.5"
                          >
                            {b.kind === 'cta' ? '↗' : '↩'} {b.label}
                          </span>
                        ))}
                      </div>
                    )}
                    {blocked && (
                      <span className="typo-caption text-vintiga-orange-600 font-medium pt-vintiga-xs">
                        Blocked — needs marketing opt-in
                      </span>
                    )}
                  </button>
                )
              })
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
              {picked.variables.map((label, i) => (
                <TextField
                  key={i}
                  label={`{{${i + 1}}} — ${label}`}
                  value={values[i] ?? ''}
                  onChange={(e) => {
                    const next = [...values]
                    next[i] = e.target.value
                    setValues(next)
                  }}
                  placeholder={label}
                />
              ))}
            </div>

            <div className="flex flex-col gap-vintiga-xs">
              <span className="typo-caption font-semibold text-vintiga-slate-500 uppercase tracking-wide">
                Preview
              </span>
              <div className="border border-vintiga-slate-200 rounded-vintiga-md bg-vintiga-slate-50 p-vintiga-md flex flex-col gap-vintiga-sm">
                <p className="typo-body-sm text-vintiga-slate-700 whitespace-pre-wrap">{rendered}</p>
                {picked.buttons && picked.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-vintiga-xs pt-vintiga-xs border-t border-vintiga-slate-200">
                    {picked.buttons.map((b, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 typo-caption font-semibold text-vintiga-indigo-600 border border-vintiga-indigo-200 bg-vintiga-white rounded-full px-2.5 py-1"
                      >
                        {b.kind === 'cta' ? '↗' : '↩'} {b.label}
                      </span>
                    ))}
                  </div>
                )}
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
                onSend(rendered, picked.id, picked.buttons)
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
