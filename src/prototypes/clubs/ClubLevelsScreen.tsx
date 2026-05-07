import { ClubEditorLayout } from './ClubEditorLayout'
import { useClubState, clubActions, type ContributionCadence } from './clubStore'
import { SectionCard } from '@ds/shared/SectionCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Tag } from '@ds/shared/Tag'
import { PlusIcon, TrashIcon } from '@ds/icons/Icons'

// ─── ClubLevelsScreen ─────────────────────────────────────────────────────────
// Account Credit Club only — list of contribution levels (e.g. Silver / Gold /
// Platinum). One level is the default. Each level has a name + dollar amount.

export function ClubLevelsScreen() {
  const club = useClubState()

  return (
    <ClubEditorLayout activeTab="levels">
      <SectionCard
        title={
          <div className="flex flex-col gap-1">
            <span>Levels</span>
            <span className="typo-body-sm font-normal text-vintiga-slate-500">
              Dollar amounts members can contribute to their account balance.
            </span>
          </div>
        }
        action={
          <Button
            variant="outline"
            size="md"
            leftIcon={<PlusIcon />}
            onClick={() => clubActions.addLevel()}
          >
            Add Level
          </Button>
        }
      >
        <div className="flex flex-col gap-vintiga-md">
          {club.levels.map((level, idx) => (
            <div
              key={level.id}
              className="border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-md flex flex-col gap-vintiga-md"
            >
              {/* Header row: title + Default tag/link + delete */}
              <div className="flex items-center justify-between gap-vintiga-md">
                <div className="flex items-center gap-vintiga-sm">
                  <h3 className="typo-body-sm font-semibold text-vintiga-slate-900">
                    Level {idx + 1}
                  </h3>
                  {level.isDefault ? (
                    <Tag variant="filled" tone="default" size="sm">Default</Tag>
                  ) : (
                    <button
                      type="button"
                      onClick={() => clubActions.setLevelDefault(level.id)}
                      className="typo-body-sm font-semibold text-vintiga-slate-700 hover:text-vintiga-indigo-600 underline-offset-2 hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
                <IconButton
                  variant="outline"
                  size="md"
                  icon={<TrashIcon />}
                  aria-label={`Delete Level ${idx + 1}`}
                  onClick={() => clubActions.removeLevel(level.id)}
                />
              </div>

              {/* Fields — Name / Dollar Amount / Cadence in a 3-col row (Figma 5079:46371) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-md">
                <Field label="Level Name" required>
                  <TextField
                    placeholder="e.g., Silver, Gold, Platinum"
                    value={level.name}
                    onChange={(e) => clubActions.patchLevel(level.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Dollar Amount" required>
                  <div className="relative">
                    <input
                      type="number"
                      value={level.amount}
                      onChange={(e) =>
                        clubActions.patchLevel(level.id, { amount: Number(e.target.value) })
                      }
                      className="h-10 w-full pl-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                    />
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 typo-body-sm text-vintiga-slate-400 pointer-events-none">
                      $
                    </span>
                  </div>
                </Field>
                <Field label="Contribution Cadence" required>
                  <Select
                    value={level.cadence}
                    onChange={(e) => clubActions.patchLevel(level.id, { cadence: e.target.value as ContributionCadence })}
                    options={['Monthly', 'Quarterly', 'Annually']}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </ClubEditorLayout>
  )
}
