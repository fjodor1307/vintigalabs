// POS Profiles — list. Figma `1626-5128`. Table of every profile in the store
// with search, a store-mode toggle (fakes Stand-Alone vs Commerce7 to demo the
// permission + Add/Get differences), and a row ⋮ menu (Edit Details / Edit
// Collections / Duplicate).

import { useMemo, useState } from 'react'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { IconButton } from '@ds/shared/IconButton'
import { EmptyState } from '@ds/shared/EmptyState'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@ds/shared/Table'
import { SearchIcon, EllipsisVerticalIcon, PlusIcon, DownloadIcon, IdCardIcon } from '@ds/icons/Icons'
import { PosProfilesShell } from './PosProfilesShell'
import { goToProfile } from './nav'
import { AddProfileModal } from './editModals'
import { useProfiles, useStoreMode, setStoreMode, addProfile, duplicateProfile } from './store'
import { blankProfile, type StoreMode } from './data'

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] rounded-vintiga-md bg-vintiga-slate-900 text-vintiga-white px-vintiga-lg py-vintiga-sm typo-body-sm shadow-vintiga-lg animate-[fadeUp_0.3s_ease-out]">
      {message}
    </div>
  )
}

export function ProfilesListScreen() {
  const profiles = useProfiles()
  const mode = useStoreMode()
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  const rows = useMemo(
    () => profiles.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.operationalLocation.toLowerCase().includes(query.toLowerCase())),
    [profiles, query],
  )

  const onCreate = (d: { name: string; operationalLocation: string; colorHex: string; isDefault: boolean }) => {
    const created = addProfile({ ...blankProfile(), ...d })
    goToProfile(created.id)
  }

  return (
    <PosProfilesShell>
      <div className="p-vintiga-xl flex flex-col gap-vintiga-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-vintiga-lg flex-wrap">
          <div>
            <h1 className="typo-title-screen font-semibold text-vintiga-slate-900">POS Profiles</h1>
            <p className="typo-body-sm text-vintiga-slate-500 mt-1">Manage your POS Profiles</p>
          </div>
          <div className="flex items-center gap-vintiga-md">
            <SegmentedControl
              size="sm"
              value={mode}
              onChange={(v: StoreMode) => setStoreMode(v)}
              options={[
                { value: 'standalone', label: 'Stand-Alone' },
                { value: 'c7', label: 'Commerce7' },
              ]}
              aria-label="Store mode"
            />
            {mode === 'standalone' ? (
              <Button variant="solid" size="lg" leftIcon={<PlusIcon />} onClick={() => setAddOpen(true)}>
                Add POS Profile
              </Button>
            ) : (
              <Button variant="solid" size="lg" leftIcon={<DownloadIcon />} onClick={() => flash('Profiles synced from Commerce7')}>
                Get Profiles
              </Button>
            )}
          </div>
        </div>

        {/* Card */}
        <section className="border border-vintiga-slate-200 rounded-vintiga-2xl bg-vintiga-white p-vintiga-lg flex flex-col gap-vintiga-lg">
          <TextField value={query} leftIcon={<SearchIcon />} placeholder="Search Profiles" onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />

          {rows.length === 0 ? (
            <EmptyState
              icon={<IdCardIcon />}
              title={query ? 'No matching profiles' : 'No POS profiles yet'}
              description={query ? 'Try a different search.' : mode === 'standalone' ? 'Add your first POS profile to get started.' : 'Pull profiles from Commerce7.'}
              bordered={false}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>POS Profile</TableHeader>
                  <TableHeader>Operational Location</TableHeader>
                  <TableHeader>Default POS Profile</TableHeader>
                  <TableHeader className="w-12" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.id} onClick={() => goToProfile(p.id)}>
                    <TableCell>
                      <span className="flex items-center gap-vintiga-sm">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.colorHex }} />
                        <span className="typo-body-sm font-medium text-vintiga-slate-900">{p.name}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="typo-body-sm text-vintiga-slate-500">{p.operationalLocation}</span>
                    </TableCell>
                    <TableCell>
                      {p.isDefault && (
                        <span className="inline-flex items-center typo-caption font-medium bg-vintiga-slate-100 text-vintiga-slate-600 px-2.5 py-1 rounded-vintiga-2xl">Yes</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
                        <PopoverMenu
                          trigger={(_open, toggle) => (
                            <IconButton variant="outline" size="md" icon={<EllipsisVerticalIcon />} onClick={toggle} aria-label={`Actions for ${p.name}`} />
                          )}
                          items={[
                            { label: 'Edit Details', onClick: () => goToProfile(p.id, 'details') },
                            { label: 'Edit Collections', onClick: () => goToProfile(p.id, 'collections') },
                            { label: 'Duplicate', onClick: () => { const c = duplicateProfile(p.id); if (c) goToProfile(c.id) } },
                          ]}
                          align="right"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </div>

      {addOpen && <AddProfileModal open onClose={() => setAddOpen(false)} onCreate={onCreate} />}
      {toast && <Toast message={toast} />}
    </PosProfilesShell>
  )
}
