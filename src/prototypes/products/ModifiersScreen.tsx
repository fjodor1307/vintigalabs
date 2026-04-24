import { useState } from 'react'
import { ProductLayout, SectionCard } from './ProductLayout'
import { useProductState, productActions, type ModifierGroup } from './productStore'
import { ModifierGroupModal } from './ModifierGroupModal'
import { useRowDrag } from './useRowDrag'
import { EmptyState } from '@ds/components/EmptyState'
import { PlusIcon, GripVerticalIcon, PencilIcon, ListPlusIcon } from '@ds/icons/Icons'

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

function settingsLabel(g: ModifierGroup): string {
  const parts: string[] = []
  if (g.required) parts.push('Required')
  if (g.multipleOptions) parts.push('Multiple options can be selected')
  else parts.push('Single option only')
  return parts.join(', ')
}

export function ModifiersScreen() {
  const { modifierGroups } = useProductState()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ModifierGroup | null>(null)
  const drag = useRowDrag({ onReorder: productActions.reorderModifierGroup })

  function openAdd() { setEditing(null); setModalOpen(true) }
  function openEdit(g: ModifierGroup) { setEditing(g); setModalOpen(true) }
  function close() { setModalOpen(false); setEditing(null) }

  return (
    <ProductLayout activeTab="modifiers">
      <SectionCard
        title="Modifier Groups"
        icon={<MenuIcon className="w-4 h-4" />}
        action={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add Modifier Group
          </button>
        }
      >
        {modifierGroups.length === 0 ? (
          <div className="border border-dashed border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white">
            <EmptyState
              icon={<ListPlusIcon className="w-5 h-5" />}
              title="No modifier groups yet"
              description="Let guests add sizes, gift wrap, or pairings."
              action={
                <button
                  type="button"
                  onClick={openAdd}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Add Modifier Group
                </button>
              }
            />
          </div>
        ) : (
          <div className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_120px_1fr_80px] items-center gap-4 px-4 py-3 bg-vintiga-slate-50 border-b border-vintiga-slate-200">
              <span />
              <span className="typo-body-sm font-semibold text-vintiga-slate-700">Group</span>
              <span className="typo-body-sm font-semibold text-vintiga-slate-700">Options</span>
              <span className="typo-body-sm font-semibold text-vintiga-slate-700">Settings</span>
              <span />
            </div>
            {modifierGroups.map((g, i) => (
              <div
                key={g.id}
                {...drag.rowProps(i)}
                className={[
                  'grid grid-cols-[40px_1fr_120px_1fr_80px] items-center gap-4 px-4 py-3',
                  'border-b border-vintiga-slate-200 last:border-b-0',
                  'hover:bg-vintiga-slate-50 transition-colors cursor-pointer',
                  drag.overIndex === i ? 'bg-vintiga-indigo-50 ring-2 ring-inset ring-vintiga-indigo-500' : '',
                ].join(' ')}
                onClick={() => openEdit(g)}
              >
                <button
                  type="button"
                  {...drag.handleProps(i)}
                  className="w-6 h-6 flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-slate-600 bg-transparent border-none cursor-grab active:cursor-grabbing"
                  aria-label={`Drag to reorder ${g.name || 'modifier group'}`}
                >
                  <GripVerticalIcon className="w-4 h-4" />
                </button>
                <span className="typo-body-sm text-vintiga-slate-900">{g.name}</span>
                <span className="typo-body-sm text-vintiga-slate-700">{g.options.length}</span>
                <span className="typo-body-sm text-vintiga-slate-700">{settingsLabel(g)}</span>
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); openEdit(g) }}
                    className="w-8 h-8 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
                    aria-label={`Edit ${g.name}`}
                  >
                    <PencilIcon className="w-4 h-4 text-vintiga-slate-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <ModifierGroupModal open={modalOpen} onClose={close} initial={editing} />
    </ProductLayout>
  )
}
