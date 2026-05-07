import { ClubEditorLayout } from './ClubEditorLayout'
import { LevelsEditor } from './LevelsEditor'

// ─── ClubLevelsScreen ─────────────────────────────────────────────────────────
// Account Credit Club only — list of contribution levels (e.g. Silver / Gold /
// Platinum). The editing UI itself lives in `LevelsEditor` so the Levels tab
// in the View Club flow renders the exact same controls.

export function ClubLevelsScreen() {
  return (
    <ClubEditorLayout activeTab="levels">
      <LevelsEditor />
    </ClubEditorLayout>
  )
}
